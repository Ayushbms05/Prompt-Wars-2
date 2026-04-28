/**
 * ChatAssistant.jsx — Floating AI chat panel powered by Gemini.
 * Features: streaming responses, rate limiting, suggested questions, focus trap.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import useGemini from '../../hooks/useGemini';
import { sanitizeInput } from '../../utils/sanitize';
import { SUGGESTED_QUESTIONS } from '../../utils/mockData';

export default function ChatAssistant({ isOpen, onToggle, prefillMessage }) {
  const {
    messages,
    sendMessage,
    isStreaming,
    error,
    resetChat,
    messageCount,
    isWarning,
    isLimited,
    isDemo,
  } = useGemini();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle prefilled message from Timeline
  useEffect(() => {
    if (prefillMessage && isOpen) {
      setInput(prefillMessage);
    }
  }, [prefillMessage, isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onToggle();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

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

  const handleSend = useCallback(() => {
    const trimmed = sanitizeInput(input);
    if (!trimmed || isStreaming || isLimited) return;
    sendMessage(trimmed);
    setInput('');
  }, [input, isStreaming, isLimited, sendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleSuggestion = useCallback((q) => {
    setInput(q);
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
          ⚠️ You have {10 - messageCount} messages remaining in this session.
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

      {/* Input */}
      <div className="chat-panel__input-area">
        <input
          ref={inputRef}
          className="chat-panel__input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about elections..."
          disabled={isStreaming || isLimited}
          aria-label="Type your election question"
          maxLength={500}
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

ChatAssistant.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  prefillMessage: PropTypes.string,
};
