/**
 * useTTS.js — Hook for Google Cloud Text-to-Speech API with demo fallback.
 * Caches audio blob URLs to avoid re-fetching identical speech.
 */
import { useState, useCallback, useRef } from 'react';
import { getBlobCache, setBlobCache } from '../utils/cache';

const API_KEY = import.meta.env.VITE_TTS_API_KEY;
const TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// Language code mapping for TTS voices
const VOICE_MAP = {
  en: { languageCode: 'en-US', name: 'en-US-Chirp3-HD-Charon' },
  es: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Charon' },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Chirp3-HD-Charon' },
  fr: { languageCode: 'fr-FR', name: 'fr-FR-Chirp3-HD-Charon' },
  ar: { languageCode: 'ar-XA', name: 'ar-XA-Chirp3-HD-Charon' },
  zh: { languageCode: 'cmn-CN', name: 'cmn-CN-Chirp3-HD-Charon' },
  pt: { languageCode: 'pt-BR', name: 'pt-BR-Chirp3-HD-Charon' },
  sw: { languageCode: 'sw-KE', name: 'sw-KE-Chirp3-HD-Charon' },
};

export default function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const isDemo = !API_KEY || API_KEY === 'your_cloud_tts_api_key_here';

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text, lang = 'en') => {
    if (!text) return;

    // Stop any current playback
    stop();
    setError(null);
    setIsSpeaking(true);

    const cacheKey = `tts_${lang}_${text.slice(0, 100)}`;

    try {
      if (isDemo) {
        // Demo mode: use browser's built-in SpeechSynthesis
        if (!window.speechSynthesis) {
          throw new Error('Speech synthesis not available in this browser.');
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = VOICE_MAP[lang]?.languageCode || 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
          setIsSpeaking(false);
          setError('Speech synthesis failed.');
        };
        window.speechSynthesis.speak(utterance);
        return;
      }

      // Check blob cache
      const cachedUrl = getBlobCache(cacheKey);
      if (cachedUrl) {
        const audio = new Audio(cachedUrl);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
        return;
      }

      // Real API call
      const voice = VOICE_MAP[lang] || VOICE_MAP.en;
      const response = await fetch(`${TTS_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: text.slice(0, 5000) },
          voice: {
            languageCode: voice.languageCode,
            name: voice.name,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.9,
            pitch: 0,
          },
        }),
      });

      if (!response.ok) throw new Error('TTS API request failed');

      const data = await response.json();
      const audioContent = data.audioContent;
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
    } catch (err) {
      // Fallback to browser TTS
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = VOICE_MAP[lang]?.languageCode || 'en-US';
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
