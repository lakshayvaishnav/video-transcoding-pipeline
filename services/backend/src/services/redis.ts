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

// cache operation

const DEFAULT_TTL = 300; // 5 minutes

// ========================
// Deduplication
// ========================

export async function checkAndSetIdempotencyKey(key: string, ttl: number = 86400): Promise<boolean> {
  const result = await getRedis().set(key, "1", "EX", ttl, "NX");
  return result === "OK";
}

// ========================
// Rate Limiting
// ========================

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const r = getRedis();
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `ratelimit:${key}:${Math.floor(now / windowSeconds)}`;

  const count = await r.incr(windowKey);
  if (count === 1) {
    await r.expire(windowKey, windowSeconds);
  }

  const resetAt = (Math.floor(now / windowSeconds) + 1) * windowSeconds;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  };
}
