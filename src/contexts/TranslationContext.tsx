/**
 * TranslationContext.tsx — Provides translation functions and current language to the entire app.
 */
import { createContext, useContext, type ReactNode } from 'react';
import useTranslate from 'hooks/useTranslate';
import { LANGUAGES } from 'constants/index';
import type { TranslationContextValue } from 'types/index';

const TranslationContext = createContext<TranslationContextValue>({
  currentLanguage: 'en',
  setLanguage: () => {},
  translate: async (t: string) => t,
  translateBatch: async (ts: string[]) => ts,
  t: (text: string) => text,
  loading: false,
  languages: LANGUAGES,
  isDemo: true,
});

/** Props for TranslationProvider. */
interface TranslationProviderProps {
  /** The child components */
  readonly children: ReactNode;
}

/**
 * Provider component for TranslationContext.
 */
export function TranslationProvider({ children }: TranslationProviderProps) {
  const translationHook = useTranslate();

  return (
    <TranslationContext.Provider
      value={{
        ...translationHook,
        languages: LANGUAGES,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * Custom hook to consume the TranslationContext.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation(): TranslationContextValue {
  return useContext(TranslationContext);
}

export default TranslationContext;
