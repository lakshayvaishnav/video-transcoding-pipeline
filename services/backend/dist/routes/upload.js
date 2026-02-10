import { z } from "zod";
import { prisma } from "@video-transcoder/database";
import { randomUUID } from "crypto";
import { generatePresignedUploadUrl } from "../services/s3.js";
const presignRequestSchema = z.object({
    filename: z.string().min(1).max(255),
    contentType: z.string().regex(/^video\//),
    size: z
        .number()
        .int()
        .positive()
        .max(10 * 1024 * 1024 * 1024), // 10 gb max
});
export async function uploadRoutes(app) {
    // Middleware to require auth
    app.addHook("preHandler", async (request, reply) => {
        try {
            await request.jwtVerify();
            const user = request.user;
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { id: true }, // Only fetch ID to be lighter
            });
            if (!dbUser) {
                throw new Error("User not found");
            }
        }
        catch {
            reply.status(401).send({
                statusCode: 401,
                error: "Unauthorized",
                message: "Invalid or missing authentication token",
            });
        }
    });
    app.post("/presign", {
        schema: {
            description: "Generate a presigned URL for video upload",
            tags: ["Upload"],
            security: [{ bearerAuth: [] }],
            body: {
                type: "object",
                required: ["filename", "contentType", "size"],
                properties: {
                    filename: { type: "string", description: "Original filename" },
                    contentType: { type: "string", description: "MIME type (must be video/*)" },
                    size: { type: "number", description: "File size in bytes" },
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        uploadId: { type: "string" },
                        uploadUrl: { type: "string", description: "Presigned S3 URL" },
                        objectKey: { type: "string" },
                        expiresIn: { type: "number" },
                    },
                },
            },
        },
    }, async (request, reply) => {
        const user = request.user;
        const body = presignRequestSchema.parse(request.body);
        // Rate limit: 10 uploads per minute per user
        // add rate limiting logic here....
        const uploadId = randomUUID();
        const extension = body.filename.split(".").pop() ?? "mp4";
        const objectKey = `uploads/${user.id}/${uploadId}.${extension}`;
        await prisma.upload.create({
            data: {
                id: uploadId,
                userId: user.id,
                objectKey,
                filename: body.filename,
                contentType: body.contentType,
                size: BigInt(body.size),
                status: "PENDING",
            },
        });
        // generate presigned url
        const presigned = await generatePresignedUploadUrl(objectKey, body.contentType);
        return reply.send({
            uploadId,
            uploadUrl: presigned.uploadUrl,
            objectKey: presigned.objectKey,
            expiresIn: presigned.expiresIn,
        });
    });
    app.post("/:uploadId/complete", {
        schema: {
            description: "Notify that an upload has completed",
            tags: ["Upload"],
            security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                required: ["uploadId"],
                properties: {
                    uploadId: { type: "string", format: "uuid" },
                },
            },
        },
    }, async (request, reply) => {
        const user = request.user;
        const { uploadId } = request.params;
        // Find and validate upload ownership
        const upload = await prisma.upload.findFirst({
            where: {
                id: uploadId,
                userId: user.id,
            },
        });
        if (!upload) {
            return reply.status(404).send({
                statusCode: 404,
                error: "Not Found",
                message: "Upload not found",
            });
        }
        if (upload.status !== "PENDING") {
            return reply.status(400).send({
                statusCode: 400,
                error: "Bad Request",
                message: `Upload already has status: ${upload.status}`,
            });
        }
        // Update status and emit event
        await prisma.upload.update({
            where: { id: uploadId },
            data: { status: "UPLOADED" },
        });
        // Import Kafka client and publish event
        const { getKafkaClient } = await import("../services/index.js");
        const { createEvent } = await import("@video-transcoder/kafka-client");
        const { KAFKA_TOPICS } = await import("@video-transcoder/shared-types");
        const event = createEvent("UploadCreated", {
            uploadId: upload.id,
            userId: upload.userId,
            objectKey: upload.objectKey,
            bucket: "videos",
            filename: upload.filename,
            contentType: upload.contentType,
            size: Number(upload.size),
            metadata: upload.metadata,
        });
        await getKafkaClient().publish(KAFKA_TOPICS.UPLOADS, event, upload.userId);
        request.log.info({ uploadId, userId: user.id }, "Upload completed, event published");
        return reply.status(200).send({ status: "ok", uploadId });
    });
}
//# sourceMappingURL=upload.js.map