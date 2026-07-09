import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetMyTripsQuery,
  useUpdateTripStatusMutation,
} from "../../src/api/logisticsApi";
import { useAppSelector } from "../../src/hooks/useAppSelector";
import type { Logistics, LogisticsStatus } from "../../src/types";

const STATUS_CONFIG: Record<
  LogisticsStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    nextStatus: LogisticsStatus | null;
    actionLabel: string | null;
    actionColor: string;
  }
> = {
  PENDING: {
    label: "Pending Pickup",
    color: "#D97706",
    bgColor: "#FEF3C7",
    nextStatus: "IN_PROGRESS",
    actionLabel: "Start Trip (Picked Up)",
    actionColor: "#2B6CB0",
  },
  IN_PROGRESS: {
    label: "In Transit",
    color: "#2B6CB0",
    bgColor: "#EBF4FF",
    nextStatus: "COMPLETED",
    actionLabel: "Complete Trip (Dropped Off)",
    actionColor: "#059669",
  },
  COMPLETED: {
    label: "Completed",
    color: "#059669",
    bgColor: "#ECFDF5",
    nextStatus: null,
    actionLabel: null,
    actionColor: "",
  },
};

function TripCard({
  trip,
  onStatusChange,
  isUpdating,
}: {
  trip: Logistics;
  onStatusChange: (id: string, next: LogisticsStatus) => void;
  isUpdating: boolean;
}) {
  const cfg = STATUS_CONFIG[trip.status];
  const pilgrim = trip.booking?.user;
  const tour = trip.booking?.tour;

  const pickupDate = new Date(trip.pickupTime);
  const timeStr = pickupDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = pickupDate.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <View className="mx-4 mb-4 rounded-3xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Status Bar */}
      <View
        className="px-5 py-3 flex-row items-center justify-between"
        style={{ backgroundColor: cfg.bgColor }}
      >
        <View className="flex-row items-center gap-2">
          <View
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: cfg.color }}
          />
          <Text className="font-bold text-xs uppercase tracking-wider" style={{ color: cfg.color }}>
            {cfg.label}
          </Text>
        </View>
        <Text className="text-xs font-bold" style={{ color: cfg.color }}>
          {dateStr} · {timeStr}
        </Text>
      </View>

      <View className="p-5">
        {/* Pilgrim Details */}
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/20 items-center justify-center border border-primary-100 dark:border-primary-900/50">
              <Text className="text-primary-600 dark:text-primary-400 font-extrabold text-lg">
                {pilgrim?.name?.[0]?.toUpperCase() ?? "P"}
              </Text>
            </View>
            <View>
              <Text className="font-extrabold text-gray-900 dark:text-white text-base">
                {pilgrim?.name ?? "Pilgrim"}
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-xs">Pilgrim Passenger</Text>
            </View>
          </View>

          {/* Quick Call */}
          {pilgrim?.phone && (
            <TouchableOpacity
              className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/55 items-center justify-center shadow-sm"
              onPress={() => Linking.openURL(`tel:${pilgrim.phone}`)}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={18} color="#059669" />
            </TouchableOpacity>
          )}
        </View>

        {/* Route Timeline */}
        <View className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-4 mb-5 border border-gray-100 dark:border-gray-850">
          <View className="flex-row items-start gap-3">
            <View className="items-center mt-1">
              <View className="w-3 h-3 rounded-full border-2 border-primary-500 bg-white dark:bg-gray-950" />
              <View className="w-0.5 h-10 bg-gray-200 dark:bg-gray-800 my-1" />
              <View className="w-3 h-3 rounded-full bg-gold-400" />
            </View>
            <View className="flex-1 gap-3">
              <View>
                <Text className="text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-widest">Pickup Address</Text>
                <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5" numberOfLines={2}>
                  {trip.pickupAddress}
                </Text>
              </View>
              <View>
                <Text className="text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-widest">Destination</Text>
                <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5" numberOfLines={1}>
                  {tour?.title ?? "Haram Area Hotel"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action button */}
        {cfg.nextStatus && cfg.actionLabel && (
          <TouchableOpacity
            className="rounded-2xl py-4.5 items-center flex-row justify-center gap-2 shadow-md shadow-primary-500/10"
            style={{ backgroundColor: cfg.actionColor }}
            onPress={() => onStatusChange(trip.id, cfg.nextStatus!)}
            disabled={isUpdating}
            activeOpacity={0.85}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons
                  name={trip.status === "PENDING" ? "car" : "checkmark-circle"}
                  size={20}
                  color="#fff"
                />
                <Text className="text-white font-bold text-base tracking-wide">
                  {cfg.actionLabel}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {trip.status === "COMPLETED" && (
          <View className="flex-row items-center justify-center gap-2 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl">
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <Text className="text-emerald-600 dark:text-emerald-400 font-bold">
              Trip Completed
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function DriverTripsScreen() {
  const user = useAppSelector((s) => s.auth.user);
  const {
    data: trips,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyTripsQuery(undefined, {
    pollingInterval: 30_000,
  });

  const [updateStatus, { isLoading: isUpdating, originalArgs }] =
    useUpdateTripStatusMutation();

  async function handleStatusChange(id: string, status: LogisticsStatus) {
    const cfg = STATUS_CONFIG[
      trips?.find((t) => t.id === id)?.status ?? "PENDING"
    ];

    Alert.alert(
      "Update Status",
      `Mark this trip as "${cfg.actionLabel}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            try {
              await updateStatus({ id, status }).unwrap();
            } catch {
              Alert.alert("Error", "Could not update status. Try again.");
            }
          },
        },
      ]
    );
  }

  const ORDER: Record<LogisticsStatus, number> = {
    PENDING: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
  };
  const sorted = [...(trips ?? [])].sort(
    (a, b) => ORDER[a.status] - ORDER[b.status]
  );

  const active = sorted.filter(
    (t) => t.status === "PENDING" || t.status === "IN_PROGRESS"
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-2 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black text-gray-900 dark:text-white">My Trips</Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">
              Welcome, {user?.name?.split(" ")[0]}
            </Text>
          </View>
          {active > 0 && (
            <View className="bg-primary-500 w-8 h-8 rounded-full items-center justify-center shadow-lg shadow-primary-500/20">
              <Text className="text-white font-extrabold text-sm">{active}</Text>
            </View>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2B6CB0" />
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onStatusChange={handleStatusChange}
              isUpdating={
                isUpdating && originalArgs?.id === item.id
              }
            />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor="#2B6CB0"
            />
          }
          ListEmptyComponent={
            <View className="items-center py-24 px-6">
              <View className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
                <Ionicons name="bus-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-800 dark:text-white font-bold text-lg">
                No trips assigned
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1 text-center leading-relaxed">
                Pull down to refresh. New trips will appear here when assigned.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
