# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-05-02

### Added

- **AI Chat Assistant** — Gemini AI-powered floating chat panel with streaming responses, rate limiting (10 messages/session), suggested questions, and focus trap for accessibility.
- **Election Timeline** — Interactive 6-step horizontal stepper covering eligibility, registration, polling booth, EVMs, voting, and results. Supports keyboard navigation (Arrow keys, Home, End).
- **Polling Station Finder** — Address lookup using Google Maps Geocoding API with interactive map embed, directions link, and demo mode fallback with realistic Indian election data.
- **Video Learning Hub** — Lazy-loaded YouTube video grid via YouTube Data API v3 with inline playback, view counts, and skeleton loading states.
- **Multi-Language Support** — 8 languages (English, Spanish, Hindi, French, Arabic, Mandarin, Portuguese, Swahili) powered by Google Cloud Translation API with debounced language switching.
- **Text-to-Speech** — Read-aloud functionality using Google Cloud TTS API with per-step narration and full-page reading. Falls back to browser SpeechSynthesis API.
- **Accessibility Controls** — Top toolbar with language selector, font size cycling (S/M/L), high contrast mode, dark mode toggle, and read-aloud button.
- **Error Boundaries** — Graceful error handling around every major section with retry functionality.
- **Skeleton Loaders** — Reusable loading placeholders with text, card, circle, title, and video variants.
- **Input Validation** — Client-side validation for addresses and chat messages with XSS sanitization.
- **Caching Layer** — SessionStorage caching with TTL for API responses and in-memory blob cache for TTS audio.
- **Rate Limiting** — Session-based rate limiter for AI chat with warning and limit states.
- **Demo Mode** — Full application functionality with realistic mock data when API keys are not configured.
- **Dark Mode** — Persistent dark/light theme toggle stored in localStorage.
- **TypeScript** — Full TypeScript migration with strict mode, shared interfaces in `src/types/index.ts`, and absolute imports.
- **Logger Utility** — Production-safe logger wrapping console methods, disabled in production builds.
- **ESLint Configuration** — Strict rules with zero-warning enforcement, TypeScript-aware linting.
- **Husky + lint-staged** — Pre-commit hooks for automated linting and formatting.
- **CONTRIBUTING.md** — Code style guide, feature workflow, branch naming convention, and PR checklist.
- **Comprehensive Test Suite** — Unit tests for utilities (sanitize, cache, rate limiter, mock data) and integration tests for components (App, Timeline, Chat, Language selector, Polling finder).

### Security

- HTML tag stripping and dangerous character sanitization on all user inputs.
- API keys loaded from environment variables, never hardcoded.
- CSP-friendly iframe embedding with `referrerPolicy` and `rel="noopener noreferrer"`.
