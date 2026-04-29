/**
 * cache.js — SessionStorage caching with TTL + in-memory blob cache for TTS.
 */
import { CACHE_CONFIG } from '../constants';

/**
 * Retrieve a cached value from sessionStorage.
 * Returns null if missing or expired.
 * @param {string} key - The cache key.
 * @returns {any|null} The cached value or null.
 */
export function getCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
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
 * @param {string} key - The cache key.
 * @param {any} value - The value to store (must be JSON-serializable).
 * @param {number} [ttl=CACHE_CONFIG.DEFAULT_TTL] - Time-to-live in milliseconds.
 */
export function setCache(key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
  try {
    const entry = { value, expiry: Date.now() + ttl };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // sessionStorage full or unavailable — silently skip
  }
}

/**
 * In-memory blob URL cache for TTS audio.
 * Avoids re-fetching identical speech audio.
 */
const blobCache = new Map();

/**
 * Get a cached blob URL for the given key.
 * @param {string} key - The cache key.
 * @returns {string|null} The blob URL or null.
 */
export function getBlobCache(key) {
  return blobCache.get(key) || null;
}

/**
 * Store a blob URL in the in-memory cache.
 * @param {string} key - The cache key.
 * @param {string} blobUrl - The blob URL to store.
 */
export function setBlobCache(key, blobUrl) {
  blobCache.set(key, blobUrl);
}

/**
 * Clear all blob URLs from the in-memory cache and revoke them.
 */
export function clearBlobCache() {
  blobCache.forEach((url) => {
    try { URL.revokeObjectURL(url); } catch { /* noop */ }
  });
  blobCache.clear();
}
