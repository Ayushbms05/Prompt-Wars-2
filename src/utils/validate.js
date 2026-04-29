/**
 * src/utils/validate.js
 * Utility functions for input validation and sanitization.
 */
import { VALIDATION_CONFIG, LANGUAGES } from '../constants';

/**
 * Validates address input.
 * @param {string} address - The address string to validate.
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Address is required.' };
  }

  const trimmed = address.trim();
  
  if (trimmed.length < VALIDATION_CONFIG.MIN_ADDRESS_LENGTH) {
    return { 
      isValid: false, 
      error: `Address must be at least ${VALIDATION_CONFIG.MIN_ADDRESS_LENGTH} characters long.` 
    };
  }

  // Basic check for script tags or common injection attempts
  if (/<script|javascript:|data:/i.test(trimmed)) {
    return { isValid: false, error: 'Invalid characters in address.' };
  }

  return { isValid: true, error: null };
}

/**
 * Validates chat input.
 * @param {string} text - The chat message to validate.
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateChatInput(text) {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Message cannot be empty.' };
  }

  const trimmed = text.trim();

  if (trimmed.length > VALIDATION_CONFIG.MAX_CHAT_LENGTH) {
    return { 
      isValid: false, 
      error: `Message exceeds maximum length of ${VALIDATION_CONFIG.MAX_CHAT_LENGTH} characters.` 
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates language selection.
 * @param {string} langCode - The language code to validate.
 * @returns {boolean}
 */
export function validateLanguage(langCode) {
  return LANGUAGES.some(lang => lang.code === langCode);
}
