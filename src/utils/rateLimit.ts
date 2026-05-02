/**
 * rateLimit.ts — Simple session-based rate limiter.
 */
import type { RateLimiter } from 'types/index';

/**
 * Creates a rate limiter instance.
 * @param max - Maximum allowed messages.
 * @param warningAt - Threshold to start showing a warning.
 * @returns The rate limiter object.
 */
export function createRateLimiter(max: number = 10, warningAt: number = 8): RateLimiter {
  let count = 0;

  return {
    canSend(): boolean { return count < max; },
    increment(): void { count += 1; },
    getCount(): number { return count; },
    isWarning(): boolean { return count >= warningAt && count < max; },
    isLimited(): boolean { return count >= max; },
    reset(): void { count = 0; },
  };
}
