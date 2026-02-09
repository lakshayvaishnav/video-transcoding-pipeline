import { Redis } from "ioredis";
import { Config } from "../config.js";
import { config } from "../config.js";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) return null;
        return Math.min(times * 200, 3000);
      },
    });

    redis.on("error", (err: Error) => {
      console.error(`[REDIS] connection error : `, err);
    });

    redis.on("connect", () => {
      console.info(`[REDIS] connected`);
    });
  }
  return redis;
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
