import type { Logger } from "pino";
import { prisma } from "@video-transcoder/database";
import { type KafkaClient, createEvent, generateIdempotencyKeySync } from "@video-transcoder/kafka-client";
import {
  KAFKA_TOPICS,
  DEFAULT_PROFILES,
  type UploadCreatedEvent,
  type TranscodeRequestedEvent,
} from "@video-transcoder/shared-types";
import { config } from "../config.js";
import { checkAndSetProcessed } from "../services/dedup.js";

export async function startUploadConsumer(kafkaClient: KafkaClient, logger: Logger): Promise<void> {
  await kafkaClient.createConsumer(
    config.kafka.groupId,
    [KAFKA_TOPICS.UPLOADS],
    async (event) => {
      if (event.eventType !== "UploadCreated") {
        logger.warn({ eventType: event.eventType }, "Unexpected event type");
        return;
      }

      const uploadEvent = event as UploadCreatedEvent;
      const { uploadId, userId, objectKey } = uploadEvent.data;

      logger.info({ uploadId, userId }, "Processing UploadCreated event");

      try {
        // Idempotency check
        const idempotencyKey = generateIdempotencyKeySync("upload", uploadId, event.eventId);

        const isNew = await checkAndSetProcessed(`job:${idempotencyKey}`);
        if (!isNew) {
          logger.info({ uploadId }, "Duplicate event, skipping");
          return;
        }

        // Check if job already exists for this upload
        const existingJob = await prisma.transcodeJob.findFirst({
          where: { uploadId },
        });

        if (existingJob) {
          logger.info({ uploadId, jobId: existingJob.id }, "Job already exists");
          return;
        }

        // Create transcode job
        const jobId = crypto.randomUUID();
        const outputPrefix = `transcoded/${userId}/${jobId}/`;

        const job = await prisma.transcodeJob.create({
          data: {
            id: jobId,
            uploadId,
            status: "QUEUED",
            profiles: JSON.parse(JSON.stringify(DEFAULT_PROFILES)),
            outputPrefix,
            idempotencyKey,
            priority: 0,
          },
        });

        // Update upload status
        await prisma.upload.update({
          where: { id: uploadId },
          data: { status: "PROCESSING" },
        });

        // Publish TranscodeRequested event
        const transcodeEvent = createEvent<TranscodeRequestedEvent>("TranscodeRequested", {
          jobId: job.id,
          uploadId,
          userId,
          sourceKey: objectKey,
          sourceBucket: "videos",
          outputPrefix,
          profiles: DEFAULT_PROFILES,
          priority: 0,
          idempotencyKey,
          notifyOnComplete: true,
        });

        await kafkaClient.publish(KAFKA_TOPICS.TRANSCODE_JOBS, transcodeEvent, jobId);

        logger.info({ uploadId, jobId, profiles: DEFAULT_PROFILES.length }, "TranscodeRequested event published");
      } catch (error) {
        logger.error({ uploadId, error }, "Failed to process upload event");
        throw error;
      }
    },
    {
      fromBeginning: false,
      onError: (error, rawMessage) => {
        logger.error({ error, rawMessage }, "Consumer error");
      },
    },
  );

  logger.info("Upload consumer started");
}
