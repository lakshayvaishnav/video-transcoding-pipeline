import pino from "pino";
import { config } from "./config.js";
import { createKafkaClient } from "@video-transcoder/kafka-client";
import { startUploadConsumer } from "./consumers/upload.consumer.js";
import { startResultsConsumer } from "./consumers/results.consumer.js";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pinoLogger = pino.default ?? pino;
const logger = pinoLogger({
    level: config.logLevel,
    transport: config.nodeEnv === "development" ? { target: "pino-pretty", options: { colorize: true } } : undefined,
});
let kafkaClient = null;
async function main() {
    logger.info("Starting Orchestrator Service...");
    // Initialize kafka client
    kafkaClient = createKafkaClient({
        brokers: config.kafka.brokers,
        clientId: "orchestrator-service",
        logLevel: config.nodeEnv === "development" ? "debug" : "warn",
    });
    await kafkaClient.connectProducer();
    logger.info("Kafka producer connected");
    await startUploadConsumer(kafkaClient, logger);
    await startResultsConsumer(kafkaClient, logger);
    logger.info("Orchestrator Service started successfully");
}
// Graceful shutdown
const signals = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
    process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        if (kafkaClient) {
            await kafkaClient.disconnectAll();
        }
        process.exit(0);
    });
});
main().catch((err) => {
    logger.error(err, "Failed to start Orchestrator Service");
    process.exit(1);
});
//# sourceMappingURL=index.js.map