# ElectionIQ — AI-Powered Election Education (India Edition)

An interactive, multilingual web application that guides users through the Indian electoral process step by step — from voter registration to understanding results. Built with **React 19 + TypeScript** and deeply integrated with **5 Google Cloud services**.

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment file and add your API keys
cp .env.example .env

# Start development server
npm run dev

# Run linter (zero warnings enforced)
npm run lint

# Run tests
npm test

# Production build (TypeScript check + Vite build)
npm run build
```

## Required Environment Variables

| Variable | Google Service | Console API Name |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Gemini AI (Chat) | Generative Language API |
| `VITE_MAPS_API_KEY` | Google Maps | Geocoding API & Maps Embed API |
| `VITE_YOUTUBE_API_KEY` | YouTube Videos | YouTube Data API v3 |
| `VITE_TTS_API_KEY` | Text-to-Speech | Cloud Text-to-Speech API |
| `VITE_TRANSLATE_API_KEY` | Translation | Cloud Translation API |

> **Demo Mode**: If any key is missing, that feature automatically falls back to realistic mock data so the full UI is always demonstrable.

## Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Enable billing
4. Enable these 5 APIs under **APIs & Services > Library**:
   - Generative Language API
   - Geocoding API
   - Maps Embed API
   - YouTube Data API v3
   - Cloud Text-to-Speech API
   - Cloud Translation API
5. Create API keys under **APIs & Services > Credentials**
6. Add keys to your `.env` file

## How Each Google Service Is Used

### 1. Gemini AI (gemini-flash-latest)
Powers the floating AI chat assistant. Users ask questions about Indian elections (Form 6, EPIC cards, EVMs, VVPAT, etc.) and receive accurate, non-partisan answers. Uses `generateContentStream` for real-time token-by-token response display.

### 2. Google Maps API
The "Find Your Polling Station" section uses the **Geocoding API** to locate Indian addresses and the **Maps Embed API** to display an interactive map showing the assigned polling booth (simulated location).

### 3. YouTube Data API v3
The Video Learning Hub searches for official Indian election education videos (from ECI or Sansad TV) using the `/search` endpoint, then fetches statistics via `/videos`.

### 4. Google Cloud Text-to-Speech
Every timeline step has a "Listen" button that calls the TTS `synthesize` endpoint. Generates MP3 audio narration in the user's selected language (including Hindi).

### 5. Google Cloud Translation
The language selector (8 languages) translates UI text via the Cloud Translation API. Supports: English, Hindi, Spanish, French, Arabic, Mandarin, Portuguese, Swahili.

## App Sections

1. **Interactive Election Timeline** — 6-step horizontal stepper explaining the Indian voting journey with official verification badges.
2. **AI Chat Assistant** — Floating Gemini-powered panel with streaming and suggested questions like "What is an EPIC card?".
3. **Polling Station Finder** — Address form calling Maps API with interactive map results.
4. **Video Learning Hub** — Lazy-loaded YouTube video grid with embedded players for ECI guides.
5. **Accessibility Bar** — Language, font size, contrast, dark mode, and read-aloud controls.
6. **Official Verification** — Contextual links to ECI and NVSP portals embedded directly in action items.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | **TypeScript** (strict mode) |
| Framework | React 19 + Vite 8 |
| AI SDK | `@google/generative-ai` |
| Testing | Vitest + React Testing Library (32 tests) |
| Linting | ESLint with TypeScript rules (zero-warning policy) |
| Formatting | Prettier |
| Pre-commit | Husky + lint-staged |
| Styling | Vanilla CSS with custom properties |
| Typography | Google Fonts (Playfair Display, Source Sans 3) |
| Deployment | Docker + Nginx on Google Cloud Run |

## Project Structure

```
src/
├── types/          # Shared TypeScript interfaces (ElectionStep, ChatMessage, etc.)
├── constants/      # Centralized config, mock data, API endpoints
├── utils/          # logger, cache, sanitize, validate, rateLimit, mockData
├── hooks/          # useGemini, useGoogleMaps, useTTS, useTranslate, useYouTube
├── contexts/       # TranslationContext (language provider)
├── components/     # AccessibilityBar, ChatAssistant, ErrorBoundary,
│                   # PollingFinder, SkeletonLoader, Timeline, VideoHub
├── __tests__/      # Unit + integration tests
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── index.css       # All styles (BEM naming)
```

## Cloud Run Deployment

The app is configured for deployment on Google Cloud Run:
- **Project ID**: `promptwars2-494717`
- **Region**: `asia-south1` (Mumbai)

API keys are passed as **Cloud Build substitutions** (never committed to source):

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions "_VITE_GEMINI_API_KEY=YOUR_KEY,_VITE_MAPS_API_KEY=YOUR_KEY,_VITE_YOUTUBE_API_KEY=YOUR_KEY,_VITE_TTS_API_KEY=YOUR_KEY,_VITE_TRANSLATE_API_KEY=YOUR_KEY"
```

Then deploy the built image:

```bash
gcloud run deploy election-iq \
  --image asia-south1-docker.pkg.dev/promptwars2-494717/cloud-run-source-deploy/election-iq \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 80
```

> **Security**: API keys are injected at Docker build time via `--build-arg` and baked into the static JS bundle. They are **never** stored in source control — `.env` is in `.gitignore`.

## Testing

```bash
npm test              # Run all tests (32/32 passing)
npm run test:coverage # Run with coverage report (80% threshold)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for code style guide, feature workflow, branch naming conventions, and PR checklist.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes following [Keep a Changelog](https://keepachangelog.com/) format.
