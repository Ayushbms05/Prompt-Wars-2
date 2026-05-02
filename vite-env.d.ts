/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_MAPS_API_KEY: string;
  readonly VITE_YOUTUBE_API_KEY: string;
  readonly VITE_TTS_API_KEY: string;
  readonly VITE_TRANSLATE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
