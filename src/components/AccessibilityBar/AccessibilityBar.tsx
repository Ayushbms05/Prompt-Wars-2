/**
 * AccessibilityBar.tsx — Top bar with language, font size, contrast, dark mode, and read-aloud controls.
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'contexts/TranslationContext';
import useTTS from 'hooks/useTTS';

/** Props for AccessibilityBar. */
interface AccessibilityBarProps {
  /** Function to read the page content */
  readonly onReadPage: () => void;
}

/** Font size options. */
type FontSize = 'small' | 'medium' | 'large';

/**
 * AccessibilityBar component for managing UI preferences.
 */
export default function AccessibilityBar({ onReadPage }: AccessibilityBarProps) {
  const { currentLanguage, setLanguage, languages } = useTranslation();
  const { isSpeaking, stop } = useTTS();
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('electioniq-dark') === 'true';
    } catch {
      return false;
    }
  });

  // Apply dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    try {
      localStorage.setItem('electioniq-dark', String(darkMode));
    } catch { /* noop */ }
  }, [darkMode]);

  // Apply font size
  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize);
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', highContrast ? 'high' : 'normal');
  }, [highContrast]);

  const cycleFontSize = useCallback((): void => {
    setFontSize((prev) => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return 'small';
    });
  }, []);

  const handleReadAloud = useCallback((): void => {
    if (isSpeaking) {
      stop();
    } else if (onReadPage) {
      onReadPage();
    }
  }, [isSpeaking, stop, onReadPage]);

  return (
    <div className="accessibility-bar" role="toolbar" aria-label="Accessibility controls">
      <div className="accessibility-bar__inner">
        {/* Language Selector */}
        <div className="accessibility-bar__group">
          <label htmlFor="lang-select" className="accessibility-bar__label">
            🌐
          </label>
          <select
            id="lang-select"
            className="accessibility-bar__select"
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Toggle */}
        <button
          className="accessibility-bar__btn"
          onClick={cycleFontSize}
          aria-label={`Font size: ${fontSize}. Click to change.`}
          title={`Font size: ${fontSize}`}
        >
          <span aria-hidden="true">A</span>
          <span className="accessibility-bar__btn-label">
            {fontSize === 'small' ? 'S' : fontSize === 'medium' ? 'M' : 'L'}
          </span>
        </button>

        {/* High Contrast Toggle */}
        <button
          className="accessibility-bar__btn"
          onClick={() => setHighContrast((prev) => !prev)}
          aria-label={`High contrast mode: ${highContrast ? 'on' : 'off'}`}
          aria-pressed={highContrast}
          title="Toggle high contrast"
        >
          <span aria-hidden="true">◐</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          className="accessibility-bar__btn"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label={`Dark mode: ${darkMode ? 'on' : 'off'}`}
          aria-pressed={darkMode}
          title="Toggle dark mode"
        >
          <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
        </button>

        {/* Read Page Aloud */}
        <button
          className="accessibility-bar__btn accessibility-bar__btn--read"
          onClick={handleReadAloud}
          aria-label={isSpeaking ? 'Stop reading aloud' : 'Read current section aloud'}
          title={isSpeaking ? 'Stop reading' : 'Read page aloud'}
        >
          <span aria-hidden="true">{isSpeaking ? '⏹️' : '🔊'}</span>
          <span className="accessibility-bar__btn-label">
            {isSpeaking ? 'Stop' : 'Read'}
          </span>
        </button>
      </div>
    </div>
  );
}
