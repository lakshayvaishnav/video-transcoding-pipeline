export interface BaseEvent {
    eventId: string;
    eventType: string;
    timeStamp: string;
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
//# sourceMappingURL=events.d.ts.map