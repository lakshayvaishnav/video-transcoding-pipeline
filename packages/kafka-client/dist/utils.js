"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventId = createEventId;
exports.createTimestamp = createTimestamp;
exports.createBaseEvent = createBaseEvent;
exports.createEvent = createEvent;
exports.generateIdempotencyKey = generateIdempotencyKey;
exports.generateIdempotencyKeySync = generateIdempotencyKeySync;
const crypto_1 = require("crypto");
const EVENT_VERSION = "1.0";
function createEventId() {
    return (0, crypto_1.randomUUID)();
}
function createTimestamp() {
    return new Date().toISOString();
}
function createBaseEvent(eventType) {
    return {
        eventId: createEventId(),
        eventType,
        timestamp: createTimestamp(),
        version: EVENT_VERSION,
    };
}
function createEvent(eventType, data) {
    return {
        ...createBaseEvent(eventType),
        data,
    };
}
// Idempotency key generation
function generateIdempotencyKey(...parts) {
    const crypto = globalThis.crypto ?? require("crypto");
    const data = parts.join(":");
    if (crypto.subtle) {
        // Browser/modern Node.js
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        return crypto.subtle.digest("SHA-256", dataBuffer).then((hash) => {
            return Array.from(new Uint8Array(hash))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
        });
    }
    else {
        // Node.js fallback
        const cryptoModule = require("crypto");
        return cryptoModule.createHash("sha256").update(data).digest("hex");
    }
}
function generateIdempotencyKeySync(...parts) {
    const cryptoModule = require("crypto");
    const data = parts.join(":");
    return cryptoModule.createHash("sha256").update(data).digest("hex");
}
//# sourceMappingURL=utils.js.map