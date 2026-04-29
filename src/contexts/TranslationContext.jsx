/**
 * TranslationContext.jsx — Provides translation functions and current language to the entire app.
 */
import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useTranslate from '../hooks/useTranslate';
import { LANGUAGES } from '../constants';

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

/**
 * Provider component for TranslationContext.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The rendered TranslationProvider component.
 */
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
  /** The child components to wrap */
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to consume the TranslationContext.
 * @returns {Object} The context value.
 */
/* eslint-disable react-refresh/only-export-components */
export function useTranslation() {
  return useContext(TranslationContext);
}

export default TranslationContext;
