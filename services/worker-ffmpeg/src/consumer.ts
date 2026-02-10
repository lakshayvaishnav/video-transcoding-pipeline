import type { Logger } from "pino";
import { type KafkaClient, createEvent } from "@video-transcoder/kafka-client";
import {
  KAFKA_TOPICS,
  type TranscodeRequestedEvent,
  type TranscodeCompletedEvent,
  type TranscodeFailedEvent,
  type TranscodeProgressEvent,
  type TranscodeOutput,
} from "@video-transcoder/shared-types";
import { config } from "./config.js";
import { downloadSourceFile, cleanupTempDir } from "./utils/fs.js";
import { transcodeToProfile, getVideoMetadata } from "./transcoder.js";
import { generateThumbnails } from "./thumbnail.js";
import { uploadOutputs } from "./uploader.js";

export async function startJobConsumer(kafkaClient: KafkaClient, logger: Logger): Promise<void> {
  await kafkaClient.createConsumer(
    config.kafka.groupId,
    [KAFKA_TOPICS.TRANSCODE_JOBS],
    async (event, _metadata) => {
      if (event.eventType !== "TranscodeRequested") {
        logger.warn({ eventType: event.eventType }, "Unexpected event type");
        return;
      }

      const jobEvent = event as TranscodeRequestedEvent;
      const { jobId, uploadId, userId, sourceKey, sourceBucket, outputPrefix, profiles } = jobEvent.data;

      const jobDir = `${config.tempDir}/${jobId}`;
      const startTime = Date.now();

      logger.info({ jobId, uploadId, profiles: profiles.length }, "Starting transcode job");

      try {
        // Download source file
        const sourcePath = await downloadSourceFile(sourceBucket, sourceKey, jobDir, logger);
        logger.info({ jobId, sourcePath }, "Source file downloaded");

        // Send initial progress
        await publishProgress(kafkaClient, jobId, uploadId, userId, 5, "Downloading complete");

        // Get video metadata to avoid upscaling
        const sourceMetadata = await getVideoMetadata(sourcePath);

        // Filter profiles: keep profiles smaller or equal to source height
        // We add a small tolerance (e.g. 5px) to handle potential rounding or cropping differences
        let profilesToTranscode = profiles.filter((p) => p.height <= sourceMetadata.height + 5);

        if (profilesToTranscode.length === 0) {
          logger.warn(
            { jobId, sourceHeight: sourceMetadata.height },
            "All profiles require upscaling. Using smallest profile as fallback.",
          );
          // If all profiles are larger, just use the smallest one
          const smallestProfile = profiles.reduce((prev, curr) => (prev.height < curr.height ? prev : curr));
          profilesToTranscode = [smallestProfile];
        }

        logger.info(
          {
            jobId,
            sourceHeight: sourceMetadata.height,
            originalCount: profiles.length,
            filteredCount: profilesToTranscode.length,
            profiles: profilesToTranscode.map((p) => p.name),
          },
          "Filtered transcoding profiles",
        );

        const outputs: TranscodeOutput[] = [];
        const variantPlaylists: Array<{ name: string; path: string; bandwidth: number }> = [];

        // Transcode each profile
        for (let i = 0; i < profilesToTranscode.length; i++) {
          const profile = profilesToTranscode[i]!;
          const progress = 10 + Math.floor((i / profilesToTranscode.length) * 70);

          await publishProgress(kafkaClient, jobId, uploadId, userId, progress, `Transcoding ${profile.name}`);

          const { hlsPath } = await transcodeToProfile(sourcePath, jobDir, profile, logger);

          // Track HLS variant for master playlist
          variantPlaylists.push({
            name: profile.name,
            path: hlsPath,
            bandwidth: profile.bitrate,
          });

          outputs.push({
            type: "mp4",
            path: `${outputPrefix}${profile.name}.mp4`,
            profileName: profile.name,
            resolution: `${profile.width}x${profile.height}`,
            bitrate: profile.bitrate,
          });

          outputs.push({
            type: "hls_variant",
            path: `${outputPrefix}hls/${profile.name}/playlist.m3u8`,
            profileName: profile.name,
            resolution: `${profile.width}x${profile.height}`,
            bitrate: profile.bitrate,
          });
        }

        await publishProgress(kafkaClient, jobId, uploadId, userId, 80, "Generating master playlist");

        // Generate master HLS playlist
        // const masterPlaylistPath = await generateHlsPlaylist(jobDir, variantPlaylists, logger);
        // outputs.push({
        //   type: 'hls_master',
        //   path: `${outputPrefix}hls/master.m3u8`,
        //   manifestUrl: `${outputPrefix}hls/master.m3u8`,
        // });

        await publishProgress(kafkaClient, jobId, uploadId, userId, 85, "Generating thumbnails");

        // Generate thumbnails
        const thumbnails = await generateThumbnails(sourcePath, jobDir, logger);
        for (const thumb of thumbnails) {
          outputs.push({
            type: thumb.isPoster ? "poster" : "thumbnail",
            path: `${outputPrefix}${thumb.filename}`,
          });
        }

        await publishProgress(kafkaClient, jobId, uploadId, userId, 90, "Uploading outputs");

        // Upload all outputs to S3
        await uploadOutputs(jobDir, outputPrefix, outputs, logger);

        // Publish completion
        const completedEvent = createEvent<TranscodeCompletedEvent>("TranscodeCompleted", {
          jobId,
          uploadId,
          userId,
          outputs,
          duration: Date.now() - startTime,
        });

        await kafkaClient.publish(KAFKA_TOPICS.TRANSCODE_RESULTS, completedEvent, jobId);
        logger.info({ jobId, duration: Date.now() - startTime }, "Transcode job completed");

        // Cleanup
        await cleanupTempDir(jobDir);
      } catch (error) {
        logger.error({ jobId, error }, "Transcode job failed");

        const failedEvent = createEvent<TranscodeFailedEvent>("TranscodeFailed", {
          jobId,
          uploadId,
          userId,
          error: {
            code: "TRANSCODE_ERROR",
            message: error instanceof Error ? error.message : "Unknown error",
            details: error,
          },
          attempts: 1,
          willRetry: false, // In production, implement retry logic
        });

        await kafkaClient.publish(KAFKA_TOPICS.TRANSCODE_RESULTS, failedEvent, jobId);

        // Cleanup on error too
        await cleanupTempDir(jobDir).catch(() => {});
      }
    },
    {
      fromBeginning: false,
      onError: (error) => {
        logger.error({ error }, "Job consumer error");
      },
    },
  );

  logger.info("Job consumer started");
}

async function publishProgress(
  kafkaClient: KafkaClient,
  jobId: string,
  uploadId: string,
  userId: string,
  progress: number,
  message: string,
): Promise<void> {
  const progressEvent = createEvent<TranscodeProgressEvent>("TranscodeProgress", {
    jobId,
    uploadId,
    userId,
    progress,
    message,
  });

  await kafkaClient.publish(KAFKA_TOPICS.TRANSCODE_RESULTS, progressEvent, jobId);
}
