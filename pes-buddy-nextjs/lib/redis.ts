import { Redis } from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    reconnectOnError(err) {
      const targetErrors = ["READONLY", "ECONNRESET", "ECONNREFUSED"];
      return targetErrors.some((e) => err.message.includes(e));
    },
  });

  redis.on("error", (err) => {
    if (process.env.NODE_ENV !== "test") {
      console.error("[Redis] connection error:", err.message);
    }
  });

  return redis;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// Cache helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  },

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async flush(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  },
};
