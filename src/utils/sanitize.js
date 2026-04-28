/**
 * sanitize.js — Input sanitization utilities.
 * Strips dangerous characters before sending user input to any API.
 */

const MAX_INPUT_LENGTH = 500;
const MAX_ADDRESS_LENGTH = 200;

/**
 * Sanitize generic user input: strip HTML, trim, limit length.
 * @param {string} input — raw user string
 * @param {number} [maxLen=500] — maximum allowed length
 * @returns {string} sanitized string
 */
export function sanitizeInput(input, maxLen = MAX_INPUT_LENGTH) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')       // strip HTML tags
    .replace(/[<>"'`;]/g, '')      // strip risky characters
    .trim()
    .slice(0, maxLen);
}

/**
 * Sanitize an address string for the Civic API.
 * @param {string} address — raw address
 * @returns {string} sanitized address
 */
export function sanitizeAddress(address) {
  if (typeof address !== 'string') return '';
  return address
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'`;{}()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_ADDRESS_LENGTH);
}

/**
 * Validate that a string is non-empty after sanitization.
 * @param {string} str
 * @returns {boolean}
 */
export function isNonEmpty(str) {
  return typeof str === 'string' && str.trim().length > 0;
}
