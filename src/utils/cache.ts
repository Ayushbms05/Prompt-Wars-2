/**
 * cache.ts — SessionStorage caching with TTL + in-memory blob cache for TTS.
 */
import { CACHE_CONFIG } from 'constants/index';
import type { CacheEntry } from 'types/index';

/**
 * Retrieve a cached value from sessionStorage.
 * Returns null if missing or expired.
 * @param key - The cache key.
 * @returns The cached value or null.
 */
export function getCache<T = unknown>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

/**
 * Store a value in sessionStorage with TTL.
 * @param key - The cache key.
 * @param value - The value to store (must be JSON-serializable).
 * @param ttl - Time-to-live in milliseconds.
 */
export function setCache<T = unknown>(key: string, value: T, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
  try {
    const entry: CacheEntry<T> = { value, expiry: Date.now() + ttl };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // sessionStorage full or unavailable — silently skip
  }
}

/**
 * In-memory blob URL cache for TTS audio.
 * Avoids re-fetching identical speech audio.
 */
const blobCache = new Map<string, string>();

/**
 * Get a cached blob URL for the given key.
 * @param key - The cache key.
 * @returns The blob URL or null.
 */
export function getBlobCache(key: string): string | null {
  return blobCache.get(key) ?? null;
}

/**
 * Store a blob URL in the in-memory cache.
 * @param key - The cache key.
 * @param blobUrl - The blob URL to store.
 */
export function setBlobCache(key: string, blobUrl: string): void {
  blobCache.set(key, blobUrl);
}

/**
 * Clear all blob URLs from the in-memory cache and revoke them.
 */
export function clearBlobCache(): void {
  blobCache.forEach((url) => {
    try { URL.revokeObjectURL(url); } catch { /* noop */ }
  });
  blobCache.clear();
}
