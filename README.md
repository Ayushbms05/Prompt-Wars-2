# ElectionIQ — AI-Powered Election Education (India Edition)

An interactive, multilingual web application that guides users through the Indian electoral process step by step — from voter registration to understanding results. Built with React and deeply integrated with 5 Google Cloud services.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and add your API keys
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm test

# Production build
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

## Cloud Run Deployment

The app is configured for deployment on Google Cloud Run:
- **Project ID**: `promptwars2-494717`
- **Region**: `asia-south1` (Mumbai)

To redeploy, ensure your `gcloud` CLI is authenticated and run:
```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions "_VITE_GEMINI_API_KEY=...,_VITE_MAPS_API_KEY=..."
```


## Testing

```bash
npm test              # Run all tests (32/32 passing)
npm run test:coverage # Run with coverage report
```

## Tech Stack

- React 19 + Vite 8
- `@google/generative-ai` SDK
- Vitest + React Testing Library
- Vanilla CSS with custom properties
- Google Fonts (Playfair Display, Source Sans 3)
