import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../constants/translations';

interface LanguageContextType {
  currentLanguage: Language;
  isRTL: boolean;
  t: (key: string) => string;
  changeLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const languageHook = useLanguage();

  return (
    <LanguageContext.Provider value={languageHook}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}; 