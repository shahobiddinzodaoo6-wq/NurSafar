import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SupportedLang } from "../i18n";

export type ThemePreference = "light" | "dark" | "system";

interface PreferencesState {
  language: SupportedLang;
  theme: ThemePreference;
  isHydrating: boolean;
}

const initialState: PreferencesState = {
  language: "en",
  theme: "system",
  isHydrating: true,
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLang>) {
      state.language = action.payload;
    },
    setTheme(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload;
    },
    hydratePreferences(
      state,
      action: PayloadAction<{ language: SupportedLang; theme: ThemePreference }>
    ) {
      state.language = action.payload.language;
      state.theme = action.payload.theme;
      state.isHydrating = false;
    },
    markPrefsHydrated(state) {
      state.isHydrating = false;
    },
  },
});

export const {
  setLanguage,
  setTheme,
  hydratePreferences,
  markPrefsHydrated,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
