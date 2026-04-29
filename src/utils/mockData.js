/**
 * mockData.js — Realistic fallback data for demo mode (India Context).
 * When API keys are missing or calls fail, the app uses this data.
 */
import { 
  MOCK_RESPONSES, 
  MOCK_CIVIC_DATA, 
  MOCK_VIDEOS, 
  MOCK_TRANSLATIONS 
} from '../constants';

/**
 * Returns a mock AI response based on the prompt content.
 * @param {string} prompt - The user prompt.
 * @returns {string} The mock response.
 */
export function getMockGeminiResponse(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('eligib') || lower.includes('who can vote') || lower.includes('qualif'))
    return MOCK_RESPONSES.eligibility;
  if (lower.includes('regist') || lower.includes('form 6') || lower.includes('nvsp'))
    return MOCK_RESPONSES.registration;
  if (lower.includes('poll') || lower.includes('where do i vote') || lower.includes('booth'))
    return MOCK_RESPONSES.polling;
  if (lower.includes('evm') || lower.includes('vvpat') || lower.includes('ballot') || lower.includes('candidate'))
    return MOCK_RESPONSES.ballot;
  if (lower.includes('result') || lower.includes('count') || lower.includes('winner') || lower.includes('lok sabha'))
    return MOCK_RESPONSES.results;
  return MOCK_RESPONSES.default;
}

/**
 * Returns a mock translation for a given text and language.
 * @param {string} text - The source text.
 * @param {string} targetLang - The target language code.
 * @returns {string} The translated text.
 */
export function getMockTranslation(text, targetLang) {
  if (targetLang === 'en') return text;
  const langDict = MOCK_TRANSLATIONS[targetLang];
  if (langDict && langDict[text]) return langDict[text];
  return `[${targetLang.toUpperCase()}] ${text}`;
}

export { MOCK_CIVIC_DATA, MOCK_VIDEOS };
