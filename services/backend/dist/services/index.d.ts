import { type KafkaClient } from "@video-transcoder/kafka-client";
export declare function getKafkaClient(): KafkaClient;
export declare function initServices(): Promise<void>;
export declare function shutdownServices(): Promise<void>;
export { getRedis } from "./redis.js";
export * from "./s3.js";
//# sourceMappingURL=index.d.ts.map