import { Redis } from "ioredis";
import { config } from "../config.js";
let redis = null;
export function getRedis() {
    if (!redis) {
        redis = new Redis(config.redis.url, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                if (times > 3)
                    return null;
                return Math.min(times * 200, 3000);
            },
        });
        redis.on("error", (err) => {
            console.error(`[REDIS] connection error : `, err);
        });
        redis.on("connect", () => {
            console.info(`[REDIS] connected`);
        });
    }
    return redis;
}
export async function closeRedis() {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}
// cache operation
const DEFAULT_TTL = 300; // 5 minutes
export async function cacheGet(key) {
    const value = await getRedis().get(key);
    if (!value)
        return null;
    return JSON.parse(value);
}
export async function cacheSet(key, value, ttl = DEFAULT_TTL) {
    await getRedis().setex(key, ttl, JSON.stringify(value));
}
export async function cacheDelete(key) {
    await getRedis().del(key);
}
export async function cacheInvalidatePattern(pattern) {
    const keys = await getRedis().keys(pattern);
    if (keys.length > 0) {
        await getRedis().del(...keys);
    }
}
// ========================
// Deduplication
// ========================
export async function checkAndSetIdempotencyKey(key, ttl = 86400) {
    const result = await getRedis().set(key, "1", "EX", ttl, "NX");
    return result === "OK";
}
// ========================
// Rate Limiting
// ========================
export async function checkRateLimit(key, limit, windowSeconds) {
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
//# sourceMappingURL=redis.js.map