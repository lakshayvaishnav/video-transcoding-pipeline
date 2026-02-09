import { z } from "zod";
import { prisma } from "@video-transcoder/database";
import { randomUUID } from "crypto";
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
    });
}
//# sourceMappingURL=upload.js.map