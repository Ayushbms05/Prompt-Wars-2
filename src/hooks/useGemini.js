/**
 * useGemini.js — Hook for Gemini AI chat using the official @google/generative-ai SDK.
 */
import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRateLimiter } from '../utils/rateLimit';
import { sanitizeInput } from '../utils/sanitize';
import { getMockGeminiResponse } from '../utils/mockData';
import { AI_CONFIG } from '../constants';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the SDK outside the hook or within a ref to prevent re-init
const genAI = API_KEY && API_KEY !== 'your_gemini_api_key_here' ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ 
  model: AI_CONFIG.MODEL_NAME,
  systemInstruction: AI_CONFIG.SYSTEM_INSTRUCTION 
}) : null;

/**
 * Custom hook to interact with Gemini AI.
 * @returns {{
 *   messages: Array<{role: string, content: string, timestamp: number}>,
 *   sendMessage: (prompt: string) => Promise<void>,
 *   isStreaming: boolean,
 *   error: string | null,
 *   resetChat: () => void,
 *   messageCount: number,
 *   isWarning: boolean,
 *   isLimited: boolean,
 *   isDemo: boolean
 * }}
 */
export default function useGemini() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  // Track message count in state for rendering safety
  const [count, setCount] = useState(0);
  
  const chatSessionRef = useRef(null);
  const limiterRef = useRef(createRateLimiter(AI_CONFIG.MAX_MESSAGES, AI_CONFIG.WARNING_THRESHOLD));

  const isDemo = !genAI || !model;

  /**
   * Sends a message to the AI and handles the streaming response.
   * @param {string} prompt - The user input prompt.
   */
  const sendMessage = useCallback(async (prompt) => {
    const sanitized = sanitizeInput(prompt);
    if (!sanitized) return;

    const limiter = limiterRef.current;
    if (!limiter.canSend()) {
      setError('Message limit reached. Please reset the chat.');
      return;
    }

    limiter.increment();
    setCount(limiter.getCount());
    
    const userMessage = { role: 'user', content: sanitized, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);

    try {
      if (isDemo) {
        // Demo mode fallback
        const mockResponse = getMockGeminiResponse(sanitized);
        const aiMessage = { role: 'assistant', content: '', timestamp: Date.now() };
        setMessages((prev) => [...prev, aiMessage]);
        
        const words = mockResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
          await new Promise((r) => setTimeout(r, 20));
          const partial = words.slice(0, i + 1).join(' ');
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: partial };
            return updated;
          });
        }
      } else {
        // Initialize chat session if it doesn't exist
        if (!chatSessionRef.current) {
          chatSessionRef.current = model.startChat({ history: [] });
        }

        const result = await chatSessionRef.current.sendMessageStream(sanitized);
        const aiMessage = { role: 'assistant', content: '', timestamp: Date.now() };
        setMessages((prev) => [...prev, aiMessage]);

        let fullText = '';
        for await (const chunk of result.stream) {
          const text = chunk.text();
          fullText += text;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error('Gemini API Error:', err);
      const fallback = getMockGeminiResponse(sanitized);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fallback, timestamp: Date.now() },
      ]);
      
      if (err.message?.includes('404')) {
        setError('Model not found (404). Please ensure the "Generative Language API" is enabled in your Google Cloud project (even for AI Studio keys).');
      } else {
        setError('AI Assistant temporarily unavailable. Showing demo response.');
      }
    } finally {
      setIsStreaming(false);
    }
  }, [isDemo]);

  /**
   * Resets the chat history and rate limiter.
   */
  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
    limiterRef.current.reset();
    setCount(0);
    chatSessionRef.current = null;
  }, []);

  return {
    messages,
    sendMessage,
    isStreaming,
    error,
    resetChat,
    messageCount: count,
    isWarning: count >= AI_CONFIG.WARNING_THRESHOLD && count < AI_CONFIG.MAX_MESSAGES,
    isLimited: count >= AI_CONFIG.MAX_MESSAGES,
    isDemo,
  };
}
