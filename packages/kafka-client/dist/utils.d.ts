import type { BaseEvent, KafkaEvent } from "@video-transcoder/shared-types";
export declare function createEventId(): string;
export declare function createTimestamp(): string;
export declare function createBaseEvent(eventType: string): Omit<BaseEvent, "data">;
export declare function createEvent<T extends KafkaEvent>(eventType: T["eventType"], data: T extends BaseEvent & {
    data: infer D;
} ? D : never): T;
export declare function generateIdempotencyKey(...parts: string[]): string;
export declare function generateIdempotencyKeySync(...parts: string[]): string;
//# sourceMappingURL=utils.d.ts.map