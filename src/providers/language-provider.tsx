"use client";

import * as React from "react";
import type { Language, TranslationKey, DayKey, TranslationsType } from "@/lib/constants/languages";
import { TRANSLATIONS } from "@/lib/constants/languages";

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  translateDay: (day: DayKey) => string;
}

const LanguageContext = React.createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => null,
  t: () => '',
  translateDay: () => '',
});

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'language',
}: LanguageProviderProps) {
  const [language, setLanguage] = React.useState<Language>(
    () => (localStorage?.getItem(storageKey) as Language) || defaultLanguage
  );

  React.useEffect(() => {
    localStorage?.setItem(storageKey, language);
  }, [language, storageKey]);

  const t = React.useCallback(
    (key: TranslationKey) => {
      return TRANSLATIONS[language].ui[key];
    },
    [language]
  );

  const translateDay = React.useCallback(
    (day: DayKey) => {
      return TRANSLATIONS[language].days[day];
    },
    [language]
  );

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
      translateDay,
    }),
    [language, t, translateDay]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}; 