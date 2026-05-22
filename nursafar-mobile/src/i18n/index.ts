import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en";
import ru from "./locales/ru";
import tj from "./locales/tj";



// ─── Supported languages ──────────────────────────────────────────────────────



export const LANGUAGES = {
  en: { name: "English",  nativeName: "English",  flag: "🇬🇧" },
  ru: { name: "Russian",  nativeName: "Русский",  flag: "🇷🇺" },
  tj: { name: "Tajik",    nativeName: "Тоҷикӣ",   flag: "🇹🇯" },
} as const;

export type SupportedLang = keyof typeof LANGUAGES;

// ─── Detect device locale, fall back to English ───────────────────────────────

function getDeviceLanguage(): SupportedLang {
  const tag = Localization.getLocales()[0]?.languageCode ?? "en";
  return (tag in LANGUAGES ? tag : "en") as SupportedLang;
}

// ─── Initialize i18next (called once at module load time) ─────────────────────

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    tj: { translation: tj },
  },
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
});

export default i18n;


