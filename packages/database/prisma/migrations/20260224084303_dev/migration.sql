-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OutputType" AS ENUM ('HLS_MASTER', 'HLS_VARIANT', 'MP4', 'THUMBNAIL', 'POSTER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "status" "UploadStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transcode_jobs" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "profiles" JSONB NOT NULL,
    "outputPrefix" TEXT NOT NULL,
    "idempotencyKey" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "error" JSONB,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transcode_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outputs" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" "OutputType" NOT NULL,
    "path" TEXT NOT NULL,
    "profileName" TEXT,
    "resolution" TEXT,
    "bitrate" INTEGER,
    "size" BIGINT,
    "duration" DOUBLE PRECISION,
    "manifestUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outputs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uploads_objectKey_key" ON "uploads"("objectKey");

-- CreateIndex
CREATE INDEX "uploads_userId_idx" ON "uploads"("userId");

-- CreateIndex
CREATE INDEX "uploads_status_idx" ON "uploads"("status");

-- CreateIndex
CREATE UNIQUE INDEX "transcode_jobs_idempotencyKey_key" ON "transcode_jobs"("idempotencyKey");

-- CreateIndex
CREATE INDEX "transcode_jobs_uploadId_idx" ON "transcode_jobs"("uploadId");

-- CreateIndex
CREATE INDEX "transcode_jobs_status_idx" ON "transcode_jobs"("status");

-- CreateIndex
CREATE INDEX "transcode_jobs_createdAt_idx" ON "transcode_jobs"("createdAt");

-- CreateIndex
CREATE INDEX "outputs_jobId_idx" ON "outputs"("jobId");

-- CreateIndex
CREATE INDEX "outputs_type_idx" ON "outputs"("type");

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transcode_jobs" ADD CONSTRAINT "transcode_jobs_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outputs" ADD CONSTRAINT "outputs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "transcode_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
