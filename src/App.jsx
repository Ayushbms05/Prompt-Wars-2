/**
 * App.jsx — Main application shell for ElectionIQ.
 */
import { useState, useCallback, lazy, Suspense } from 'react';
import { TranslationProvider } from './contexts/TranslationContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AccessibilityBar from './components/AccessibilityBar/AccessibilityBar';
import Timeline from './components/Timeline/Timeline';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';
import PollingFinder from './components/PollingFinder/PollingFinder';
import SkeletonLoader from './components/SkeletonLoader/SkeletonLoader';
import useTTS from './hooks/useTTS';

const VideoHub = lazy(() => import('./components/VideoHub/VideoHub'));

function AppContent() {
  const [chatOpen, setChatOpen] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState('');
  const { speak } = useTTS();

  const handleAskAI = useCallback((prompt) => {
    setPrefillMessage(prompt);
    setChatOpen(true);
  }, []);

  const toggleChat = useCallback(() => {
    setChatOpen((prev) => !prev);
    if (chatOpen) setPrefillMessage('');
  }, [chatOpen]);

  const handleReadPage = useCallback(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const text = mainContent.innerText?.slice(0, 3000) || '';
      speak(text, 'en');
    }
  }, [speak]);

  return (
    <div className="app" data-testid="app-root">
      {/* Skip to content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Accessibility Bar */}
      <ErrorBoundary title="Accessibility controls unavailable">
        <AccessibilityBar onReadPage={handleReadPage} />
      </ErrorBoundary>

      {/* Hero */}
      <header className="hero" role="banner">
        <div className="hero__inner">
          <div className="hero__badge">AI-Powered Election Education</div>
          <h1 className="hero__title">
            Election<span className="hero__title-accent">IQ</span>
          </h1>
          <p className="hero__subtitle">
            Your step-by-step guide to understanding the election process — 
            from voter registration to casting your ballot to understanding results.
          </p>
          <div className="hero__actions">
            <a href="#timeline" className="hero__cta hero__cta--primary">
              Start Your Journey
            </a>
            <button
              className="hero__cta hero__cta--secondary"
              onClick={() => setChatOpen(true)}
              aria-label="Open AI assistant"
            >
              🤖 Ask AI Assistant
            </button>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">6</span>
              <span className="hero__stat-label">Steps to Vote</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-number">8</span>
              <span className="hero__stat-label">Languages</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-number">5</span>
              <span className="hero__stat-label">Google APIs</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* Timeline Section */}
        <ErrorBoundary title="Timeline unavailable">
          <Timeline onAskAI={handleAskAI} />
        </ErrorBoundary>

        {/* Polling Place Finder */}
        <ErrorBoundary title="Polling finder unavailable">
          <PollingFinder />
        </ErrorBoundary>

        {/* Video Hub (Lazy Loaded) */}
        <ErrorBoundary title="Video hub unavailable">
          <Suspense fallback={
            <section className="video-hub" aria-label="Loading videos">
              <h2 className="video-hub__heading">Video Learning Hub</h2>
              <div className="video-hub__grid">
                <SkeletonLoader variant="video" />
                <SkeletonLoader variant="video" />
                <SkeletonLoader variant="video" />
              </div>
            </section>
          }>
            <VideoHub />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="footer__inner">
          <p className="footer__brand">
            Election<span className="footer__brand-accent">IQ</span> — AI-Powered Election Education
          </p>
          <p className="footer__disclaimer">
            This application is for educational purposes only. It does not provide legal advice.
            Always verify information with your official state or local election authority.
          </p>
          <p className="footer__services">
            Powered by Google Gemini · Google Maps API · YouTube Data API · Cloud TTS · Cloud Translation
          </p>
        </div>
      </footer>

      {/* Chat Assistant (Floating) */}
      <ErrorBoundary title="Chat unavailable">
        <ChatAssistant
          isOpen={chatOpen}
          onToggle={toggleChat}
          prefillMessage={prefillMessage}
        />
      </ErrorBoundary>
    </div>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
}
