"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { translations, Language } from "@/lib/translations";

type TranslationKey = string;

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("mks-lang");
    if (stored === "en" || stored === "ro") {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("mks-lang", newLang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const dict = translations[lang] as Record<string, unknown>;
    const value = getNestedValue(dict, key);
    if (value !== key) return value;
    const enDict = translations.en as Record<string, unknown>;
    return getNestedValue(enDict, key);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used inside LanguageProvider");
  return ctx;
}
