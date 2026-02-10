# Video Transcoder Platform

A scalable, event-driven video transcoding platform built with a microservices architecture. It handles video uploads, distributed transcoding using FFmpeg, and delivery via HLS/MP4.

## 🏗 System Architecture

The system is composed of several microservices communicating via **Kafka** (Redpanda) for event streaming and **gRPC/HTTP** for synchronous operations.

```mermaid
graph TD
    Client[Client App] -->|Upload Video| API[Backend Service]
    API -->|Metadata| DB[(PostgreSQL)]
    API -->|Upload File| S3[(MinIO / S3)]
    API -->|UploadCreated Event| Kafka{Kafka / Redpanda}

    subgraph "Event Pipeline"
        Kafka -->|Consume Uploads| Orch[Orchestrator Service]
        Orch -->|Create Job| DB
        Orch -->|TranscodeRequested Event| Kafka

        Kafka -->|Consume Jobs| Worker[Worker Service (FFmpeg)]
        Worker -->|Download Source| S3
        Worker -->|Transcode| Worker
        Worker -->|Upload Outputs| S3
        Worker -->|TranscodeCompleted Event| Kafka

        Kafka -->|Consume Results| Orch
        Orch -->|Update Status| DB
    end

    Client -->|Poll Status / Webhooks| API
```

## 🚀 Key Features

- **Scalable Microservices**: Decoupled architecture allowing independent scaling of API, Orchestrator, and Workers.
- **Event-Driven**: Fully asynchronous processing pipeline using Kafka.
- **Resilient Uploads**: Presigned URLs for direct-to-S3 uploads.
- **Adaptive Bitrate Streaming**: Automatically generates HLS playlists (master & variant) and MP4 fallbacks.
- **Metadata Extraction**: Extracts resolution, duration, and other metadata from source videos.
- **Idempotency**: Robust event processing with deduplication to handle at-least-once delivery.
- **Smart Transcoding**: Skips upscaling if source quality is lower than target profile_s.

## 🛠 Tech Stack

- **Languages**: TypeScript (Node.js)
- **Frameworks**: Fastify (Backend), Custom Event Consumers
- **Messaging**: Kafka (Redpanda)
- **Database**: PostgreSQL (Prisma ORM)
- **Storage**: MinIO (S3 Compatible)
- **Caching/Locks**: Redis
- **Processing**: FFmpeg
- **Frontend**: Next.js (React)
- **DevOps**: Docker Compose, TurboRepo

## 📦 Services Overview

### 1. **Backend Service (`services/backend`)**

- **Role**: Entry point for clients.
- **Responsibilities**:
  - Authentication (JWT).
  - Generates presigned S3 URLs for uploads.
  - Exposes APIs for job status and video retrieval.
  - Publishes `UploadCreated` events to Kafka.

### 2. **Orchestrator Service (`services/orchestrator`)**

- **Role**: The brain of the operation.
- **Responsibilities**:
  - Consumes `UploadCreated`.
  - Determine transcoding profiles (1080p, 720p, etc.) and creates `TranscodeJob`.
  - Publishes `TranscodeRequested` to various topic partitions.
  - Consumes `TranscodeCompleted` / `TranscodeFailed` to update job status in DB.

### 3. **Worker Service (`services/worker-ffmpeg`)**

- **Role**: The muscle.
- **Responsibilities**:
  - Consumes `TranscodeRequested`.
  - Downloads video from S3 to local temp storage.
  - Runs FFmpeg to transcode video into configured profiles.
  - Generates thumbnails and HLS playlists.
  - Uploads artifacts back to S3.
  - Publishes `TranscodeCompleted` or `TranscodeFailed`.

## 🔄 Data Flow & Kafka Topics

| Topic               | Producer     | Consumer         | Purpose                                         |
| ------------------- | ------------ | ---------------- | ----------------------------------------------- |
| `uploads`           | Backend      | Orchestrator     | Signal that a new raw video is available in S3. |
| `transcode-jobs`    | Orchestrator | Worker           | Request to start transcoding a specific video.  |
| `transcode-results` | Worker       | Orchestrator     | Status updates (Progress, Success, Failure).    |
| `notifications`     | Orchestrator | Notification Svc | (Planned) Send emails/webhooks to users.        |

## 💻 Local Development Setup

### Prerequisites

- Docker & Docker Compose
- Node.js (v20+)
- pnpm

### Getting Started

1. **Start Infrastructure**:

   ```bash
   pnpm run docker:up
   ```

   This spins up Redpanda, Postgres, Redis, and MinIO.

2. **Install Dependencies**:

   ```bash
   pnpm install
   ```

3. **Database Migration**:

   ```bash
   pnpm db:push
   ```

4. **Start All Services**:

   ```bash
   pnpm dev
   ```

5. **Access Interfaces**:
   - **Backend API**: `http://localhost:3001`
   - **API Docs (Swagger)**: `http://localhost:3001/docs`
   - **Redpanda Console**: `http://localhost:8080`
   - **MinIO Console**: `http://localhost:9001`

## 🔮 Future Roadmap (Not yet implemented)

- [ ] **Webhooks**: Notify external systems on job completion.
- [ ] **Dynamic Profiles**: Select encoding profiles based on source metadata analysis.
- [ ] **Hardware Acceleration**: NVENC/QSV support in workers.
- [ ] **DASH Support**: Add MPEG-DASH output alongside HLS.
- [ ] **CDN Integration**: Pre-sign CloudFront URLs for delivery.
- [ ] **Video Player**: video player for hls adaptive streaming
