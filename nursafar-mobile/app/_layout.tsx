import "../global.css";
// Initialize i18next before any component renders
import "../src/i18n";

import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { AuthProvider } from "../src/providers/AuthProvider";
import { PreferencesProvider } from "../src/providers/PreferencesProvider";

export default function RootLayout() {
  return (
    <Provider store={store}>
      {/*
        PreferencesProvider must be inside Redux Provider (reads store),
        but outside AuthProvider (theme/lang loads in parallel with auth).
      */}
      <PreferencesProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </PreferencesProvider>
    </Provider>
  );
}
