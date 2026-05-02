/**
 * useTTS.ts — Hook for Google Cloud Text-to-Speech API with demo fallback.
 */
import { useState, useCallback, useRef } from 'react';
import { getBlobCache, setBlobCache } from 'utils/cache';
import { API_ENDPOINTS, TTS_CONFIG } from 'constants/index';
import logger from 'utils/logger';
import type { UseTTSReturn } from 'types/index';

const API_KEY = import.meta.env.VITE_TTS_API_KEY;

/**
 * Custom hook for Text-to-Speech functionality.
 */
export default function useTTS(): UseTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isDemo = !API_KEY || API_KEY === 'your_cloud_tts_api_key_here';

  const stop = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string, lang: string = 'en'): Promise<void> => {
    if (!text) return;

    stop();
    setError(null);
    setIsSpeaking(true);

    const cacheKey = `tts_${lang}_${text.slice(0, 100)}`;

    try {
      if (isDemo) {
        if (!window.speechSynthesis) {
          throw new Error('Speech synthesis not available in this browser.');
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = TTS_CONFIG.VOICE_MAP[lang]?.languageCode ?? 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
          setIsSpeaking(false);
          setError('Speech synthesis failed.');
        };
        window.speechSynthesis.speak(utterance);
        return;
      }

      const cachedUrl = getBlobCache(cacheKey);
      if (cachedUrl) {
        const audio = new Audio(cachedUrl);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
        return;
      }

      const voice = TTS_CONFIG.VOICE_MAP[lang] ?? TTS_CONFIG.VOICE_MAP.en;
      const response = await fetch(`${API_ENDPOINTS.CLOUD_TTS}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: text.slice(0, 5000) },
          voice: { languageCode: voice.languageCode, name: voice.name },
          audioConfig: TTS_CONFIG.AUDIO_CONFIG,
        }),
      });

      if (!response.ok) throw new Error('TTS API request failed');

      const data = await response.json();
      const audioContent: string = data.audioContent;
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const blobUrl = URL.createObjectURL(audioBlob);
      setBlobCache(cacheKey, blobUrl);

      const audio = new Audio(blobUrl);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      await audio.play();
    } catch (err: unknown) {
      logger.error('TTS Error:', err);
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = TTS_CONFIG.VOICE_MAP[lang]?.languageCode ?? 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setError('Cloud TTS unavailable. Using browser speech.');
      } else {
        setIsSpeaking(false);
        setError('Text-to-speech is not available.');
      }
    }
  }, [isDemo, stop]);

  return { speak, isSpeaking, stop, error, isDemo };
}
