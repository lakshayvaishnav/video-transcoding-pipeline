export * from "./events.js";
export * from "./api.js";

// Kafka Topics
export const KAFKA_TOPICS = {
  UPLOADS: "uploads",
  TRANSCODE_JOBS: "transcode-jobs",
  TRANSCODE_RESULTS: "transcode-results",
  TRANSCODE_DLQ: "transcode-dlq",
  NOTIFICATIONS: "notifications",
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
