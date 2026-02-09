"use strict";
// ========================
// Kafka Event Types
// ========================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PROFILES = void 0;
// ========================
// Default Profiles
// ========================
exports.DEFAULT_PROFILES = [
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
//# sourceMappingURL=events.js.map