import type { KafkaEvent, KafkaTopic } from "@video-transcoder/shared-types";
export interface KafkaClientConfig {
    brokers: string[];
    clientId: string;
    logLevel?: "error" | "warn" | "info" | "debug";
}
export declare class KafkaClient {
    private kafka;
    private producer;
    private consumers;
    private isProducerConnected;
    constructor(config: KafkaClientConfig);
    connectProducer(): Promise<void>;
    disconnectProducer(): Promise<void>;
    publish<T extends KafkaEvent>(topic: KafkaTopic, event: T, key?: string): Promise<void>;
    publishBatch<T extends KafkaEvent>(topic: KafkaTopic, events: T[], getKey?: (event: T) => string): Promise<void>;
    createConsumer(groupId: string, topics: KafkaTopic[], handler: (event: KafkaEvent, metadata: MessageMetadata) => Promise<void>, options?: ConsumerOptions): Promise<void>;
    disconnectConsumer(groupId: string): Promise<void>;
    disconnectAll(): Promise<void>;
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
export declare function createKafkaClient(config: KafkaClientConfig): KafkaClient;
//# sourceMappingURL=client.d.ts.map