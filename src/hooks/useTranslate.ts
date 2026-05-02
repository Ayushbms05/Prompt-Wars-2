/**
 * useTranslate.ts — Hook for Google Cloud Translation API with demo fallback.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { getCache, setCache } from 'utils/cache';
import { getMockTranslation } from 'utils/mockData';
import { API_ENDPOINTS, TRANSLATE_CONFIG } from 'constants/index';
import logger from 'utils/logger';
import type { UseTranslateReturn } from 'types/index';

const API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY;

/**
 * Custom hook for translation services using Google Cloud Translation API.
 */
export default function useTranslate(): UseTranslateReturn {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheMapRef = useRef(new Map<string, string>());

  const isDemo = !API_KEY || API_KEY === 'your_cloud_translate_api_key_here';

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const translate = useCallback(async (text: string, targetLang: string = currentLanguage): Promise<string> => {
    if (!text || targetLang === 'en') return text;

    const cacheKey = `tr_${targetLang}_${text.slice(0, 80)}`;

    if (cacheMapRef.current.has(cacheKey)) {
      return cacheMapRef.current.get(cacheKey)!;
    }

    const cached = getCache<string>(cacheKey);
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
        body: JSON.stringify({ q: text, target: targetLang, source: 'en', format: 'text' }),
      });

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();
      const translated: string = data.data.translations[0].translatedText;
      cacheMapRef.current.set(cacheKey, translated);
      setCache(cacheKey, translated);
      return translated;
    } catch (err: unknown) {
      logger.error('Translation Error:', err);
      setError('Translation unavailable. Using fallback.');
      const mockResult = getMockTranslation(text, targetLang);
      cacheMapRef.current.set(cacheKey, mockResult);
      return mockResult;
    }
  }, [currentLanguage, isDemo]);

  const translateBatch = useCallback(async (texts: string[], targetLang: string = currentLanguage): Promise<string[]> => {
    if (!texts || !texts.length || targetLang === 'en') return texts;
    const results = await Promise.all(texts.map((text) => translate(text, targetLang)));
    return results;
  }, [translate, currentLanguage]);

  const setLanguage = useCallback((lang: string): void => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      setCurrentLanguage(lang);
      setLoading(false);
    }, TRANSLATE_CONFIG.DEBOUNCE_TIMER);
  }, []);

  const t = useCallback((text: string): string => {
    return getMockTranslation(text, currentLanguage);
  }, [currentLanguage]);

  return { translate, translateBatch, loading, error, currentLanguage, setLanguage, t, isDemo };
}
