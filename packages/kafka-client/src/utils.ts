import { randomUUID } from "crypto";
import type { BaseEvent, KafkaEvent } from "@video-transcoder/shared-types";

const EVENT_VERSION = "1.0";

export function createEventId(): string {
  return randomUUID();
}

export function createTimestamp(): string {
  return new Date().toISOString();
}

export function createBaseEvent(eventType: string): Omit<BaseEvent, "data"> {
  return {
    eventId: createEventId(),
    eventType,
    timestamp: createTimestamp(),
    version: EVENT_VERSION,
  };
}

export function createEvent<T extends KafkaEvent>(
  eventType: T["eventType"],
  data: T extends BaseEvent & { data: infer D } ? D : never,
): T {
  return {
    ...createBaseEvent(eventType),
    data,
  } as T;
}

// Idempotency key generation
export function generateIdempotencyKey(...parts: string[]): string {
  const crypto = globalThis.crypto ?? require("crypto");
  const data = parts.join(":");

  if (crypto.subtle) {
    // Browser/modern Node.js
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    return crypto.subtle.digest("SHA-256", dataBuffer).then((hash: ArrayBuffer) => {
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }) as unknown as string;
  } else {
    // Node.js fallback
    const cryptoModule = require("crypto") as typeof import("crypto");
    return cryptoModule.createHash("sha256").update(data).digest("hex");
  }
}

export function generateIdempotencyKeySync(...parts: string[]): string {
  const cryptoModule = require("crypto") as typeof import("crypto");
  const data = parts.join(":");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}
