import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SupportedLang } from "../i18n";
import type { ThemePreference } from "../store/preferencesSlice";

const LANG_KEY = "nursafar_language";
const THEME_KEY = "nursafar_theme";

export const preferencesStorage = {
  async saveLanguage(lang: SupportedLang): Promise<void> {
    await AsyncStorage.setItem(LANG_KEY, lang);
  },

  async getLanguage(): Promise<SupportedLang | null> {
    return (await AsyncStorage.getItem(LANG_KEY)) as SupportedLang | null;
  },


  async saveTheme(theme: ThemePreference): Promise<void> {
    await AsyncStorage.setItem(THEME_KEY, theme);
  },


  async getTheme(): Promise<ThemePreference | null> {
    return (await AsyncStorage.getItem(THEME_KEY)) as ThemePreference | null;
  },


  async loadAll(): Promise<{
    language: SupportedLang | null;
    theme: ThemePreference | null;
  }> {
    const [language, theme] = await AsyncStorage.multiGet([LANG_KEY, THEME_KEY]);
    return {
      language: (language[1] as SupportedLang | null) ?? null,
      theme: (theme[1] as ThemePreference | null) ?? null,
    };
  },
};


