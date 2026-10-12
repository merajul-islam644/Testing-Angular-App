import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { defaultDictionary } from "./dictionary";
import type { TranslationKey } from "./dictionary";

// Testing Angular App ships English-only in this version (per the product brief), so
// the dictionary lives locally and the language setting is limited to "en".
type LocalizationLanguage = { code: string; name: string };

type LocalizationValue = {
  language: string;
  languages: LocalizationLanguage[];
  setLanguage: (language: string) => void;
  t: (key: TranslationKey, fallback?: string) => string;
};

const LocalizationContext = createContext<LocalizationValue | undefined>(undefined);
const LANGUAGE_KEY = "securevault:language";
const LANGUAGES: LocalizationLanguage[] = [{ code: "en", name: "English" }];

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [languageOverride, setLanguageOverride] = useState(() => localStorage.getItem(LANGUAGE_KEY) ?? "en");
  const language = LANGUAGES.some((entry) => entry.code === languageOverride) ? languageOverride : "en";

  function setLanguage(next: string) {
    localStorage.setItem(LANGUAGE_KEY, next);
    setLanguageOverride(next);
  }

  const value = useMemo<LocalizationValue>(() => ({
    language,
    languages: LANGUAGES,
    setLanguage,
    t: (key, fallback) => defaultDictionary[key] ?? fallback ?? key
  }), [language]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useT() {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error("useT must be used within LocalizationProvider");
  return context;
}