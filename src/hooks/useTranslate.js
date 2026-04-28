/**
 * useTranslate.js — Hook for Google Cloud Translation API with demo fallback.
 * Debounces language changes by 500ms.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { getCache, setCache } from '../utils/cache';
import { getMockTranslation } from '../utils/mockData';

const API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY;
const TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

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

      const response = await fetch(`${TRANSLATE_URL}?key=${API_KEY}`, {
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
    } catch {
      // Fallback to mock translation
      const mockResult = getMockTranslation(text, targetLang);
      cacheMapRef.current.set(cacheKey, mockResult);
      return mockResult;
    }
  }, [currentLanguage, isDemo]);

  const translateBatch = useCallback(async (texts, targetLang = currentLanguage) => {
    if (!texts || !texts.length || targetLang === 'en') return texts;

    const results = await Promise.all(
      texts.map((text) => translate(text, targetLang))
    );
    return results;
  }, [translate, currentLanguage]);

  const setLanguage = useCallback((lang) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      setCurrentLanguage(lang);
      setLoading(false);
    }, 500);
  }, []);

  // Synchronous translation for UI strings using mock dictionary
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
