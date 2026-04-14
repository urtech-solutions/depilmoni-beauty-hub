const memoryCache = new Map<string, unknown>();

export const mockRedisAdapter = {
  get<T>(key: string) {
    return memoryCache.get(key) as T | undefined;
  },
  set(key: string, value: unknown) {
    memoryCache.set(key, value);
  },
  del(key: string) {
    memoryCache.delete(key);
  }
};
