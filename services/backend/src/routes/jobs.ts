import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@video-transcoder/database";
import { cacheGet, cacheSet } from "../services/redis.js";
import { generatePresignedDownloadUrl } from "../services/s3.js";
import { config } from "../config.js";

const jobListQuerySchema = z.object({
  status: z.enum(["PENDING", "QUEUED", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export async function jobRoutes(app: FastifyInstance) {
  // Require auth for all routes
  app.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid or missing authentication token",
      });
    }
  });

  app.get(
    "/",
    {
      schema: {
        description: "List transcode jobs for the current user",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["PENDING", "QUEUED", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"],
            },
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 20, maximum: 100 },
          },
        },
      },
    },
    async (request, reply) => {
      const user = request.user as { id: string };
      const query = jobListQuerySchema.parse(request.query);

      const skip = (query.page - 1) * query.limit;

      const [jobs, total] = await Promise.all([
        prisma.transcodeJob.findMany({
          where: {
            upload: { userId: user.id },
            ...(query.status ? { status: query.status } : {}),
          },
          include: {
            upload: {
              select: { filename: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: query.limit,
        }),
        prisma.transcodeJob.count({
          where: {
            upload: { userId: user.id },
            ...(query.status ? { status: query.status } : {}),
          },
        }),
      ]);

      const jobSummaries = jobs.map((job: (typeof jobs)[number]) => ({
        id: job.id,
        uploadId: job.uploadId,
        filename: job.upload.filename,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt.toISOString(),
        finishedAt: job.finishedAt?.toISOString(),
      }));

      return reply.send({
        jobs: jobSummaries,
        total,
        page: query.page,
        limit: query.limit,
        hasMore: skip + jobs.length < total,
      });
    },
  );

  app.get<{ Params: { jobId: string } }>(
    "/:jobId",
    {
      schema: {
        description: "Get job details with output URLs",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["jobId"],
          properties: {
            jobId: { type: "string", format: "uuid" },
          },
        },
      },
    },
    async (request, reply) => {
      const user = request.user as { id: string };
      const { jobId } = request.params;

      // Check cache first
      const cacheKey = `job:${jobId}`;
      const cached = await cacheGet<{ job: unknown; userId: string }>(cacheKey);

      if (cached && cached.userId === user.id) {
        return reply.send(cached.job);
      }

      // Fetch from database
      const job = await prisma.transcodeJob.findFirst({
        where: {
          id: jobId,
          upload: { userId: user.id },
        },
        include: {
          upload: {
            select: { filename: true },
          },
          outputs: true,
        },
      });

      if (!job) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Job not found",
        });
      }

      // Generate presigned URLs for outputs
      const outputsWithUrls = await Promise.all(
        job.outputs.map(async (output: (typeof job.outputs)[number]) => ({
          id: output.id,
          type: output.type,
          profileName: output.profileName,
          resolution: output.resolution,
          url: await generatePresignedDownloadUrl(config.s3.bucketOutputs, output.path, 3600),
          size: output.size ? Number(output.size) : undefined,
          duration: output.duration ?? undefined,
        })),
      );

      const profiles = Array.isArray(job.profiles) ? (job.profiles as Array<{ name: string }>).map((p) => p.name) : [];

      const response = {
        id: job.id,
        uploadId: job.uploadId,
        filename: job.upload.filename,
        status: job.status,
        progress: job.progress,
        profiles,
        outputs: outputsWithUrls,
        error: job.error as { code: string; message: string } | undefined,
        createdAt: job.createdAt.toISOString(),
        startedAt: job.startedAt?.toISOString(),
        finishedAt: job.finishedAt?.toISOString(),
      };

      // Cache if job is completed (immutable)
      if (job.status === "COMPLETED" || job.status === "FAILED") {
        await cacheSet(cacheKey, { job: response, userId: user.id }, 3600);
      }

      return reply.send(response);
    },
  );
}
