export interface BaseEvent {
    eventId: string;
    eventType: string;
    timestamp: string;
    version: string;
}
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
        duration: number;
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
export interface TranscodeProfile {
    name: string;
    width: number;
    height: number;
    bitrate: number;
    codec: "h264" | "h265" | "vp9" | "av1";
    preset: "ultrafast" | "superfast" | "veryfast" | "faster" | "fast" | "medium" | "slow";
    audioBitrate: number;
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
export declare const DEFAULT_PROFILES: TranscodeProfile[];
//# sourceMappingURL=events.d.ts.map