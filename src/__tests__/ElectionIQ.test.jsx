/**
 * ElectionIQ.test.js — Unit and integration tests.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { sanitizeInput, sanitizeAddress, isNonEmpty } from '../utils/sanitize';
import { getCache, setCache, getBlobCache, setBlobCache } from '../utils/cache';
import { createRateLimiter } from '../utils/rateLimit';
import { getMockGeminiResponse, getMockTranslation } from '../utils/mockData';

// ===== UTILITY TESTS =====

describe('sanitize', () => {
  it('strips HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('alert(xss)Hello');
  });
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });
  it('limits length', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long).length).toBe(500);
  });
  it('returns empty for non-string', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(123)).toBe('');
  });
  it('sanitizes address', () => {
    expect(sanitizeAddress('123 Main St; DROP TABLE')).toBe('123 Main St DROP TABLE');
  });
  it('collapses whitespace in address', () => {
    expect(sanitizeAddress('123   Main   St')).toBe('123 Main St');
  });
  it('limits address length', () => {
    expect(sanitizeAddress('a'.repeat(300)).length).toBe(200);
  });
  it('isNonEmpty works', () => {
    expect(isNonEmpty('hello')).toBe(true);
    expect(isNonEmpty('')).toBe(false);
    expect(isNonEmpty('  ')).toBe(false);
    expect(isNonEmpty(null)).toBe(false);
  });
});

describe('cache', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('sets and gets cache', () => {
    setCache('test_key', { data: 'hello' });
    expect(getCache('test_key')).toEqual({ data: 'hello' });
  });

  it('returns null for missing key', () => {
    expect(getCache('nonexistent')).toBeNull();
  });

  it('returns null for expired cache', () => {
    setCache('expired', 'val', -1000);
    expect(getCache('expired')).toBeNull();
  });

  it('blob cache set/get', () => {
    setBlobCache('tts_key', 'blob://test');
    expect(getBlobCache('tts_key')).toBe('blob://test');
  });

  it('blob cache returns null for missing', () => {
    expect(getBlobCache('missing')).toBeNull();
  });
});

describe('rateLimit', () => {
  it('creates limiter with defaults', () => {
    const limiter = createRateLimiter();
    expect(limiter.getCount()).toBe(0);
    expect(limiter.canSend()).toBe(true);
    expect(limiter.isWarning()).toBe(false);
    expect(limiter.isLimited()).toBe(false);
  });

  it('increments count', () => {
    const limiter = createRateLimiter(5, 3);
    limiter.increment();
    limiter.increment();
    expect(limiter.getCount()).toBe(2);
    expect(limiter.canSend()).toBe(true);
  });

  it('triggers warning at threshold', () => {
    const limiter = createRateLimiter(5, 3);
    for (let i = 0; i < 3; i++) limiter.increment();
    expect(limiter.isWarning()).toBe(true);
    expect(limiter.isLimited()).toBe(false);
  });

  it('blocks at max', () => {
    const limiter = createRateLimiter(5, 3);
    for (let i = 0; i < 5; i++) limiter.increment();
    expect(limiter.canSend()).toBe(false);
    expect(limiter.isLimited()).toBe(true);
  });

  it('resets properly', () => {
    const limiter = createRateLimiter(5, 3);
    for (let i = 0; i < 5; i++) limiter.increment();
    limiter.reset();
    expect(limiter.getCount()).toBe(0);
    expect(limiter.canSend()).toBe(true);
  });
});

describe('mockData', () => {
  it('returns eligibility response for keyword', () => {
    const r = getMockGeminiResponse('Am I eligible to vote?');
    expect(r).toContain('Indian Citizenship');
  });

  it('returns registration response', () => {
    const r = getMockGeminiResponse('How do I register?');
    expect(r).toContain("Voters' Service Portal");
  });

  it('returns default for unknown', () => {
    const r = getMockGeminiResponse('Random question xyz');
    expect(r).toContain('election process');
  });

  it('returns original text for en translation', () => {
    expect(getMockTranslation('Hello', 'en')).toBe('Hello');
  });

  it('returns spanish translation if available', () => {
    expect(getMockTranslation('Register to Vote', 'es')).toBe('Registrarse para Votar');
  });

  it('returns prefixed text for unknown translation', () => {
    const r = getMockTranslation('Random text', 'fr');
    expect(r).toContain('[FR]');
  });
});

// ===== COMPONENT TESTS =====

describe('App renders', () => {
  it('renders without crashing', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    expect(screen.getByTestId('app-root')).toBeDefined();
  });

  it('has skip-to-content link', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeDefined();
  });
});

describe('Timeline navigation', () => {
  it('renders all 6 step tabs', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(6);
  });

  it('clicking a tab changes active step', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[2]);
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
  });
});

describe('Chat toggle', () => {
  it('opens chat when Ask AI button clicked', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    const askBtn = screen.getByLabelText('Open AI assistant');
    fireEvent.click(askBtn);
    expect(screen.getByRole('dialog')).toBeDefined();
  });
});

describe('Language selector', () => {
  it('renders language dropdown', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    const sel = screen.getByLabelText('Select language');
    expect(sel).toBeDefined();
    expect(sel.options.length).toBe(8);
  });

  it('changes value on selection', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    const sel = screen.getByLabelText('Select language');
    fireEvent.change(sel, { target: { value: 'es' } });
    // Language change is debounced, but select value updates immediately in the DOM
    await vi.waitFor(() => {
      expect(sel.value).toBe('es');
    });
  });
});

describe('Address form validation', () => {
  it('shows error for empty address', async () => {
    const { default: PollingFinder } = await import('../components/PollingFinder/PollingFinder');
    const { TranslationProvider } = await import('../contexts/TranslationContext');
    render(
      <TranslationProvider>
        <PollingFinder />
      </TranslationProvider>
    );
    const submitBtn = await screen.findByLabelText(/search for polling station/i);
    fireEvent.click(submitBtn);
    expect(await screen.findByRole('alert')).toBeDefined();
  });
});
