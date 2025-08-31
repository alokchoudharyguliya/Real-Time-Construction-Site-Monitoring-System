'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Language, useTranslation } from '@/lib/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageProvider = () => {
  const [language, setLanguageState] = useState<Language>('en');
  const t = useTranslation(language);

  useEffect(() => {
    const savedLang = localStorage.getItem('construction_language') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('construction_language', lang);
  };

  return {
    language,
    setLanguage,
    t,
  };
};

export { LanguageContext };