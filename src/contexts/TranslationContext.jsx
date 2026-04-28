/**
 * TranslationContext.jsx — Provides translation functions and current language to the entire app.
 */
import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useTranslate from '../hooks/useTranslate';
import { LANGUAGES } from '../utils/mockData';

const TranslationContext = createContext({
  currentLanguage: 'en',
  setLanguage: () => {},
  translate: async (t) => t,
  translateBatch: async (ts) => ts,
  t: (text) => text,
  loading: false,
  languages: LANGUAGES,
  isDemo: true,
});

export function TranslationProvider({ children }) {
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

TranslationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTranslation() {
  return useContext(TranslationContext);
}

export default TranslationContext;
