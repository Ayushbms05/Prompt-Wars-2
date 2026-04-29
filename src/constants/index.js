/**
 * src/constants/index.js
 * Centralized store for magic strings, numbers, and config values.
 */

// API Endpoints
export const API_ENDPOINTS = {
  GEMINI: 'https://generativelanguage.googleapis.com',
  GOOGLE_MAPS_GEOCODE: 'https://maps.googleapis.com/maps/api/geocode/json',
  YOUTUBE_SEARCH: 'https://www.googleapis.com/youtube/v3/search',
  YOUTUBE_VIDEOS: 'https://www.googleapis.com/youtube/v3/videos',
  CLOUD_TTS: 'https://texttospeech.googleapis.com/v1/text:synthesize',
  CLOUD_TRANSLATE: 'https://translation.googleapis.com/language/translate/v2',
};

// Model Config
export const AI_CONFIG = {
  MODEL_NAME: 'gemini-flash-latest',
  SYSTEM_INSTRUCTION: `You are ElectionIQ, a helpful and non-partisan election education assistant for India. Explain voting, registration (Form 6), EPIC cards, EVMs, and VVPAT clearly. Use markdown.`,
  MAX_MESSAGES: 10,
  WARNING_THRESHOLD: 8,
};

// Map Config
export const MAP_CONFIG = {
  DEFAULT_COUNTRY: 'country:IN',
  MOCK_DELAY: 800,
};

// YouTube Config
export const YOUTUBE_CONFIG = {
  MAX_RESULTS: '3',
  CACHE_KEY: 'yt_election_videos',
  MOCK_DELAY: 600,
  DEFAULT_QUERY: '"how to vote in india" OR "voter registration india" official election commission',
};

// TTS Config
export const TTS_CONFIG = {
  VOICE_MAP: {
    en: { languageCode: 'en-US', name: 'en-US-Chirp3-HD-Charon' },
    es: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Charon' },
    hi: { languageCode: 'hi-IN', name: 'hi-IN-Chirp3-HD-Charon' },
    fr: { languageCode: 'fr-FR', name: 'fr-FR-Chirp3-HD-Charon' },
    ar: { languageCode: 'ar-XA', name: 'ar-XA-Chirp3-HD-Charon' },
    zh: { languageCode: 'cmn-CN', name: 'cmn-CN-Chirp3-HD-Charon' },
    pt: { languageCode: 'pt-BR', name: 'pt-BR-Chirp3-HD-Charon' },
    sw: { languageCode: 'sw-KE', name: 'sw-KE-Chirp3-HD-Charon' },
  },
  AUDIO_CONFIG: {
    audioEncoding: 'MP3',
    speakingRate: 0.9,
    pitch: 0,
  },
};

// Translation Config
export const TRANSLATE_CONFIG = {
  DEBOUNCE_TIMER: 500,
};

// Validation Config
export const VALIDATION_CONFIG = {
  MIN_ADDRESS_LENGTH: 10,
  MAX_CHAT_LENGTH: 500,
};

// Language List
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
];

// Suggested Chat Questions
export const SUGGESTED_QUESTIONS = [
  'What is an EPIC card?',
  'How do I register using Form 6?',
  'How do EVMs and VVPATs work?',
  'What ID do I need if I lost my voter card?',
  'Can NRIs vote in Indian elections?',
  'How do I check my name in the voter list?',
];

// Timeline Step Data
export const TIMELINE_STEPS = [
  {
    id: 'eligibility',
    icon: '✓',
    title: 'Check Eligibility',
    explanation:
      'Before you can vote in India, you need to confirm your eligibility. You must be an Indian citizen, at least 18 years old on the qualifying date (usually January 1st), and ordinarily resident in the constituency where you wish to vote. NRIs holding an Indian passport are also eligible to register. Ensure you are not legally disqualified from voting.',
    checklist: [
      { text: 'Confirm Indian citizenship', link: 'https://eci.gov.in/voter/voters-guide' },
      { text: 'Verify you are 18+ years old', link: 'https://voters.eci.gov.in' },
      { text: 'Ensure you are an ordinary resident of your area', link: 'https://eci.gov.in/voter/voters-guide' },
      { text: 'Hold a valid proof of address and age', link: 'https://eci.gov.in/voter/voters-guide' },
    ],
    aiPrompt: 'What are the eligibility requirements to vote in Indian elections?',
    patternClass: 'pattern-dots',
  },
  {
    id: 'register',
    icon: '📋',
    title: 'Register to Vote',
    explanation:
      'Voter registration is mandatory to cast your vote. You can apply online through the Voters\' Service Portal or the Voter Helpline App by filling out Form 6. You will need to upload a photograph and documents for proof of age and address. Once approved, your name is added to the Electoral Roll and an EPIC (Voter ID) card is mailed to you.',
    checklist: [
      { text: 'Fill Form 6 online', link: 'https://voters.eci.gov.in/login' },
      { text: 'Check registration status', link: 'https://voters.eci.gov.in' },
      { text: 'Find your constituency', link: 'https://delimitation.eci.gov.in' },
      { text: 'Receive your EPIC (Voter ID) card', link: null },
    ],
    aiPrompt: 'How do I register to vote in India and what is Form 6?',
    patternClass: 'pattern-lines',
  },
  {
    id: 'polling',
    icon: '📍',
    title: 'Find Your Polling Booth',
    explanation:
      'Your polling booth is the specific location where you must cast your vote on election day, typically a local government school or community center. You can search for your name in the Electoral Roll online to find your exact Part Number and Polling Station. Booth Level Officers (BLOs) also distribute Voter Information Slips before the election.',
    checklist: [
      { text: 'Search your polling booth', link: 'https://voters.eci.gov.in/booth-search' },
      { text: 'Download Voter ID / e-EPIC', link: 'https://voters.eci.gov.in/e-epic' },
      { text: 'Note down your Part Number and Serial Number', link: null },
      { text: 'Collect your Voter Information Slip from the BLO', link: null },
    ],
    aiPrompt: 'How do I find my polling booth and check my name in the voter list?',
    patternClass: 'pattern-cross',
  },
  {
    id: 'ballot',
    icon: '📄',
    title: 'Understand EVMs',
    explanation:
      'India uses Electronic Voting Machines (EVMs) for elections. An EVM consists of a Control Unit and a Ballot Unit. The Ballot Unit displays the names and symbols of candidates. You press the blue button next to your chosen candidate. A VVPAT (Voter Verifiable Paper Audit Trail) machine attached to the EVM will show a printed slip for 7 seconds to verify your choice.',
    checklist: [
      { text: 'View candidate list', link: 'https://affidavit.eci.gov.in' },
      { text: 'Know your candidates\' affidavits', link: 'https://affidavit.eci.gov.in' },
      { text: 'Understand how to press the blue button on the EVM', link: null },
      { text: 'Know about the NOTA (None of the Above) option', link: null },
    ],
    aiPrompt: 'How do I cast my vote using an EVM and VVPAT?',
    patternClass: 'pattern-zigzag',
  },
  {
    id: 'vote',
    icon: '🗳️',
    title: 'Cast Your Vote',
    explanation:
      'On election day, go to your polling booth. The polling officials will check your name in the voter list and verify your ID (EPIC card or other approved IDs). They will apply indelible ink on your left index finger, take your signature, and allow you to proceed to the voting compartment to cast your vote secretly on the EVM.',
    checklist: [
      { text: 'Voter helpline (Call 1950)', link: 'https://www.nvsp.in' },
      { text: 'Election date & schedule', link: 'https://eci.gov.in/elections' },
      { text: 'Get your identity verified and finger inked', link: null },
      { text: 'Cast your vote secretly on the EVM', link: null },
    ],
    aiPrompt: 'What happens inside the polling booth on election day?',
    patternClass: 'pattern-waves',
  },
  {
    id: 'results',
    icon: '📊',
    title: 'Understand Results',
    explanation:
      'After polling ends, EVMs are sealed and secured in strongrooms. On Counting Day, votes are tallied electronically under heavy security and CCTV surveillance. VVPAT slips from randomly selected booths are manually counted to double-check EVM totals. The Election Commission of India publishes the verified results live.',
    checklist: [
      { text: 'Live election results', link: 'https://results.eci.gov.in' },
      { text: 'Historical results data', link: 'https://eci.gov.in/statistical-report' },
      { text: 'Wait for the Returning Officer to declare official results', link: null },
    ],
    aiPrompt: 'How are EVM votes counted and results declared by the ECI?',
    patternClass: 'pattern-grid',
  },
];
