/**
 * rateLimit.js — Simple session-based rate limiter.
 */

/**
 * Creates a rate limiter instance.
 * @param {number} max - Maximum allowed messages.
 * @param {number} warningAt - Threshold to start showing a warning.
 * @returns {Object} The rate limiter object.
 */
export function createRateLimiter(max = 10, warningAt = 8) {
  let count = 0;

  return {
    /**
     * Checks if a message can be sent.
     * @returns {boolean} True if within limit.
     */
    canSend() {
      return count < max;
    },
    /**
     * Increments the message count.
     */
    increment() {
      count += 1;
    },
    /**
     * Returns the current message count.
     * @returns {number} The count.
     */
    getCount() {
      return count;
    },
    /**
     * Checks if the warning threshold has been reached.
     * @returns {boolean} True if in warning state.
     */
    isWarning() {
      return count >= warningAt && count < max;
    },
    /**
     * Checks if the limit has been reached.
     * @returns {boolean} True if limit reached.
     */
    isLimited() {
      return count >= max;
    },
    /**
     * Resets the message count.
     */
    reset() {
      count = 0;
    },
  };
}
