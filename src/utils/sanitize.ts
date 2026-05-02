/**
 * sanitize.ts — Input sanitization utilities.
 * Strips dangerous characters before sending user input to any API.
 */
import { VALIDATION_CONFIG } from 'constants/index';

/**
 * Sanitize generic user input: strip HTML, trim, limit length.
 * @param input - Raw user string.
 * @param maxLen - Maximum allowed length.
 * @returns Sanitized string.
 */
export function sanitizeInput(input: unknown, maxLen: number = VALIDATION_CONFIG.MAX_CHAT_LENGTH): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')       // strip HTML tags
    .replace(/[<>"'`;]/g, '')      // strip risky characters
    .trim()
    .slice(0, maxLen);
}

/**
 * Sanitize an address string for the Maps/Civic API.
 * @param address - Raw address.
 * @returns Sanitized address.
 */
export function sanitizeAddress(address: unknown): string {
  if (typeof address !== 'string') return '';
  return address
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'`;{}()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, VALIDATION_CONFIG.MAX_ADDRESS_LENGTH);
}

/**
 * Validate that a string is non-empty after sanitization.
 * @param str - The string to check.
 * @returns True if non-empty.
 */
export function isNonEmpty(str: unknown): boolean {
  return typeof str === 'string' && str.trim().length > 0;
}
