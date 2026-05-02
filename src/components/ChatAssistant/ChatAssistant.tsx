/**
 * ChatAssistant.tsx — Floating AI chat panel powered by Gemini.
 */
import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from 'react';
import useGemini from 'hooks/useGemini';
import { validateChatInput } from 'utils/validate';
import { SUGGESTED_QUESTIONS, AI_CONFIG, VALIDATION_CONFIG } from 'constants/index';

/** Props for ChatAssistant. */
interface ChatAssistantProps {
  /** Whether the chat panel is open */
  readonly isOpen: boolean;
  /** Callback to toggle the chat panel visibility */
  readonly onToggle: () => void;
  /** Optional message to pre-populate the input */
  readonly prefillMessage?: string;
}

/**
 * ChatAssistant component for AI-powered Q&A.
 */
export default function ChatAssistant({ isOpen, onToggle, prefillMessage }: ChatAssistantProps) {
  const {
    messages,
    sendMessage,
    isStreaming,
    error: apiError,
    resetChat,
    messageCount,
    isWarning,
    isLimited,
    isDemo,
  } = useGemini();

  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const error = localError ?? apiError;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (prefillMessage && isOpen && input !== prefillMessage) {
      setInput(prefillMessage);
    }
  }, [prefillMessage, isOpen, input]);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onToggle();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener('keydown', handleKeyDown);
    return () => panel.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  const handleSend = useCallback((): void => {
    const { isValid, error: validationError } = validateChatInput(input);

    if (!isValid) {
      setLocalError(validationError);
      return;
    }

    if (isStreaming || isLimited) return;

    setLocalError(null);
    sendMessage(input.trim());
    setInput('');
  }, [input, isStreaming, isLimited, sendMessage]);

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleSuggestion = useCallback((q: string): void => {
    setInput(q);
    setLocalError(null);
    sendMessage(q);
  }, [sendMessage]);

  if (!isOpen) {
    return (
      <button
        className="chat-toggle"
        onClick={onToggle}
        aria-label="Open AI chat assistant"
        title="Ask ElectionIQ"
      >
        <span className="chat-toggle__icon" aria-hidden="true">🤖</span>
        <span className="chat-toggle__label">Ask AI</span>
      </button>
    );
  }

  return (
    <div
      className="chat-panel"
      ref={panelRef}
      role="dialog"
      aria-label="ElectionIQ AI Chat Assistant"
      aria-modal="true"
    >
      {/* Header */}
      <div className="chat-panel__header">
        <div className="chat-panel__header-info">
          <span className="chat-panel__icon" aria-hidden="true">🤖</span>
          <div>
            <h3 className="chat-panel__title">ElectionIQ Assistant</h3>
            {isDemo && <span className="chat-panel__demo-badge">Demo Mode</span>}
          </div>
        </div>
        <div className="chat-panel__header-actions">
          <button
            className="chat-panel__btn-reset"
            onClick={resetChat}
            aria-label="Reset chat conversation"
            title="I'm done — start over"
          >
            ↻ Reset
          </button>
          <button
            className="chat-panel__btn-close"
            onClick={onToggle}
            aria-label="Close chat assistant"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-panel__messages" aria-live="polite" aria-relevant="additions">
        {messages.length === 0 && (
          <div className="chat-panel__welcome">
            <p className="chat-panel__welcome-text">
              Hi! I&apos;m your election education assistant. Ask me anything about voting,
              registration, eligibility, or election results.
            </p>
            <div className="chat-panel__suggestions">
              <p className="chat-panel__suggestions-label">Try asking:</p>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="chat-panel__suggestion"
                  onClick={() => handleSuggestion(q)}
                  aria-label={`Ask: ${q}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-msg ${msg.role === 'user' ? 'chat-msg--user' : 'chat-msg--ai'}`}
          >
            <div className="chat-msg__avatar" aria-hidden="true">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="chat-msg__bubble">
              <div className="chat-msg__content">
                {msg.content}
                {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                  <span className="chat-msg__cursor" aria-hidden="true">▊</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Rate Limit Warning */}
      {isWarning && (
        <div className="chat-panel__warning" role="alert">
          ⚠️ You have {AI_CONFIG.MAX_MESSAGES - messageCount} messages remaining in this session.
        </div>
      )}
      {isLimited && (
        <div className="chat-panel__limited" role="alert">
          Message limit reached. Click &quot;Reset&quot; to start a new conversation.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="chat-panel__error" role="alert">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="chat-panel__input-area">
        <input
          ref={inputRef}
          className="chat-panel__input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (localError) setLocalError(null);
          }}
          onKeyDown={handleKeyPress}
          placeholder="Ask about elections..."
          disabled={isStreaming || isLimited}
          aria-label="Type your election question"
          maxLength={VALIDATION_CONFIG.MAX_CHAT_LENGTH}
        />
        <button
          className="chat-panel__send"
          onClick={handleSend}
          disabled={!input.trim() || isStreaming || isLimited}
          aria-label="Send message"
        >
          {isStreaming ? '...' : '→'}
        </button>
      </div>

      {/* Disclaimer */}
      <div className="chat-panel__disclaimer">
        <small>
          This tool is for educational purposes only. Always verify with your official election authority.
        </small>
      </div>
    </div>
  );
}
