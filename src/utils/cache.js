/**
 * cache.js — SessionStorage caching with TTL + in-memory blob cache for TTS.
 */

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Retrieve a cached value from sessionStorage.
 * Returns null if missing or expired.
 * @param {string} key
 * @returns {*|null}
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
 * @param {string} key
 * @param {*} value — must be JSON-serializable
 * @param {number} [ttl] — time-to-live in ms
 */
export function setCache(key, value, ttl = DEFAULT_TTL_MS) {
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
 * @param {string} key
 * @returns {string|null}
 */
export function getBlobCache(key) {
  return blobCache.get(key) || null;
}

/**
 * Store a blob URL.
 * @param {string} key
 * @param {string} blobUrl
 */
export function setBlobCache(key, blobUrl) {
  blobCache.set(key, blobUrl);
}

/**
 * Clear all blob URLs (revoke + delete).
 */
export function clearBlobCache() {
  blobCache.forEach((url) => {
    try { URL.revokeObjectURL(url); } catch { /* noop */ }
  });
  blobCache.clear();
}
