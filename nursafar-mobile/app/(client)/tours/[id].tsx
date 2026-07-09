import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGetTourByIdQuery, useBookTourMutation } from "../../../src/api/toursApi";
import { useAppSelector } from "../../../src/hooks/useAppSelector";

function StatPill({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-1.5 bg-gray-55 dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-700/50 shadow-sm shadow-black/5">
      <Ionicons name={icon} size={15} color="#2B6CB0" />
      <Text className="text-gray-700 dark:text-gray-300 text-xs font-semibold">{label}</Text>
    </View>
  );
}

export default function TourDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: tour, isLoading, isError } = useGetTourByIdQuery(id!);
  const [bookTour, { isLoading: isBooking }] = useBookTourMutation();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  async function handleBook() {
    if (!isAuthenticated) {
      router.push("/(auth)/login");
      return;
    }
    Alert.alert("Confirm Booking", `Book "${tour?.title}" for $${tour?.price}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Book Now",
        style: "default",
        onPress: async () => {
          try {
            await bookTour(id!).unwrap();
            Alert.alert("Booked!", "Your tour has been booked successfully.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (err: any) {
            Alert.alert(
              "Booking Failed",
              err?.data?.message ?? "Could not complete booking. Try again."
            );
          }
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (isError || !tour) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" className="mb-3" />
        <Text className="text-gray-800 dark:text-white font-bold text-lg">Tour not found</Text>
        <TouchableOpacity className="mt-4 bg-primary-500 px-5 py-2.5 rounded-full" onPress={() => router.back()}>
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Image */}
        <View className="h-72 bg-primary-100 dark:bg-gray-850 relative">
          {tour.imageUrl ? (
            <Image
              source={{ uri: tour.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-primary-50 dark:bg-gray-800">
              <Ionicons name="business" size={80} color="#2B6CB0" />
            </View>
          )}

          {/* Back button */}
          <SafeAreaView className="absolute top-0 left-0 right-0" edges={["top"]}>
            <View className="px-4 pt-2">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-black/40 items-center justify-center border border-white/10"
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View className="px-5 pt-6">
          {/* Title + availability */}
          <View className="flex-row items-start justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white flex-1 mr-4 leading-tight">
              {tour.title}
            </Text>
            <View
              className={`px-3.5 py-1.5 rounded-full ${
                tour.isAvailable
                  ? "bg-emerald-100 dark:bg-emerald-950/20"
                  : "bg-red-100 dark:bg-red-950/20"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  tour.isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                }`}
              >
                {tour.isAvailable ? "Available" : "Full"}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row items-center gap-1.5 mb-6">
            <Ionicons name="location-outline" size={15} color="#9CA3AF" />
            <Text className="text-gray-400 dark:text-gray-500 text-sm">
              Departing from {tour.departureCity}
            </Text>
          </View>

          {/* Stats grid */}
          <View className="flex-row flex-wrap gap-2.5 mb-6">
            <StatPill
              icon="star"
              label={`${tour.hotelStars}-Star Hotel`}
            />
            <StatPill
              icon="navigate-outline"
              label={`${tour.distanceToHaram}km to Haram`}
            />
            <StatPill
              icon="time-outline"
              label={`${tour.duration} Days`}
            />
          </View>

          {/* Description */}
          {tour.description && (
            <View className="mb-6 bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800">
              <Text className="text-base font-bold text-gray-900 dark:text-white mb-2">
                About This Tour
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                {tour.description}
              </Text>
            </View>
          )}

          {/* Price breakdown */}
          <View className="p-5 bg-primary-50 dark:bg-primary-950/20 rounded-3xl border border-primary-100 dark:border-primary-900/50">
            <Text className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1.5">
              Starting from
            </Text>
            <Text className="text-3xl font-extrabold text-primary-500 dark:text-primary-400">
              ${tour.price.toLocaleString()}
            </Text>
            <Text className="text-primary-400 dark:text-primary-500 text-xs mt-0.5">per person</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Book Now Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-5 shadow-lg shadow-black/10"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16, paddingTop: 16 }}
      >
        <TouchableOpacity
          className={`rounded-2xl py-4.5 items-center justify-center ${
            !tour.isAvailable || isBooking
              ? "bg-gray-200 dark:bg-gray-800"
              : "bg-primary-500 shadow-lg shadow-primary-500/20"
          }`}
          onPress={handleBook}
          disabled={!tour.isAvailable || isBooking}
          activeOpacity={0.85}
        >
          {isBooking ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text
              className={`font-bold text-base ${
                !tour.isAvailable ? "text-gray-400 dark:text-gray-600" : "text-white"
              }`}
            >
              {tour.isAvailable ? `Book Now · $${tour.price.toLocaleString()}` : "Fully Booked"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
