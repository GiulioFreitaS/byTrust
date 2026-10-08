import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Locale } from "../lib/translations";

const STORAGE_KEY = "bt_locale";

function getSavedLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && ["pt", "es", "en"].includes(saved)) return saved;
  } catch {
    // localStorage indisponível
  }
  // Auto-detect pelo navigator.language
  const lang = navigator.language?.slice(0, 2).toLowerCase();
  if (lang === "es") return "es";
  if (lang === "en") return "en";
  return "pt"; // default
}

// ── Types
type I18nCtxType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: <Section extends keyof typeof translations>(
    section: Section
  ) => (typeof translations)[Section][Locale];
};

const I18nCtx = createContext<I18nCtxType | null>(null);

// ── Provider
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // silencioso
    }
  }, []);

  const t = useCallback(
    <Section extends keyof typeof translations>(section: Section) =>
      translations[section][locale] as (typeof translations)[Section][Locale],
    [locale]
  );

  return (
    <I18nCtx.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nCtx.Provider>
  );
}

// ── Hook
export function useI18n(): I18nCtxType {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n deve ser usado dentro de I18nProvider");
  return ctx;
}

// ── Metadata dos idiomas disponíveis
export const LOCALES: { id: Locale; label: string; flag: string }[] = [
  { id: "pt", label: "Português", flag: "🇧🇷" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "en", label: "English", flag: "🇺🇸" },
];