// ========================
// Kafka Event Types
// ========================

export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  version: string;
}

// Upload Events
export interface UploadCreatedEvent extends BaseEvent {
  eventType: "UploadCreated";
  data: {
    uploadId: string;
    userId: string;
    objectKey: string;
    bucket: string;
    filename: string;
    contentType: string;
    size: number;
    metadata?: Record<string, unknown>;
  };
}

// Transcode Job Events
export interface TranscodeRequestedEvent extends BaseEvent {
  eventType: "TranscodeRequested";
  data: {
    jobId: string;
    uploadId: string;
    userId: string;
    sourceKey: string;
    sourceBucket: string;
    outputPrefix: string;
    profiles: TranscodeProfile[];
    priority: number;
    idempotencyKey: string;
    notifyOnComplete: boolean;
  };
}

export interface TranscodeProgressEvent extends BaseEvent {
  eventType: "TranscodeProgress";
  data: {
    jobId: string;
    uploadId: string;
    userId: string;
    progress: number;
    currentProfile?: string;
    message?: string;
  };
}

export interface TranscodeCompletedEvent extends BaseEvent {
  eventType: "TranscodeCompleted";
  data: {
    jobId: string;
    uploadId: string;
    userId: string;
    outputs: TranscodeOutput[];
    duration: number; // Processing time in ms
  };
}

export interface TranscodeFailedEvent extends BaseEvent {
  eventType: "TranscodeFailed";
  data: {
    jobId: string;
    uploadId: string;
    userId: string;
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
    attempts: number;
    willRetry: boolean;
  };
}

export type TranscodeEvent = TranscodeRequestedEvent | TranscodeProgressEvent | TranscodeCompletedEvent | TranscodeFailedEvent;

export type KafkaEvent = UploadCreatedEvent | TranscodeEvent;

// ========================
// Transcode Profiles
// ========================

export interface TranscodeProfile {
  name: string;
  width: number;
  height: number;
  bitrate: number; // in bps
  codec: "h264" | "h265" | "vp9" | "av1";
  preset: "ultrafast" | "superfast" | "veryfast" | "faster" | "fast" | "medium" | "slow";
  audioBitrate: number; // in bps
  audioCodec: "aac" | "opus";
}

export interface TranscodeOutput {
  type: "hls_master" | "hls_variant" | "mp4" | "thumbnail" | "poster";
  path: string;
  profileName?: string;
  resolution?: string;
  bitrate?: number;
  size?: number;
  duration?: number;
  manifestUrl?: string;
}

// ========================
// Default Profiles
// ========================

export const DEFAULT_PROFILES: TranscodeProfile[] = [
  {
    name: "1080p",
    width: 1920,
    height: 1080,
    bitrate: 5_000_000,
    codec: "h264",
    preset: "medium",
    audioBitrate: 192_000,
    audioCodec: "aac",
  },
  {
    name: "720p",
    width: 1280,
    height: 720,
    bitrate: 2_500_000,
    codec: "h264",
    preset: "medium",
    audioBitrate: 128_000,
    audioCodec: "aac",
  },
  {
    name: "480p",
    width: 854,
    height: 480,
    bitrate: 1_000_000,
    codec: "h264",
    preset: "medium",
    audioBitrate: 96_000,
    audioCodec: "aac",
  },
  {
    name: "360p",
    width: 640,
    height: 360,
    bitrate: 600_000,
    codec: "h264",
    preset: "medium",
    audioBitrate: 64_000,
    audioCodec: "aac",
  },
  {
    name: "144p",
    width: 256,
    height: 144,
    bitrate: 300_000,
    codec: "h264",
    preset: "medium",
    audioBitrate: 32_000,
    audioCodec: "aac",
  },
];
