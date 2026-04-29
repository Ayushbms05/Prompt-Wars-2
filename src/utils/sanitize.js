/**
 * sanitize.js — Input sanitization utilities.
 * Strips dangerous characters before sending user input to any API.
 */
import { VALIDATION_CONFIG } from '../constants';

/**
 * Sanitize generic user input: strip HTML, trim, limit length.
 * @param {string} input - Raw user string.
 * @param {number} [maxLen=VALIDATION_CONFIG.MAX_CHAT_LENGTH] - Maximum allowed length.
 * @returns {string} Sanitized string.
 */
export function sanitizeInput(input, maxLen = VALIDATION_CONFIG.MAX_CHAT_LENGTH) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')       // strip HTML tags
    .replace(/[<>"'`;]/g, '')      // strip risky characters
    .trim()
    .slice(0, maxLen);
}

/**
 * Sanitize an address string for the Maps/Civic API.
 * @param {string} address - Raw address.
 * @returns {string} Sanitized address.
 */
export function sanitizeAddress(address) {
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
 * @param {string} str - The string to check.
 * @returns {boolean} True if non-empty.
 */
export function isNonEmpty(str) {
  return typeof str === 'string' && str.trim().length > 0;
}
