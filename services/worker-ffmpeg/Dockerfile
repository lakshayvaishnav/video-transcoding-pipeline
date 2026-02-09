FROM node:20-alpine AS base

# Install FFmpeg
RUN apk add --no-cache ffmpeg

RUN corepack enable && corepack prepare pnpm@8.14.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/kafka-client/package.json ./packages/kafka-client/
COPY services/worker-ffmpeg/package.json ./services/worker-ffmpeg/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/services/worker-ffmpeg/node_modules ./services/worker-ffmpeg/node_modules
COPY . .

RUN pnpm --filter @video-transcoder/shared-types build
RUN pnpm --filter @video-transcoder/kafka-client build
RUN pnpm --filter @video-transcoder/worker-ffmpeg build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 worker

# Create temp directory
RUN mkdir -p /tmp/transcode && chown worker:nodejs /tmp/transcode

COPY --from=builder --chown=worker:nodejs /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder --chown=worker:nodejs /app/packages/shared-types/package.json ./packages/shared-types/
COPY --from=builder --chown=worker:nodejs /app/packages/kafka-client/dist ./packages/kafka-client/dist
COPY --from=builder --chown=worker:nodejs /app/packages/kafka-client/package.json ./packages/kafka-client/
COPY --from=builder --chown=worker:nodejs /app/services/worker-ffmpeg/dist ./services/worker-ffmpeg/dist
COPY --from=builder --chown=worker:nodejs /app/services/worker-ffmpeg/package.json ./services/worker-ffmpeg/

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/worker-ffmpeg/node_modules ./services/worker-ffmpeg/node_modules

USER worker

ENV TEMP_DIR=/tmp/transcode

CMD ["node", "services/worker-ffmpeg/dist/index.js"]
