export interface BaseEvent {
  eventId: string;
  eventType: string;
  timeStamp: string;
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

// Transcode Job events
export interface TranscodeRequestedEvents extends BaseEvent {
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
