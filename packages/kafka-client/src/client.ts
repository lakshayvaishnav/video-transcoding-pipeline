import { Kafka, Producer, Consumer, logLevel, CompressionTypes } from "kafkajs";
import type { KafkaEvent, KafkaTopic } from "@video-transcoder/shared-types";

export interface KafkaClientConfig {
  brokers: string[];
  clientId: string;
  logLevel?: "error" | "warn" | "info" | "debug";
}

const LOG_LEVELS: Record<string, logLevel> = {
  error: logLevel.ERROR,
  warn: logLevel.WARN,
  info: logLevel.INFO,
  debug: logLevel.DEBUG,
};

export class KafkaClient {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumers: Map<string, Consumer> = new Map();
  private isProducerConnected = false;

  constructor(config: KafkaClientConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      logLevel: LOG_LEVELS[config.logLevel ?? "warn"] ?? logLevel.WARN,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
  }

  // ========================
  // Producer Methods
  // ========================

  async connectProducer(): Promise<void> {
    if (this.isProducerConnected) return;

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
    });

    await this.producer.connect();
    this.isProducerConnected = true;
    console.info("[Kafka] Producer connected");
  }

  async disconnectProducer(): Promise<void> {
    if (this.producer && this.isProducerConnected) {
      await this.producer.disconnect();
      this.isProducerConnected = false;
      console.info("[Kafka] Producer disconnected");
    }
  }

  async publish<T extends KafkaEvent>(topic: KafkaTopic, event: T, key?: string): Promise<void> {
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

    await this.producer!.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [message],
    });

    console.info(`[Kafka] Published ${event.eventType} to ${topic}`);
  }

  async publishBatch<T extends KafkaEvent>(topic: KafkaTopic, events: T[], getKey?: (event: T) => string): Promise<void> {
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

    await this.producer!.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages,
    });

    console.info(`[Kafka] Published batch of ${events.length} events to ${topic}`);
  }

  // ========================
  // Consumer Methods
  // ========================

  async createConsumer(
    groupId: string,
    topics: KafkaTopic[],
    handler: (event: KafkaEvent, metadata: MessageMetadata) => Promise<void>,
    options: ConsumerOptions = {},
  ): Promise<void> {
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
        if (!value) return;

        try {
          const event = JSON.parse(value) as KafkaEvent;
          const metadata: MessageMetadata = {
            topic,
            partition,
            offset: message.offset,
            timestamp: message.timestamp,
            key: message.key?.toString(),
          };

          await handler(event, metadata);
        } catch (error) {
          console.error(`[Kafka] Error processing message:`, error);
          if (options.onError) {
            options.onError(error as Error, value);
          }
        }
      },
    });

    this.consumers.set(groupId, consumer);
  }

  async disconnectConsumer(groupId: string): Promise<void> {
    const consumer = this.consumers.get(groupId);
    if (consumer) {
      await consumer.disconnect();
      this.consumers.delete(groupId);
      console.info(`[Kafka] Consumer ${groupId} disconnected`);
    }
  }

  async disconnectAll(): Promise<void> {
    await this.disconnectProducer();
    for (const [groupId] of this.consumers) {
      await this.disconnectConsumer(groupId);
    }
  }
}

export interface MessageMetadata {
  topic: string;
  partition: number;
  offset: string;
  timestamp: string;
  key?: string;
}

export interface ConsumerOptions {
  fromBeginning?: boolean;
  sessionTimeout?: number;
  heartbeatInterval?: number;
  maxBytesPerPartition?: number;
  onError?: (error: Error, rawMessage: string) => void;
}

// Factory function
export function createKafkaClient(config: KafkaClientConfig): KafkaClient {
  return new KafkaClient(config);
}
