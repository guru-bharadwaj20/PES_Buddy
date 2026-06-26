// Redis is fully optional. When REDIS_URL is not set (or Redis is unavailable),
// all cache operations are no-ops and callers fall back to direct Prisma queries.

import { Redis } from "ioredis";

interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  flush(pattern: string): Promise<void>;
}

function noopCache(): CacheStore {
  return {
    async get() { return null; },
    async set() { /* no-op */ },
    async del() { /* no-op */ },
    async flush() { /* no-op */ },
  };
}

function createRedisCache(): CacheStore {
  const client = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableReadyCheck: false,
  });

  let warned = false;
  client.on("error", () => {
    if (!warned) {
      console.warn("[Cache] Redis unavailable — falling back to direct DB queries.");
      warned = true;
    }
  });

  async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
    try {
      return await fn();
    } catch {
      return null;
    }
  }

  return {
    async get<T>(key: string): Promise<T | null> {
      return safe(async () => {
        const raw = await client.get(key);
        return raw ? (JSON.parse(raw) as T) : null;
      });
    },
    async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
      await safe(() => client.set(key, JSON.stringify(value), "EX", ttlSeconds));
    },
    async del(key: string): Promise<void> {
      await safe(() => client.del(key) as Promise<unknown>);
    },
    async flush(pattern: string): Promise<void> {
      await safe(async () => {
        const keys = await client.keys(pattern);
        if (keys.length > 0) await client.del(...keys);
      });
    },
  };
}

export const cache: CacheStore =
  process.env.REDIS_URL ? createRedisCache() : noopCache();
