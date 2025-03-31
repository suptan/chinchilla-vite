import { MemoryCache } from "memory-cache-node";

const itemsExpirationCheckIntervalInSecs = 24 * 60 * 60;
const maxItemCount = 1000000;
const memoryCache = new MemoryCache(itemsExpirationCheckIntervalInSecs, maxItemCount);

export {
  memoryCache
}
