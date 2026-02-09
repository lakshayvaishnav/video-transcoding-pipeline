import type { Logger } from "pino";
import { prisma } from "@video-transcoder/database";
import type { KafkaClient } from "@video-transcoder/kafka-client";
import {
  KAFKA_TOPICS,
  type TranscodeCompletedEvent,
  type TranscodeFailedEvent,
  type TranscodeProgressEvent,
} from "@video-transcoder/shared-types";
import { config } from "../config.js";

export async function startResultsConsumer(kafkaClient: KafkaClient, logger: Logger): Promise<void> {
  await kafkaClient.createConsumer(
    `${config.kafka.groupId}-results`,
    [KAFKA_TOPICS.TRANSCODE_RESULTS],
    async (event) => {
      const eventType = event.eventType;

      switch (eventType) {
        case "TranscodeProgress":
          await handleProgress(event as TranscodeProgressEvent, logger);
          break;
        case "TranscodeCompleted":
          await handleCompleted(event as TranscodeCompletedEvent, logger);
          break;
        case "TranscodeFailed":
          await handleFailed(event as TranscodeFailedEvent, logger);
          break;
        default:
          logger.warn({ eventType }, "Unknown event type in results");
      }
    },
    {
      fromBeginning: false,
      onError: (error) => {
        logger.error({ error }, "Results consumer error");
      },
    },
  );

  logger.info("Results consumer started");
}

async function handleProgress(event: TranscodeProgressEvent, logger: Logger): Promise<void> {
  const { jobId, progress, currentProfile } = event.data;

  await prisma.transcodeJob.update({
    where: { id: jobId },
    data: { progress },
  });

  logger.debug({ jobId, progress, currentProfile }, "Job progress updated");
}

async function handleCompleted(event: TranscodeCompletedEvent, logger: Logger): Promise<void> {
  const { jobId, uploadId, outputs, duration } = event.data;

  logger.info({ jobId, uploadId, outputCount: outputs.length }, "Processing completion");

  // Create output records
  const outputRecords = outputs.map((output) => ({
    jobId,
    type: output.type.toUpperCase().replace("-", "_") as "HLS_MASTER" | "HLS_VARIANT" | "MP4" | "THUMBNAIL" | "POSTER",
    path: output.path,
    profileName: output.profileName,
    resolution: output.resolution,
    bitrate: output.bitrate,
    size: output.size ? BigInt(output.size) : null,
    duration: output.duration,
    manifestUrl: output.manifestUrl,
  }));

  await prisma.$transaction([
    prisma.output.createMany({
      data: outputRecords,
    }),
    prisma.transcodeJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        progress: 100,
        finishedAt: new Date(),
      },
    }),
    prisma.upload.update({
      where: { id: uploadId },
      data: { status: "COMPLETED" },
    }),
  ]);

  logger.info({ jobId, uploadId, duration: `${duration}ms`, outputs: outputs.length }, "Job completed successfully");
}

async function handleFailed(event: TranscodeFailedEvent, logger: Logger): Promise<void> {
  const { jobId, uploadId, error, attempts, willRetry } = event.data;

  logger.warn({ jobId, uploadId, error, attempts, willRetry }, "Job failed");

  if (willRetry) {
    // Update attempt count but keep status as QUEUED for retry
    await prisma.transcodeJob.update({
      where: { id: jobId },
      data: {
        attempts,
        error: error as object,
      },
    });
  } else {
    // Final failure
    await prisma.$transaction([
      prisma.transcodeJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          attempts,
          error: error as object,
          finishedAt: new Date(),
        },
      }),
      prisma.upload.update({
        where: { id: uploadId },
        data: { status: "FAILED" },
      }),
    ]);
  }
}
