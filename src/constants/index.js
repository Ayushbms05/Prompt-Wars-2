/**
 * src/constants/index.js
 * Centralized store for magic strings, numbers, and config values.
 */

/**
 * API Endpoints for external services.
 * @type {Object}
 */
export const API_ENDPOINTS = {
  GEMINI: 'https://generativelanguage.googleapis.com',
  GOOGLE_MAPS_GEOCODE: 'https://maps.googleapis.com/maps/api/geocode/json',
  YOUTUBE_SEARCH: 'https://www.googleapis.com/youtube/v3/search',
  YOUTUBE_VIDEOS: 'https://www.googleapis.com/youtube/v3/videos',
  CLOUD_TTS: 'https://texttospeech.googleapis.com/v1/text:synthesize',
  CLOUD_TRANSLATE: 'https://translation.googleapis.com/language/translate/v2',
};

/**
 * Configuration for the Gemini AI model.
 * @type {Object}
 */
export const AI_CONFIG = {
  MODEL_NAME: 'gemini-flash-latest',
  SYSTEM_INSTRUCTION: `You are ElectionIQ, a helpful and non-partisan election education assistant for India. Explain voting, registration (Form 6), EPIC cards, EVMs, and VVPAT clearly. Use markdown.`,
  MAX_MESSAGES: 10,
  WARNING_THRESHOLD: 8,
};

/**
 * Configuration for Google Maps services.
 * @type {Object}
 */
export const MAP_CONFIG = {
  DEFAULT_COUNTRY: 'country:IN',
  MOCK_DELAY: 800,
};

/**
 * Configuration for YouTube Data API v3.
 * @type {Object}
 */
export const YOUTUBE_CONFIG = {
  MAX_RESULTS: '3',
  CACHE_KEY: 'yt_election_videos',
  MOCK_DELAY: 600,
  DEFAULT_QUERY: '"how to vote in india" OR "voter registration india" official election commission',
};

/**
 * Configuration for Cloud Text-to-Speech API.
 * @type {Object}
 */
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

/**
 * Configuration for Cloud Translation API.
 * @type {Object}
 */
export const TRANSLATE_CONFIG = {
  DEBOUNCE_TIMER: 500,
};

/**
 * Configuration for input validation.
 * @type {Object}
 */
export const VALIDATION_CONFIG = {
  MIN_ADDRESS_LENGTH: 10,
  MAX_ADDRESS_LENGTH: 200,
  MAX_CHAT_LENGTH: 500,
};

/**
 * Supported languages for the application.
 * @type {Array<{code: string, name: string, nativeName: string}>}
 */
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

/**
 * Suggested questions for the AI assistant.
 * @type {string[]}
 */
export const SUGGESTED_QUESTIONS = [
  'What is an EPIC card?',
  'How do I register using Form 6?',
  'How do EVMs and VVPATs work?',
  'What ID do I need if I lost my voter card?',
  'Can NRIs vote in Indian elections?',
  'How do I check my name in the voter list?',
];

/**
 * Step-by-step data for the election timeline.
 * @type {Array<Object>}
 */
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

/**
 * Caching configuration.
 * @type {Object}
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL: 30 * 60 * 1000, // 30 minutes
};

/**
 * Mock data for demo responses.
 * @type {Object}
 */
export const MOCK_RESPONSES = {
  default: `Great question! Here's what you should know about the Indian election process:\n\nThe Election Commission of India (ECI) ensures free and fair elections. The process begins with voter registration. You can register online through the Voters' Service Portal or the Voter Helpline App by filling out Form 6.\n\nOnce registered, your name is added to the Electoral Roll (voter list) and you will receive an EPIC (Elector's Photo Identity Card). On polling day, you can cast your vote at your designated polling station using an EVM (Electronic Voting Machine), with a VVPAT to verify your vote.\n\nIs there anything specific about the Indian voting process you'd like to know more about?`,

  eligibility: `To be eligible to vote in Indian elections, you must meet these requirements:\n\n1. **Indian Citizenship** — You must be a citizen of India.\n\n2. **Age Requirement** — You must be 18 years old on or before the qualifying date (usually January 1st of the year of revision of electoral roll).\n\n3. **Ordinary Resident** — You must be ordinarily resident of the polling area of the constituency where you want to be enrolled.\n\n4. **Not Disqualified** — You must not be disqualified from voting under any law relating to corrupt practices or other offences.\n\nNRIs (Non-Resident Indians) holding an Indian passport can also register to vote in their home constituency.`,

  registration: `Registering to vote in India is straightforward! Here are your options:\n\n**Online Registration:** Use the Voters' Service Portal (voters.eci.gov.in) or the Voter Helpline App on your phone. You need to fill out **Form 6** for new voter registration.\n\n**Required Documents:** You'll need a passport-size photograph, proof of age (e.g., birth certificate, 10th marksheet), and proof of residence (e.g., electricity bill, Aadhaar card, passport).\n\n**Offline Registration:** Download Form 6, fill it out, and submit it to your local Electoral Registration Officer (ERO) or Booth Level Officer (BLO).\n\nAfter verification, your name will be added to the Electoral Roll, and an EPIC (Voter ID) card will be sent to your address.`,

  polling: `Finding your polling booth is easy! Here's how:\n\n**Online Lookup:** Visit the official ECI portal and search the Electoral Roll using your EPIC number. It will show your Part Number, Serial Number, and the exact name of your polling station (usually a local government school or community hall).\n\n**Voter Information Slip:** BLOs usually distribute voter slips before the election day detailing your polling booth.\n\n**On Election Day:** Polling stations are typically open from 7:00 AM to 6:00 PM. Mobile phones are not allowed inside the booth.\n\n**What to Bring:** Bring your EPIC (Voter ID) card. If you don't have it, the ECI allows other approved photo ID documents like an Aadhaar card, PAN card, or Passport.`,

  ballot: `India uses EVMs (Electronic Voting Machines) instead of paper ballots for most elections:\n\n**EVMs:** The voting machine has a Ballot Unit with the names and symbols of candidates. Press the blue button next to your chosen candidate's symbol. The red light will glow, and you will hear a loud beep confirming your vote.\n\n**VVPAT:** The Voter Verifiable Paper Audit Trail (VVPAT) machine is kept next to the EVM. When you vote, a paper slip showing the serial number, name, and symbol of your chosen candidate will be visible for 7 seconds behind a glass window before dropping into a sealed box.\n\n**NOTA:** If you don't want to vote for any candidate, you can press the NOTA (None of the Above) button at the bottom of the EVM.`,

  results: `Here's how election results work in India:\n\n**Counting Day:** EVMs are stored in heavily guarded strongrooms until the designated Counting Day. Counting takes place in the presence of candidates and their agents.\n\n**EVM Counting:** Votes from EVMs are tallied round by round. VVPAT slips from randomly selected polling stations are also counted to verify the EVM results.\n\n**Majority:** For the Lok Sabha (national), a party or coalition needs a majority of 272 out of 543 seats to form the government. Vidhan Sabha (state) majorities depend on the state's total seats.\n\n**Results:** The ECI publishes the results live on their official website and Voter Helpline App. Once a candidate secures the highest votes in a constituency, the Returning Officer officially declares them the winner.`,
};

/**
 * Mock civic data for demo mode.
 * @type {Object}
 */
export const MOCK_CIVIC_DATA = {
  election: {
    name: 'General Election to Lok Sabha — Demo Data',
    electionDay: '2026-05-15',
    id: '9000',
  },
  pollingLocations: [
    {
      address: {
        locationName: 'Government Boys Senior Secondary School',
        line1: 'Room No. 2, Ground Floor',
        city: 'New Delhi',
        state: 'Delhi',
        zip: '110001',
      },
      pollingHours: '7:00 AM – 6:00 PM',
      notes: 'Please bring your EPIC card or Aadhaar card. Mobile phones are strictly prohibited inside the booth.',
      lat: 28.6139,
      lng: 77.2090
    },
  ],
  officials: [
    {
      name: 'P. Kumar',
      office: 'Booth Level Officer (BLO)',
      party: 'Election Commission of India',
      phones: ['1950 (Voter Helpline)'],
      emails: ['ceo_delhi@eci.gov.in'],
    },
    {
      name: 'District Magistrate',
      office: 'District Election Officer (DEO)',
      party: 'Nonpartisan',
      phones: ['011-23392339'],
    },
  ],
  lat: 28.6139,
  lng: 77.2090
};

/**
 * Mock video data for demo mode.
 * @type {Array<Object>}
 */
export const MOCK_VIDEOS = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'How to Vote using EVM and VVPAT - Official ECI Guide',
    channelTitle: 'Election Commission of India',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    viewCount: '5,450,000',
    publishedAt: '2024-03-15',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'How to Register as a New Voter online via Voters Service Portal',
    channelTitle: 'Election Commission of India',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    viewCount: '2,120,000',
    publishedAt: '2024-02-22',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Understanding Indian Elections: Lok Sabha and Vidhan Sabha',
    channelTitle: 'Sansad TV',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    viewCount: '3,780,000',
    publishedAt: '2024-01-10',
  },
];

/**
 * Mock translations for demo mode.
 * @type {Object}
 */
export const MOCK_TRANSLATIONS = {
  hi: {
    'Check Eligibility': 'पात्रता जांचें',
    'Register to Vote': 'मतदान के लिए पंजीकरण करें',
    'Find Your Polling Place': 'अपना मतदान केंद्र खोजें',
    'Learn the Ballot': 'ईवीएम को समझें',
    'Cast Your Vote': 'अपना वोट डालें',
    'Understand Results': 'परिणाम समझें',
  },
  es: {
    'Check Eligibility': 'Verificar Elegibilidad',
    'Register to Vote': 'Registrarse para Votar',
    'Find Your Polling Place': 'Encuentra tu Lugar de Votación',
    'Learn the Ballot': 'Conoce la Boleta',
    'Cast Your Vote': 'Emite tu Voto',
    'Understand Results': 'Entiende los Resultados',
  },
  fr: {
    'Check Eligibility': 'Vérifier l\'Éligibilité',
    'Register to Vote': 'S\'inscrire pour Voter',
    'Find Your Polling Place': 'Trouvez Votre Bureau de Vote',
    'Learn the Ballot': 'Comprendre le Bulletin',
    'Cast Your Vote': 'Votez',
    'Understand Results': 'Comprendre les Resultados',
  },
};
