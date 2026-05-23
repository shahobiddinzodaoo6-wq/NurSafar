import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  hydratePreferences,
  markPrefsHydrated,
} from "../store/preferencesSlice";
import { preferencesStorage } from "../utils/preferencesStorage";
import i18n, { type SupportedLang } from "../i18n";
import type { ThemePreference } from "../store/preferencesSlice";

interface Props {
  children: React.ReactNode;
}


export function PreferencesProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const { setColorScheme } = useColorScheme();


  useEffect(() => {
    async function hydrate() {
      try {
        const { language, theme } = await preferencesStorage.loadAll();

        const resolvedLang: SupportedLang = language ?? "en";
        const resolvedTheme: ThemePreference = theme ?? "system";

        // Apply language to i18next (triggers re-render of all t() calls)
        if (i18n.language !== resolvedLang) {
          await i18n.changeLanguage(resolvedLang);
        }



        // Apply theme to NativeWind (triggers dark: class variants globally)
        setColorScheme(resolvedTheme);

        dispatch(hydratePreferences({ language: resolvedLang, theme: resolvedTheme }));
      } catch (e) {
        console.warn("[PreferencesProvider] hydration failed:", e);
        dispatch(markPrefsHydrated());
      }
    }

    hydrate();
  }, [dispatch, setColorScheme]);

  return <>{children}</>;
}


