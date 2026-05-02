/**
 * validate.ts — Utility functions for input validation and sanitization.
 */
import { VALIDATION_CONFIG, LANGUAGES } from 'constants/index';
import type { ValidationResult } from 'types/index';

/**
 * Validates address input.
 * @param address - The address string to validate.
 * @returns Validation result.
 */
export function validateAddress(address: string): ValidationResult {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Address is required.' };
  }
  const trimmed = address.trim();
  if (trimmed.length < VALIDATION_CONFIG.MIN_ADDRESS_LENGTH) {
    return { isValid: false, error: `Address must be at least ${VALIDATION_CONFIG.MIN_ADDRESS_LENGTH} characters long.` };
  }
  if (/<script|javascript:|data:/i.test(trimmed)) {
    return { isValid: false, error: 'Invalid characters in address.' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates chat input.
 * @param text - The chat message to validate.
 * @returns Validation result.
 */
export function validateChatInput(text: string): ValidationResult {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Message cannot be empty.' };
  }
  const trimmed = text.trim();
  if (trimmed.length > VALIDATION_CONFIG.MAX_CHAT_LENGTH) {
    return { isValid: false, error: `Message exceeds maximum length of ${VALIDATION_CONFIG.MAX_CHAT_LENGTH} characters.` };
  }
  return { isValid: true, error: null };
}

/**
 * Validates language selection.
 * @param langCode - The language code to validate.
 * @returns True if valid.
 */
export function validateLanguage(langCode: string): boolean {
  return LANGUAGES.some(lang => lang.code === langCode);
}
