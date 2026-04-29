/**
 * useTranslate.js — Hook for Google Cloud Translation API with demo fallback.
 * Debounces language changes by 500ms.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { getCache, setCache } from '../utils/cache';
import { getMockTranslation } from '../utils/mockData';
import { API_ENDPOINTS, TRANSLATE_CONFIG } from '../constants';

const API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY;

/**
 * Custom hook for translation services using Google Cloud Translation API.
 * @returns {{
 *   translate: (text: string, targetLang?: string) => Promise<string>,
 *   translateBatch: (texts: string[], targetLang?: string) => Promise<string[]>,
 *   loading: boolean,
 *   error: string | null,
 *   currentLanguage: string,
 *   setLanguage: (lang: string) => void,
 *   t: (text: string) => string,
 *   isDemo: boolean
 * }}
 */
export default function useTranslate() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const cacheMapRef = useRef(new Map());

  const isDemo = !API_KEY || API_KEY === 'your_cloud_translate_api_key_here';

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /**
   * Translates a single string of text.
   * @param {string} text - The text to translate.
   * @param {string} targetLang - The target language code.
   * @returns {Promise<string>} The translated text.
   */
  const translate = useCallback(async (text, targetLang = currentLanguage) => {
    if (!text || targetLang === 'en') return text;

    const cacheKey = `tr_${targetLang}_${text.slice(0, 80)}`;

    // Check in-memory cache
    if (cacheMapRef.current.has(cacheKey)) {
      return cacheMapRef.current.get(cacheKey);
    }

    // Check sessionStorage cache
    const cached = getCache(cacheKey);
    if (cached) {
      cacheMapRef.current.set(cacheKey, cached);
      return cached;
    }

    try {
      if (isDemo) {
        const mockResult = getMockTranslation(text, targetLang);
        cacheMapRef.current.set(cacheKey, mockResult);
        setCache(cacheKey, mockResult);
        return mockResult;
      }

      const response = await fetch(`${API_ENDPOINTS.CLOUD_TRANSLATE}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: 'en',
          format: 'text',
        }),
      });

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();
      const translated = data.data.translations[0].translatedText;
      cacheMapRef.current.set(cacheKey, translated);
      setCache(cacheKey, translated);
      return translated;
    } catch (err) {
      console.error('Translation Error:', err);
      setError('Translation unavailable. Using fallback.');
      // Fallback to mock translation
      const mockResult = getMockTranslation(text, targetLang);
      cacheMapRef.current.set(cacheKey, mockResult);
      return mockResult;
    }
  }, [currentLanguage, isDemo]);

  /**
   * Translates an array of strings.
   * @param {string[]} texts - The array of strings to translate.
   * @param {string} targetLang - The target language code.
   * @returns {Promise<string[]>} The array of translated strings.
   */
  const translateBatch = useCallback(async (texts, targetLang = currentLanguage) => {
    if (!texts || !texts.length || targetLang === 'en') return texts;

    const results = await Promise.all(
      texts.map((text) => translate(text, targetLang))
    );
    return results;
  }, [translate, currentLanguage]);

  /**
   * Sets the current language with a debounce.
   * @param {string} lang - The new language code.
   */
  const setLanguage = useCallback((lang) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      setCurrentLanguage(lang);
      setLoading(false);
    }, TRANSLATE_CONFIG.DEBOUNCE_TIMER);
  }, []);

  /**
   * Synchronous translation for UI strings using mock dictionary.
   * @param {string} text - The text to look up.
   * @returns {string} The mock translation.
   */
  const t = useCallback((text) => {
    return getMockTranslation(text, currentLanguage);
  }, [currentLanguage]);

  return {
    translate,
    translateBatch,
    loading,
    error,
    currentLanguage,
    setLanguage,
    t,
    isDemo,
  };
}
