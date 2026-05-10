import { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Linking,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../src/hooks/useAppDispatch";
import { useAppSelector } from "../src/hooks/useAppSelector";
import {
  setLanguage,
  setTheme,
  type ThemePreference,
} from "../src/store/preferencesSlice";
import { preferencesStorage } from "../src/utils/preferencesStorage";
import { storage } from "../src/utils/storage";
import { logout } from "../src/store/authSlice";
import i18n, { LANGUAGES, type SupportedLang } from "../src/i18n";

// ─── Theme options ─────────────────────────────────────────────────────────────

const THEME_OPTIONS: {
  value: ThemePreference;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  labelKey: keyof ReturnType<typeof useSettingsTranslations>;
}[] = [
  { value: "system",  icon: "phone-portrait-outline", labelKey: "themeSystem" },
  { value: "light",   icon: "sunny-outline",           labelKey: "themeLight"  },
  { value: "dark",    icon: "moon-outline",            labelKey: "themeDark"   },
];

// ─── Language options ──────────────────────────────────────────────────────────

const LANG_OPTIONS: { code: SupportedLang; labelKey: string; flag: string }[] = [
  { code: "en", labelKey: "langEn", flag: LANGUAGES.en.flag },
  { code: "ru", labelKey: "langRu", flag: LANGUAGES.ru.flag },
  { code: "tj", labelKey: "langTj", flag: LANGUAGES.tj.flag },
];

function useSettingsTranslations() {
  const { t } = useTranslation();
  return {
    title:            t("settings.title"),
    appearanceSection:t("settings.appearanceSection"),
    themeLabel:       t("settings.themeLabel"),
    themeSystem:      t("settings.themeSystem"),
    themeLight:       t("settings.themeLight"),
    themeDark:        t("settings.themeDark"),
    languageSection:  t("settings.languageSection"),
    langEn:           t("settings.langEn"),
    langRu:           t("settings.langRu"),
    langTj:           t("settings.langTj"),
    aboutSection:     t("settings.aboutSection"),
    appVersion:       t("settings.appVersion"),
    contactSupport:   t("settings.contactSupport"),
    accountSection:   t("settings.accountSection"),
    logOut:           t("settings.logOut"),
    logOutConfirm:    t("settings.logOutConfirm"),
  };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ icon, title }: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
}) {
  return (
    <View className="flex-row items-center gap-2 px-5 pt-6 pb-2">
      <Ionicons name={icon} size={14} color="#9CA3AF" />
      <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        {title}
      </Text>
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View className="mx-4 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-gray-100 dark:bg-gray-800 ml-5" />;
}

// ─── Theme Segment Control ─────────────────────────────────────────────────────

function ThemeSegmentControl({
  current,
  onChange,
}: {
  current: ThemePreference;
  onChange: (v: ThemePreference) => void;
}) {
  const { t } = useTranslation();
  const labels: Record<ThemePreference, string> = {
    system: t("settings.themeSystem"),
    light:  t("settings.themeLight"),
    dark:   t("settings.themeDark"),
  };
  const icons: Record<ThemePreference, React.ComponentProps<typeof Ionicons>["name"]> = {
    system: "phone-portrait-outline",
    light:  "sunny-outline",
    dark:   "moon-outline",
  };

  return (
    <View className="p-4">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {t("settings.themeLabel")}
      </Text>
      <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
        {(["system", "light", "dark"] as ThemePreference[]).map((opt) => {
          const active = current === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(opt)}
              activeOpacity={0.8}
              className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg ${
                active
                  ? "bg-white dark:bg-gray-700"
                  : "bg-transparent"
              }`}
              style={active ? {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.12,
                shadowRadius: 3,
                elevation: 2,
              } : undefined}
            >
              <Ionicons
                name={icons[opt]}
                size={14}
                color={active ? "#2B6CB0" : "#9CA3AF"}
              />
              <Text
                className={`text-xs font-semibold ${
                  active
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {labels[opt]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Language Row ──────────────────────────────────────────────────────────────

function LanguageRow({
  code,
  label,
  flag,
  selected,
  onPress,
  showDivider,
}: {
  code: SupportedLang;
  label: string;
  flag: string;
  selected: boolean;
  onPress: () => void;
  showDivider: boolean;
}) {
  return (
    <>
      <TouchableOpacity
        className="flex-row items-center px-5 py-4"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text className="text-xl mr-3">{flag}</Text>
        <Text className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </Text>
        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            selected
              ? "border-primary-500 bg-primary-500"
              : "border-gray-300 dark:border-gray-600 bg-transparent"
          }`}
        >
          {selected && (
            <Ionicons name="checkmark" size={12} color="#fff" />
          )}
        </View>
      </TouchableOpacity>
      {showDivider && <Divider />}
    </>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-5 py-4"
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
        {label}
      </Text>
      {value ? (
        <Text className="text-sm text-gray-400 dark:text-gray-500">{value}</Text>
      ) : (
        onPress && <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const s = useSettingsTranslations();
  const dispatch = useAppDispatch();
  const { setColorScheme } = useColorScheme();
  const { theme, language } = useAppSelector((st) => st.preferences);

  // Animated scale for logout button press feedback
  const logoutScale = useRef(new Animated.Value(1)).current;

  function animatePress(toValue: number) {
    Animated.spring(logoutScale, {
      toValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  }

  // ── Theme change ─────────────────────────────────────────────────────────────
  async function handleThemeChange(newTheme: ThemePreference) {
    setColorScheme(newTheme);
    dispatch(setTheme(newTheme));
    await preferencesStorage.saveTheme(newTheme);
  }

  // ── Language change ───────────────────────────────────────────────────────────
  async function handleLanguageChange(lang: SupportedLang) {
    if (lang === language) return;
    await i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    await preferencesStorage.saveLanguage(lang);
  }

  // ── Logout ───────────────────────────────────────────────────────────────────
  function handleLogout() {
    Alert.alert(s.logOut, s.logOutConfirm, [
      { text: s.logOut, style: "destructive", onPress: async () => {
        await storage.clearAll();
        dispatch(logout());
        router.replace("/(auth)/login");
      }},
      { text: "Cancel", style: "cancel" },
    ]);
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <SafeAreaView edges={["top"]} className="bg-white dark:bg-gray-950">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={Platform.OS === "ios" ? "#2B6CB0" : "#374151"}
            />
          </TouchableOpacity>

          <Text className="flex-1 text-center text-base font-bold text-gray-900 dark:text-white">
            {s.title}
          </Text>

          {/* Right spacer for symmetry */}
          <View className="w-9" />
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* ── Appearance ─────────────────────────────────────────────────── */}
        <SectionLabel icon="color-palette-outline" title={s.appearanceSection} />
        <Card>
          <ThemeSegmentControl
            current={theme}
            onChange={handleThemeChange}
          />
        </Card>

        {/* ── Language ───────────────────────────────────────────────────── */}
        <SectionLabel icon="globe-outline" title={s.languageSection} />
        <Card>
          {LANG_OPTIONS.map((opt, idx) => (
            <LanguageRow
              key={opt.code}
              code={opt.code}
              label={s[opt.labelKey as keyof typeof s] as string}
              flag={opt.flag}
              selected={language === opt.code}
              onPress={() => handleLanguageChange(opt.code)}
              showDivider={idx < LANG_OPTIONS.length - 1}
            />
          ))}
        </Card>

        {/* ── About ──────────────────────────────────────────────────────── */}
        <SectionLabel icon="information-circle-outline" title={s.aboutSection} />
        <Card>
          <InfoRow label={s.appVersion} value="1.0.0" />
          <Divider />
          <InfoRow
            label={s.contactSupport}
            onPress={() => Linking.openURL("mailto:support@nursafar.app")}
          />
        </Card>

        {/* ── Account / Log Out ──────────────────────────────────────────── */}
        <SectionLabel icon="person-circle-outline" title={s.accountSection} />
        <View className="mx-4">
          <Animated.View style={{ transform: [{ scale: logoutScale }] }}>
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900"
              onPress={handleLogout}
              onPressIn={() => animatePress(0.97)}
              onPressOut={() => animatePress(1)}
              activeOpacity={1}
            >
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text className="text-red-500 font-bold text-sm">{s.logOut}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* App signature */}
        <Text className="text-center text-gray-300 dark:text-gray-700 text-xs mt-8">
          NurSafar · Made with ❤️ for Umrah pilgrims
        </Text>
      </ScrollView>
    </View>
  );
}
