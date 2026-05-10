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
      className="flex-row items-center px-5 py-4 bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${
          danger
            ? "bg-red-50 dark:bg-red-950"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#EF4444" : "#6B7280"}
        />
      </View>
      <Text
        className={`flex-1 font-medium text-sm ${
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
        <View className="px-5 pt-4 pb-6 bg-white dark:bg-gray-900 mb-3">
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-2xl bg-primary-500 items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name}
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm">
                {user?.email}
              </Text>
              <View className="mt-1 bg-primary-50 dark:bg-primary-900 self-start px-2 py-0.5 rounded-full">
                <Text className="text-primary-600 dark:text-primary-400 text-xs font-semibold capitalize">
                  {user?.role?.toLowerCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Booking stats */}
          {isLoading ? (
            <ActivityIndicator className="mt-4" color="#2B6CB0" />
          ) : (
            <View className="flex-row gap-3 mt-4">
              <View className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl items-center">
                <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookings?.length ?? 0}
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-xs">
                  {t("profile.totalBookings")}
                </Text>
              </View>
              <View className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-2xl items-center">
                <Text className="text-2xl font-bold text-emerald-600">
                  {confirmed}
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-xs">
                  {t("profile.confirmed")}
                </Text>
              </View>
              <View className="flex-1 p-3 bg-amber-50 dark:bg-amber-950 rounded-2xl items-center">
                <Text className="text-2xl font-bold text-amber-600">
                  {pending}
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-xs">
                  {t("profile.pending")}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── My Bookings ────────────────────────────────────────────────── */}
        <View className="mb-3">
          <Text className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t("profile.myBookings")}
          </Text>
          <MenuItem
            icon="calendar-outline"
            label={t("profile.viewAll")}
            onPress={() => {}}
          />
        </View>

        {/* ── Account ────────────────────────────────────────────────────── */}
        <View className="mb-3">
          <Text className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
        <View className="mb-8">
          <MenuItem
            icon="log-out-outline"
            label={t("profile.logOut")}
            onPress={handleLogout}
            danger
          />
        </View>

        <Text className="text-center text-gray-300 dark:text-gray-700 text-xs mb-6">
          {t("profile.version")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
