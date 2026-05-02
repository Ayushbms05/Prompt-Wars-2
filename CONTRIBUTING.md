# Contributing to ElectionIQ

Thank you for your interest in contributing to ElectionIQ! This document provides guidelines and instructions for contributing.

## Code Style Guide

- **Language**: TypeScript (strict mode). All source files must be `.ts` or `.tsx`.
- **Framework**: React 19+ with functional components and hooks.
- **Formatting**: Prettier with default settings. Run `npx prettier --write .` before committing.
- **Linting**: ESLint with strict rules. Zero warnings allowed. Run `npm run lint` to verify.
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `ChatAssistant.tsx`)
  - Hooks: `camelCase` prefixed with `use` (e.g., `useGemini.ts`)
  - Utilities: `camelCase` (e.g., `sanitize.ts`)
  - Types/Interfaces: `PascalCase` in `src/types/index.ts`
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINTS`)
- **Imports**: Use absolute imports from `src/` (e.g., `import logger from 'utils/logger'`).
- **Logging**: Never use `console.*` directly. Use the `logger` utility from `utils/logger.ts`.
- **State Management**: React Context + Hooks. No external state libraries.
- **CSS**: Vanilla CSS with BEM naming convention. All styles in `src/index.css`.

## How to Add a New Feature

1. **Create a branch** from `main` following the branch naming convention below.
2. **Define types** in `src/types/index.ts` for any new data structures.
3. **Create the hook** in `src/hooks/` if the feature requires API interaction or state logic.
4. **Create the component** in `src/components/YourFeature/YourFeature.tsx`.
5. **Write tests** in `src/__tests__/` covering at minimum:
   - Happy path rendering
   - Error states
   - User interactions
6. **Update constants** in `src/constants/index.ts` for any new configuration values.
7. **Run checks**:
   ```bash
   npm run lint        # Zero warnings
   npm run test        # All tests pass
   npm run build       # Clean build
   ```
8. **Submit a pull request** following the PR checklist below.

## Branch Naming Convention

Use the following format:

```
<type>/<short-description>
```

**Types**:
- `feature/` — New features (e.g., `feature/add-voter-quiz`)
- `fix/` — Bug fixes (e.g., `fix/chat-scroll-issue`)
- `refactor/` — Code improvements without behavior changes (e.g., `refactor/extract-map-hook`)
- `docs/` — Documentation only (e.g., `docs/update-readme`)
- `test/` — Adding or updating tests (e.g., `test/add-timeline-tests`)
- `chore/` — Build, CI, or tooling changes (e.g., `chore/update-eslint-config`)

## Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code compiles with `npm run build` (zero errors)
- [ ] All existing tests pass with `npm run test`
- [ ] New tests added for new functionality
- [ ] ESLint passes with `npm run lint` (zero warnings)
- [ ] TypeScript strict mode — no `any` types unless absolutely necessary and annotated with `// eslint-disable-next-line`
- [ ] No `console.*` calls — use `logger` utility instead
- [ ] All new interfaces added to `src/types/index.ts`
- [ ] Component has proper JSDoc comments
- [ ] Accessibility: all interactive elements have `aria-label` or `aria-labelledby`
- [ ] CHANGELOG.md updated with changes under `[Unreleased]`
- [ ] PR description includes: what changed, why, and how to test
