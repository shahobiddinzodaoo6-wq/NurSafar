import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../src/hooks/useAppSelector";
import { useAppDispatch } from "../../src/hooks/useAppDispatch";
import { logout } from "../../src/store/authSlice";
import { storage } from "../../src/utils/storage";
import { useGetMyBookingsQuery } from "../../src/api/toursApi";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-5 py-4.5 bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-850"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 border ${
          danger
            ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-950"
            : "bg-gray-50 dark:bg-gray-850 border-gray-105/50 dark:border-gray-800"
        }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#EF4444" : "#6B7280"}
        />
      </View>
      <Text
        className={`flex-1 font-bold text-sm ${
          danger
            ? "text-red-500"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {label}
      </Text>
      {!danger && (
        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const { data: bookings, isLoading } = useGetMyBookingsQuery();

  const confirmed = bookings?.filter((b) => b.status === "CONFIRMED").length ?? 0;
  const pending   = bookings?.filter((b) => b.status === "PENDING").length ?? 0;

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* ── Profile Header ─────────────────────────────────────────────── */}
        <View className="mx-4 mt-4 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm shadow-black/5">
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-2xl bg-primary-500 items-center justify-center shadow-lg shadow-primary-500/20">
              <Text className="text-white text-2xl font-black">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-black text-gray-900 dark:text-white">
                {user?.name}
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                {user?.email}
              </Text>
              <View className="mt-2 bg-primary-50 dark:bg-primary-950/30 self-start px-3 py-1 rounded-full border border-primary-100 dark:border-primary-900/50">
                <Text className="text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wider">
                  {user?.role}
                </Text>
              </View>
            </View>
          </View>

          {/* Booking stats */}
          {isLoading ? (
            <ActivityIndicator className="mt-6" color="#2B6CB0" />
          ) : (
            <View className="flex-row gap-3 mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
              <View className="flex-1 p-3 bg-gray-50 dark:bg-gray-950 rounded-2xl items-center border border-gray-100 dark:border-gray-850">
                <Text className="text-xl font-black text-gray-900 dark:text-white">
                  {bookings?.length ?? 0}
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-[9px] font-bold uppercase tracking-wider mt-0.5">
                  {t("profile.totalBookings")}
                </Text>
              </View>
              <View className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl items-center border border-emerald-100 dark:border-emerald-900/40">
                <Text className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {confirmed}
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-[9px] font-bold uppercase tracking-wider mt-0.5">
                  {t("profile.confirmed")}
                </Text>
              </View>
              <View className="flex-1 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl items-center border border-amber-100 dark:border-amber-900/40">
                <Text className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {pending}
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-[9px] font-bold uppercase tracking-wider mt-0.5">
                  {t("profile.pending")}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── My Bookings ────────────────────────────────────────────────── */}
        <View className="mt-5 mx-4 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm shadow-black/5">
          <Text className="px-5 pt-4 pb-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {t("profile.myBookings")}
          </Text>
          <MenuItem
            icon="calendar-outline"
            label={t("profile.viewAll")}
            onPress={() => {}}
          />
        </View>

        {/* ── Account ────────────────────────────────────────────────────── */}
        <View className="mt-4 mx-4 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm shadow-black/5">
          <Text className="px-5 pt-4 pb-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {t("profile.account")}
          </Text>
          <MenuItem
            icon="person-outline"
            label={t("profile.editProfile")}
            onPress={() => {}}
          />
          <MenuItem
            icon="notifications-outline"
            label={t("profile.notifications")}
            onPress={() => {}}
          />
          <MenuItem
            icon="settings-outline"
            label={t("profile.settings")}
            onPress={() => router.push("/settings")}
          />
        </View>

        {/* ── Log Out ────────────────────────────────────────────────────── */}
        <View className="mt-5 mx-4 mb-8">
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 py-4.5 rounded-3xl border border-red-100 dark:border-red-950 bg-red-50 dark:bg-red-950/20 shadow-sm"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-500 font-extrabold text-sm tracking-wide">{t("profile.logOut")}</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-gray-300 dark:text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-6">
          {t("profile.version")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
