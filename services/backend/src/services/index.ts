import { createKafkaClient, type KafkaClient } from "@video-transcoder/kafka-client";
import { config } from "../config.js";
import { getRedis, closeRedis } from "./redis.js";

let kafkaClient: KafkaClient | null = null;

export function getKafkaClient(): KafkaClient {
  if (!kafkaClient) {
    kafkaClient = createKafkaClient({
      brokers: config.kafka.brokers,
      clientId: "bff-service",
      logLevel: config.server.nodeEnv === "development" ? "debug" : "warn",
    });
  }
  return kafkaClient;
}

export async function initServices(): Promise<void> {
  console.info("[Services] Initializing...");

  // Initialize Redis
  getRedis();

  // Initialize Kafka producer
  const kafka = getKafkaClient();
  await kafka.connectProducer();

  console.info("[Services] All services initialized");
}

export async function shutdownServices(): Promise<void> {
  console.info("[Services] Shutting down...");

  if (kafkaClient) {
    await kafkaClient.disconnectAll();
    kafkaClient = null;
  }

  await closeRedis();

  console.info("[Services] All services shut down");
}

export { getRedis } from "./redis.js";
export * from "./s3.js";
