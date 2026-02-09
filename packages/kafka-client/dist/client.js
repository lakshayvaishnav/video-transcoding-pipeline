"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaClient = void 0;
exports.createKafkaClient = createKafkaClient;
const kafkajs_1 = require("kafkajs");
const LOG_LEVELS = {
    error: kafkajs_1.logLevel.ERROR,
    warn: kafkajs_1.logLevel.WARN,
    info: kafkajs_1.logLevel.INFO,
    debug: kafkajs_1.logLevel.DEBUG,
};
class KafkaClient {
    kafka;
    producer = null;
    consumers = new Map();
    isProducerConnected = false;
    constructor(config) {
        this.kafka = new kafkajs_1.Kafka({
            clientId: config.clientId,
            brokers: config.brokers,
            logLevel: LOG_LEVELS[config.logLevel ?? "warn"] ?? kafkajs_1.logLevel.WARN,
            retry: {
                initialRetryTime: 100,
                retries: 8,
            },
        });
    }
    // ========================
    // Producer Methods
    // ========================
    async connectProducer() {
        if (this.isProducerConnected)
            return;
        this.producer = this.kafka.producer({
            allowAutoTopicCreation: false,
            transactionTimeout: 30000,
        });
        await this.producer.connect();
        this.isProducerConnected = true;
        console.info("[Kafka] Producer connected");
    }
    async disconnectProducer() {
        if (this.producer && this.isProducerConnected) {
            await this.producer.disconnect();
            this.isProducerConnected = false;
            console.info("[Kafka] Producer disconnected");
        }
    }
    async publish(topic, event, key) {
        if (!this.producer || !this.isProducerConnected) {
            await this.connectProducer();
        }
        const message = {
            key: key ?? event.eventId,
            value: JSON.stringify(event),
            headers: {
                "event-type": event.eventType,
                "event-version": event.version,
                timestamp: event.timestamp,
            },
        };
        await this.producer.send({
            topic,
            compression: kafkajs_1.CompressionTypes.GZIP,
            messages: [message],
        });
        console.info(`[Kafka] Published ${event.eventType} to ${topic}`);
    }
    async publishBatch(topic, events, getKey) {
        if (!this.producer || !this.isProducerConnected) {
            await this.connectProducer();
        }
        const messages = events.map((event) => ({
            key: getKey ? getKey(event) : event.eventId,
            value: JSON.stringify(event),
            headers: {
                "event-type": event.eventType,
                "event-version": event.version,
                timestamp: event.timestamp,
            },
        }));
        await this.producer.send({
            topic,
            compression: kafkajs_1.CompressionTypes.GZIP,
            messages,
        });
        console.info(`[Kafka] Published batch of ${events.length} events to ${topic}`);
    }
    // ========================
    // Consumer Methods
    // ========================
    async createConsumer(groupId, topics, handler, options = {}) {
        const consumer = this.kafka.consumer({
            groupId,
            sessionTimeout: options.sessionTimeout ?? 30000,
            heartbeatInterval: options.heartbeatInterval ?? 3000,
            maxBytesPerPartition: options.maxBytesPerPartition ?? 1048576, // 1MB
        });
        await consumer.connect();
        console.info(`[Kafka] Consumer ${groupId} connected`);
        await consumer.subscribe({
            topics,
            fromBeginning: options.fromBeginning ?? false,
        });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value?.toString();
                if (!value)
                    return;
                try {
                    const event = JSON.parse(value);
                    const metadata = {
                        topic,
                        partition,
                        offset: message.offset,
                        timestamp: message.timestamp,
                        key: message.key?.toString(),
                    };
                    await handler(event, metadata);
                }
                catch (error) {
                    console.error(`[Kafka] Error processing message:`, error);
                    if (options.onError) {
                        options.onError(error, value);
                    }
                }
            },
        });
        this.consumers.set(groupId, consumer);
    }
    async disconnectConsumer(groupId) {
        const consumer = this.consumers.get(groupId);
        if (consumer) {
            await consumer.disconnect();
            this.consumers.delete(groupId);
            console.info(`[Kafka] Consumer ${groupId} disconnected`);
        }
    }
    async disconnectAll() {
        await this.disconnectProducer();
        for (const [groupId] of this.consumers) {
            await this.disconnectConsumer(groupId);
        }
    }
}
exports.KafkaClient = KafkaClient;
// Factory function
function createKafkaClient(config) {
    return new KafkaClient(config);
}
//# sourceMappingURL=client.js.map