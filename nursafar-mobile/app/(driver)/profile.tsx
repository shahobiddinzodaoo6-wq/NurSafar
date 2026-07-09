import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../src/hooks/useAppSelector";
import { useAppDispatch } from "../../src/hooks/useAppDispatch";
import { logout } from "../../src/store/authSlice";
import { storage } from "../../src/utils/storage";
import { useGetMyTripsQuery } from "../../src/api/logisticsApi";

export default function DriverProfileScreen() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const { data: trips } = useGetMyTripsQuery();

  const completed  = trips?.filter((tr) => tr.status === "COMPLETED").length ?? 0;
  const pending    = trips?.filter((tr) => tr.status === "PENDING").length ?? 0;
  const inProgress = trips?.filter((tr) => tr.status === "IN_PROGRESS").length ?? 0;

  async function handleLogout() {
    Alert.alert(
      t("profile.logOutTitle"),
      t("profile.logOutConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profile.logOut"),
          style: "destructive",
          onPress: async () => {
            await storage.clearAll();
            dispatch(logout());
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  }

  const menuItems = [
    {
      icon: "person-outline" as const,
      label: t("profile.editProfile"),
      onPress: () => {},
    },
    {
      icon: "notifications-outline" as const,
      label: t("profile.notifications"),
      onPress: () => {},
    },
    {
      icon: "settings-outline" as const,
      label: t("profile.settings"),
      onPress: () => router.push("/settings"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* ── Driver Header Card ─────────────────────────────────────────── */}
        <View className="mx-4 mt-4 p-6 rounded-3xl bg-primary-500 shadow-lg shadow-primary-500/20">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-16 h-16 rounded-2xl bg-white/15 items-center justify-center border border-white/10 shadow-sm">
              <Ionicons name="bus" size={32} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-black" numberOfLines={1}>{user?.name}</Text>
              <Text className="text-primary-100 text-xs font-medium" numberOfLines={1}>{user?.email}</Text>
              <View className="mt-2 bg-white/20 self-start px-3 py-1 rounded-full border border-white/10">
                <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                  {t("auth.driver")}
                </Text>
              </View>
            </View>
          </View>

          {/* Trip stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white/10 rounded-2xl p-3.5 items-center border border-white/5">
              <Text className="text-white text-2xl font-black">{completed}</Text>
              <Text className="text-primary-100 text-[10px] font-bold uppercase tracking-wider mt-0.5">{t("driver.totalCompleted")}</Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-2xl p-3.5 items-center border border-white/5">
              <Text className="text-white text-2xl font-black">{inProgress}</Text>
              <Text className="text-primary-100 text-[10px] font-bold uppercase tracking-wider mt-0.5">{t("driver.inProgressCount")}</Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-2xl p-3.5 items-center border border-white/5">
              <Text className="text-white text-2xl font-black">{pending}</Text>
              <Text className="text-primary-100 text-[10px] font-bold uppercase tracking-wider mt-0.5">{t("driver.pendingCount")}</Text>
            </View>
          </View>
        </View>

        {/* ── Menu ──────────────────────────────────────────────────────── */}
        <View className="mx-4 mt-5 rounded-3xl bg-white dark:bg-gray-900 overflow-hidden mb-6 border border-gray-100 dark:border-gray-805 shadow-sm shadow-black/5">
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              className={`flex-row items-center px-5 py-4.5 ${
                idx < menuItems.length - 1
                  ? "border-b border-gray-50 dark:border-gray-850"
                  : ""
              }`}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-850 items-center justify-center mr-3 border border-gray-100/50 dark:border-gray-800/40">
                <Ionicons name={item.icon} size={18} color="#6B7280" />
              </View>
              <Text className="flex-1 font-bold text-gray-705 dark:text-gray-300 text-sm">
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Log Out ───────────────────────────────────────────────────── */}
        <TouchableOpacity
          className="mx-4 mb-8 flex-row items-center justify-center gap-2 py-4.5 rounded-3xl border border-red-100 dark:border-red-950 bg-red-50 dark:bg-red-950/20 shadow-sm"
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 font-extrabold text-sm tracking-wide">{t("profile.logOut")}</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-300 dark:text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-6">
          {t("profile.version")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
