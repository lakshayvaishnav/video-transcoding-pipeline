import { Redis } from "ioredis";
export declare function getRedis(): Redis;
export declare function closeRedis(): Promise<void>;
export declare function cacheGet<T>(key: string): Promise<T | null>;
export declare function cacheSet<T>(key: string, value: T, ttl?: number): Promise<void>;
export declare function cacheDelete(key: string): Promise<void>;
export declare function cacheInvalidatePattern(pattern: string): Promise<void>;
export declare function checkAndSetIdempotencyKey(key: string, ttl?: number): Promise<boolean>;
export declare function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: number;
}>;
//# sourceMappingURL=redis.d.ts.map