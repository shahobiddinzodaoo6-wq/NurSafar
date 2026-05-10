import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetMyTripsQuery,
  useUpdateTripStatusMutation,
} from "../../src/api/logisticsApi";
import { useAppSelector } from "../../src/hooks/useAppSelector";
import type { Logistics, LogisticsStatus } from "../../src/types";

// Status config — drives colors, labels, and the NEXT action
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
    label: "Pending",
    color: "#D97706",
    bgColor: "#FEF3C7",
    nextStatus: "IN_PROGRESS",
    actionLabel: "Picked Up",
    actionColor: "#2B6CB0",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#2B6CB0",
    bgColor: "#EBF4FF",
    nextStatus: "COMPLETED",
    actionLabel: "Dropped Off",
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
    <View className="mx-4 mb-4 rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      {/* Status bar */}
      <View
        className="px-4 py-2 flex-row items-center justify-between"
        style={{ backgroundColor: cfg.bgColor }}
      >
        <View className="flex-row items-center gap-1.5">
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: cfg.color }}
          />
          <Text className="font-semibold text-xs" style={{ color: cfg.color }}>
            {cfg.label}
          </Text>
        </View>
        <Text className="text-xs font-medium" style={{ color: cfg.color }}>
          {dateStr} · {timeStr}
        </Text>
      </View>

      <View className="p-4">
        {/* Pilgrim info */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="w-12 h-12 rounded-2xl bg-primary-100 items-center justify-center">
            <Text className="text-primary-600 font-bold text-lg">
              {pilgrim?.name?.[0]?.toUpperCase() ?? "P"}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-900 text-base">
              {pilgrim?.name ?? "Pilgrim"}
            </Text>
            {pilgrim?.phone && (
              <View className="flex-row items-center gap-1 mt-0.5">
                <Ionicons name="call-outline" size={12} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs">{pilgrim.phone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Route */}
        <View className="bg-gray-50 rounded-2xl p-3 mb-4">
          <View className="flex-row items-start gap-2">
            <View className="items-center mt-1">
              <View className="w-3 h-3 rounded-full border-2 border-primary-500 bg-white" />
              <View className="w-0.5 h-8 bg-gray-200 my-1" />
              <View className="w-3 h-3 rounded-full bg-primary-500" />
            </View>
            <View className="flex-1 gap-2">
              <View>
                <Text className="text-xs text-gray-400">Pickup</Text>
                <Text
                  className="text-sm font-semibold text-gray-700"
                  numberOfLines={2}
                >
                  {trip.pickupAddress}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-400">Destination</Text>
                <Text className="text-sm font-semibold text-gray-700">
                  {tour?.title ?? "Haram Area"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action button */}
        {cfg.nextStatus && cfg.actionLabel && (
          <TouchableOpacity
            className="rounded-2xl py-4 items-center flex-row justify-center gap-2"
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
                  name={
                    trip.status === "PENDING"
                      ? "car-outline"
                      : "checkmark-circle-outline"
                  }
                  size={20}
                  color="#fff"
                />
                <Text className="text-white font-bold text-base">
                  {cfg.actionLabel}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {trip.status === "COMPLETED" && (
          <View className="flex-row items-center justify-center gap-2 py-3">
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <Text className="text-emerald-600 font-semibold">
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
    pollingInterval: 30_000, // auto-refresh every 30s
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

  // Sort: PENDING first, then IN_PROGRESS, then COMPLETED
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-2 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">My Trips</Text>
            <Text className="text-gray-400 text-sm">
              Welcome, {user?.name?.split(" ")[0]}
            </Text>
          </View>
          {active > 0 && (
            <View className="bg-primary-500 w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-white font-bold text-sm">{active}</Text>
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
            <View className="items-center py-24">
              <Text className="text-5xl mb-4">🚐</Text>
              <Text className="text-gray-500 font-semibold text-lg">
                No trips assigned
              </Text>
              <Text className="text-gray-400 text-sm mt-1 text-center px-8">
                Pull down to refresh. New trips will appear here when assigned.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
