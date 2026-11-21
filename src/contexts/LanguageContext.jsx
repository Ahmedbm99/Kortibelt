import { createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTranslation } from '../i18n/languages';
import { alternatePath, langFromPath, pathsFor } from '@/lib/paths';

const LanguageContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * La langue vient de l'adresse : / = français, /en = anglais (une URL par langue pour Google).
 * Changer de langue ouvre la même page dans l'autre langue.
 */
export const LanguageProvider = ({ children }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const language = langFromPath(pathname);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage: (lang) => {
      if (lang !== language) navigate(alternatePath(pathname, search, lang));
    },
    /** t('key') ou t('key', { n: 3 }) pour remplacer {n}. */
    t: (key, vars) => getTranslation(language, key, vars),
    /** Constructeurs d'adresses dans la langue courante : paths.belt(b), paths.cart()… */
    paths: pathsFor(language),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
