/**
 * rateLimit.js — Simple session-based rate limiter.
 */

/**
 * Create a rate limiter.
 * @param {number} max — maximum allowed messages
 * @param {number} warningAt — show warning at this count
 * @returns {{ canSend: () => boolean, increment: () => void, getCount: () => number, isWarning: () => boolean, isLimited: () => boolean, reset: () => void }}
 */
export function createRateLimiter(max = 10, warningAt = 8) {
  let count = 0;

  return {
    canSend() {
      return count < max;
    },
    increment() {
      count += 1;
    },
    getCount() {
      return count;
    },
    isWarning() {
      return count >= warningAt && count < max;
    },
    isLimited() {
      return count >= max;
    },
    reset() {
      count = 0;
    },
  };
}
