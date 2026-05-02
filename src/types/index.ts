/**
 * src/types/index.ts
 * Centralized TypeScript interfaces and types for ElectionIQ.
 */

/** Represents a supported language option. */
export interface Language {
  /** ISO 639-1 language code */
  readonly code: string;
  /** English name of the language */
  readonly name: string;
  /** Native name of the language */
  readonly nativeName: string;
}

/** Represents a single checklist item within a timeline step. */
export interface ChecklistItem {
  /** Display text for the checklist item */
  readonly text: string;
  /** Optional URL link to an official source */
  readonly link: string | null;
}

/** Represents one step in the election timeline. */
export interface ElectionStep {
  /** Unique identifier for the step */
  readonly id: string;
  /** Emoji icon for the step */
  readonly icon: string;
  /** Display title */
  readonly title: string;
  /** Detailed explanation of the step */
  readonly explanation: string;
  /** Action items for the step */
  readonly checklist: readonly ChecklistItem[];
  /** AI prompt associated with the step */
  readonly aiPrompt: string;
  /** CSS class for the decorative pattern */
  readonly patternClass: string;
}

/** Represents a single chat message in the AI assistant. */
export interface ChatMessage {
  /** The role of the message sender */
  readonly role: 'user' | 'assistant';
  /** The message content */
  content: string;
  /** Unix timestamp of the message */
  readonly timestamp: number;
}

/** Represents an address for a polling location. */
export interface PollingAddress {
  /** Name of the polling location */
  readonly locationName: string;
  /** Street address line 1 */
  readonly line1: string;
  /** City name */
  readonly city?: string;
  /** State name */
  readonly state?: string;
  /** ZIP/Postal code */
  readonly zip?: string;
}

/** Represents a polling location. */
export interface PollingLocation {
  /** Address details */
  readonly address: PollingAddress;
  /** Operating hours */
  readonly pollingHours: string;
  /** Additional notes */
  readonly notes: string;
  /** Latitude coordinate */
  readonly lat: number;
  /** Longitude coordinate */
  readonly lng: number;
}

/** Represents an election official. */
export interface ElectionOfficial {
  /** Official's name */
  readonly name: string;
  /** Office title */
  readonly office: string;
  /** Party affiliation */
  readonly party: string;
  /** Phone numbers */
  readonly phones?: readonly string[];
  /** Email addresses */
  readonly emails?: readonly string[];
}

/** Represents election information. */
export interface ElectionInfo {
  /** Name of the election */
  readonly name: string;
  /** Date of the election */
  readonly electionDay: string;
  /** Election identifier */
  readonly id: string;
}

/** Represents civic data from the Maps/Civic API. */
export interface CivicData {
  /** Election information */
  readonly election: ElectionInfo;
  /** List of polling locations */
  readonly pollingLocations: readonly PollingLocation[];
  /** List of election officials */
  readonly officials: readonly ElectionOfficial[];
  /** The queried address */
  readonly queriedAddress?: string;
  /** Latitude coordinate */
  readonly lat: number;
  /** Longitude coordinate */
  readonly lng: number;
}

/** Represents a YouTube video result. */
export interface VideoResult {
  /** YouTube video ID */
  readonly id: string;
  /** Video title */
  readonly title: string;
  /** Channel name */
  readonly channelTitle: string;
  /** Thumbnail URL */
  readonly thumbnail: string;
  /** Formatted view count */
  readonly viewCount: string;
  /** Publish date (YYYY-MM-DD) */
  readonly publishedAt: string;
}

/** Represents a response from the Gemini AI API. */
export interface GeminiResponse {
  /** The text content of the response */
  readonly text: string;
}

/** Return type of the useGemini hook. */
export interface UseGeminiReturn {
  /** Array of chat messages */
  readonly messages: ChatMessage[];
  /** Function to send a message */
  readonly sendMessage: (prompt: string) => Promise<void>;
  /** Whether a response is currently streaming */
  readonly isStreaming: boolean;
  /** Current error message, if any */
  readonly error: string | null;
  /** Function to reset the chat */
  readonly resetChat: () => void;
  /** Current message count */
  readonly messageCount: number;
  /** Whether the warning threshold has been reached */
  readonly isWarning: boolean;
  /** Whether the message limit has been reached */
  readonly isLimited: boolean;
  /** Whether the hook is in demo mode */
  readonly isDemo: boolean;
}

/** Return type of the useGoogleMaps hook. */
export interface UseGoogleMapsReturn {
  /** Civic data from the API */
  readonly data: CivicData | null;
  /** Whether a request is in progress */
  readonly loading: boolean;
  /** Current error message, if any */
  readonly error: string | null;
  /** Function to look up an address */
  readonly lookupAddress: (rawAddress: string) => Promise<void>;
  /** Whether the hook is in demo mode */
  readonly isDemo: boolean;
  /** The API key */
  readonly apiKey: string | undefined;
}

/** Return type of the useTTS hook. */
export interface UseTTSReturn {
  /** Function to speak text */
  readonly speak: (text: string, lang?: string) => Promise<void>;
  /** Whether speech is currently playing */
  readonly isSpeaking: boolean;
  /** Function to stop speech */
  readonly stop: () => void;
  /** Current error message, if any */
  readonly error: string | null;
  /** Whether the hook is in demo mode */
  readonly isDemo: boolean;
}

/** Return type of the useTranslate hook. */
export interface UseTranslateReturn {
  /** Function to translate a single text */
  readonly translate: (text: string, targetLang?: string) => Promise<string>;
  /** Function to translate an array of texts */
  readonly translateBatch: (texts: string[], targetLang?: string) => Promise<string[]>;
  /** Whether a translation is in progress */
  readonly loading: boolean;
  /** Current error message, if any */
  readonly error: string | null;
  /** Current language code */
  readonly currentLanguage: string;
  /** Function to set the language */
  readonly setLanguage: (lang: string) => void;
  /** Synchronous translation lookup */
  readonly t: (text: string) => string;
  /** Whether the hook is in demo mode */
  readonly isDemo: boolean;
}

/** Return type of the useYouTube hook. */
export interface UseYouTubeReturn {
  /** Array of video results */
  readonly videos: VideoResult[];
  /** Whether videos are loading */
  readonly loading: boolean;
  /** Current error message, if any */
  readonly error: string | null;
  /** Function to refresh videos */
  readonly refresh: () => Promise<void>;
  /** Whether the hook is in demo mode */
  readonly isDemo: boolean;
}

/** Validation result type. */
export interface ValidationResult {
  /** Whether the input is valid */
  readonly isValid: boolean;
  /** Error message if invalid */
  readonly error: string | null;
}

/** TTS Voice configuration. */
export interface VoiceConfig {
  /** BCP-47 language code */
  readonly languageCode: string;
  /** Voice name */
  readonly name: string;
}

/** TTS Audio configuration. */
export interface AudioConfig {
  /** Audio encoding format */
  readonly audioEncoding: string;
  /** Speaking rate */
  readonly speakingRate: number;
  /** Pitch adjustment */
  readonly pitch: number;
}

/** Rate limiter interface. */
export interface RateLimiter {
  /** Check if a message can be sent */
  canSend: () => boolean;
  /** Increment the message counter */
  increment: () => void;
  /** Get the current count */
  getCount: () => number;
  /** Check if in warning state */
  isWarning: () => boolean;
  /** Check if limited */
  isLimited: () => boolean;
  /** Reset the counter */
  reset: () => void;
}

/** Cache entry with TTL. */
export interface CacheEntry<T = unknown> {
  /** Stored value */
  readonly value: T;
  /** Expiry timestamp */
  readonly expiry: number;
}

/** Translation context value. */
export interface TranslationContextValue {
  /** Current language code */
  readonly currentLanguage: string;
  /** Function to set the language */
  readonly setLanguage: (lang: string) => void;
  /** Async translate function */
  readonly translate: (text: string, targetLang?: string) => Promise<string>;
  /** Async batch translate function */
  readonly translateBatch: (texts: string[], targetLang?: string) => Promise<string[]>;
  /** Synchronous translation lookup */
  readonly t: (text: string) => string;
  /** Whether translation is loading */
  readonly loading: boolean;
  /** Available languages */
  readonly languages: readonly Language[];
  /** Whether in demo mode */
  readonly isDemo: boolean;
}
