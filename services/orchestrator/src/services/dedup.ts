import { Redis } from "ioredis";
import { config } from "../config.js";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(config.redis.url);
  }
  return redis;
}

/**
 * Check if an event has been processed and mark it as processed if not
 * Returns true if this is the first time processing (new event)
 * Returns false if already processed (duplicate)
 */
export async function checkAndSetProcessed(
  key: string,
  ttl: number = 86400, // 24 hours
): Promise<boolean> {
  const result = await getRedis().set(key, "1", "EX", ttl, "NX");
  return result === "OK";
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
