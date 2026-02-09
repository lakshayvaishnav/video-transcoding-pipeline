import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@video-transcoder/database";
import { getKafkaClient } from "../services/index.js";
import { createEvent } from "@video-transcoder/kafka-client";
import { KAFKA_TOPICS, type UploadCreatedEvent } from "@video-transcoder/shared-types";

// S3 event notification schema (simplified)
const s3EventSchema = z.object({
  Records: z.array(
    z.object({
      eventSource: z.literal("aws:s3"),
      eventName: z.string(),
      s3: z.object({
        bucket: z.object({
          name: z.string(),
        }),
        object: z.object({
          key: z.string(),
          size: z.number().optional(),
        }),
      }),
    }),
  ),
});

export async function webhookRoutes(app: FastifyInstance) {
  /**
   * POST /api/webhooks/s3
   * Handle S3 upload completion notifications
   * This is for scenarios where S3 sends event notifications
   */
  //   app.post(
  //     "/s3",
  //     {
  //       schema: {
  //         description: "Handle S3 event notifications",
  //         tags: ["Webhooks"],
  //       },
  //     },
  //     async (request, reply) => {
  //       try {
  //         const event = s3EventSchema.parse(request.body);

  //         for (const record of event.Records) {
  //           if (!record.eventName.startsWith("ObjectCreated:")) {
  //             continue;
  //           }

  //           const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
  //           const bucket = record.s3.bucket.name;

  //           // Find upload by object key
  //           const upload = await prisma.upload.findFirst({
  //             where: {
  //               objectKey,
  //               status: "PENDING",
  //             },
  //           });

  //           if (!upload) {
  //             request.log.warn({ objectKey }, "Upload not found for S3 event");
  //             continue;
  //           }

  //           // Update upload status
  //           await prisma.upload.update({
  //             where: { id: upload.id },
  //             data: { status: "UPLOADED" },
  //           });

  //           // Publish event
  //           const uploadEvent = createEvent<UploadCreatedEvent>("UploadCreated", {
  //             uploadId: upload.id,
  //             userId: upload.userId,
  //             objectKey: upload.objectKey,
  //             bucket,
  //             filename: upload.filename,
  //             contentType: upload.contentType,
  //             size: Number(upload.size),
  //             metadata: upload.metadata as Record<string, unknown> | undefined,
  //           });

  //           await getKafkaClient().publish(KAFKA_TOPICS.UPLOADS, uploadEvent, upload.userId);

  //           request.log.info({ uploadId: upload.id, objectKey }, "S3 upload event processed");
  //         }

  //         return reply.status(200).send({ status: "ok" });
  //       } catch (error) {
  //         request.log.error(error, "Failed to process S3 webhook");
  //         throw error;
  //       }
  //     },
  //   );

  /**
   * POST /api/webhooks/minio
   * Handle MinIO webhook notifications (for local dev)
   * MinIO uses a different format than S3
   */
  app.post(
    "/minio",
    {
      schema: {
        description: "Handle MinIO webhook notifications (local dev)",
        tags: ["Webhooks"],
      },
    },
    async (request, reply) => {
      const body = request.body as {
        EventName?: string;
        Key?: string;
        Records?: Array<{
          s3?: {
            bucket?: { name?: string };
            object?: { key?: string; size?: number };
          };
        }>;
      };

      // MinIO can send events in different formats
      const records = body.Records ?? [];

      for (const record of records) {
        const objectKey = record.s3?.object?.key;
        const bucket = record.s3?.bucket?.name;

        if (!objectKey || !bucket) continue;

        const upload = await prisma.upload.findFirst({
          where: {
            objectKey,
            status: "PENDING",
          },
        });

        if (!upload) {
          request.log.warn({ objectKey }, "Upload not found for MinIO event");
          continue;
        }

        await prisma.upload.update({
          where: { id: upload.id },
          data: { status: "UPLOADED" },
        });

        const uploadEvent = createEvent<UploadCreatedEvent>("UploadCreated", {
          uploadId: upload.id,
          userId: upload.userId,
          objectKey: upload.objectKey,
          bucket,
          filename: upload.filename,
          contentType: upload.contentType,
          size: Number(upload.size),
          metadata: upload.metadata as Record<string, unknown> | undefined,
        });

        await getKafkaClient().publish(KAFKA_TOPICS.UPLOADS, uploadEvent, upload.userId);
        request.log.info({ uploadId: upload.id }, "MinIO upload event processed");
      }

      return reply.status(200).send({ status: "ok" });
    },
  );
}
