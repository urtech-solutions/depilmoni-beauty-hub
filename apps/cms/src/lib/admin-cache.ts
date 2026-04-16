import { createClient } from "redis";

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();
const now = () => Date.now();

const redisUrl = process.env.REDIS_URL;

type AdminRedisClient = ReturnType<typeof createClient>;

let redisClient: AdminRedisClient | null = null;
let redisConnectPromise: Promise<AdminRedisClient | null> | null = null;
let redisUnavailableLogged = false;

const getMemoryValue = <T>(key: string) => {
  const entry = memoryCache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= now()) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value as T;
};

const setMemoryValue = <T>(key: string, value: T, ttlSeconds: number) => {
  memoryCache.set(key, {
    value,
    expiresAt: now() + ttlSeconds * 1000
  });
};

const deleteMemoryValue = (key: string) => {
  memoryCache.delete(key);
};

const logRedisFallback = (error: unknown) => {
  if (redisUnavailableLogged) {
    return;
  }

  redisUnavailableLogged = true;
  const message = error instanceof Error ? error.message : "Falha desconhecida";
  console.warn(`[admin-cache] Redis indisponível, usando memória local. Motivo: ${message}`);
};

const resetRedisClient = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch {
      await redisClient.disconnect();
    }
  }

  redisClient = null;
  redisConnectPromise = null;
};

const getRedisClient = async () => {
  if (!redisUrl) {
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (redisConnectPromise) {
    return redisConnectPromise;
  }

  const client = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: false,
      connectTimeout: 1500
    }
  });

  client.on("error", (error) => {
    logRedisFallback(error);
  });

  redisConnectPromise = client
    .connect()
    .then(() => {
      redisClient = client;
      return client;
    })
    .catch(async (error) => {
      logRedisFallback(error);
      await resetRedisClient();
      return null;
    });

  return redisConnectPromise;
};

export const adminCache = {
  async get<T>(key: string): Promise<T | null> {
    const client = await getRedisClient();

    if (client) {
      try {
        const raw = await client.get(key);
        if (raw === null) {
          return null;
        }

        return JSON.parse(String(raw)) as T;
      } catch (error) {
        logRedisFallback(error);
      }
    }

    return getMemoryValue<T>(key);
  },

  async set<T>(key: string, value: T, ttlSeconds: number) {
    setMemoryValue(key, value, ttlSeconds);

    const client = await getRedisClient();
    if (!client) {
      return;
    }

    try {
      await client.set(key, JSON.stringify(value), {
        EX: ttlSeconds
      });
    } catch (error) {
      logRedisFallback(error);
    }
  },

  async delete(key: string) {
    deleteMemoryValue(key);

    const client = await getRedisClient();
    if (!client) {
      return;
    }

    try {
      await client.del(key);
    } catch (error) {
      logRedisFallback(error);
    }
  }
};
