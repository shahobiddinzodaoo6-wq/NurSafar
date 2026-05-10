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
    <View className="flex-row items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-2">
      <Ionicons name={icon} size={14} color="#6B7280" />
      <Text className="text-gray-600 text-xs font-medium">{label}</Text>
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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (isError || !tour) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-4xl mb-3">😕</Text>
        <Text className="text-gray-500 font-semibold">Tour not found</Text>
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <Text className="text-primary-500 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Image */}
        <View className="h-72 bg-primary-100 relative">
          {tour.imageUrl ? (
            <Image
              source={{ uri: tour.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-8xl">🕌</Text>
            </View>
          )}

          {/* Back button */}
          <SafeAreaView className="absolute top-0 left-0 right-0" edges={["top"]}>
            <View className="px-4 pt-2">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View className="px-5 pt-5">
          {/* Title + availability */}
          <View className="flex-row items-start justify-between mb-3">
            <Text className="text-2xl font-bold text-gray-900 flex-1 mr-2">
              {tour.title}
            </Text>
            <View
              className={`px-3 py-1 rounded-full ${
                tour.isAvailable ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  tour.isAvailable ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {tour.isAvailable ? "Available" : "Full"}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row items-center gap-1 mb-5">
            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm">
              Departing from {tour.departureCity}
            </Text>
          </View>

          {/* Stats grid */}
          <View className="flex-row flex-wrap gap-2 mb-6">
            <StatPill
              icon="star"
              label={`${tour.hotelStars}-Star Hotel`}
            />
            <StatPill
              icon="location"
              label={`${tour.distanceToHaram}km to Haram`}
            />
            <StatPill
              icon="calendar-outline"
              label={`${tour.duration} Days`}
            />
          </View>

          {/* Description */}
          {tour.description && (
            <View className="mb-6">
              <Text className="text-base font-bold text-gray-900 mb-2">
                About This Tour
              </Text>
              <Text className="text-gray-500 leading-relaxed text-sm">
                {tour.description}
              </Text>
            </View>
          )}

          {/* Price breakdown */}
          <View className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
            <Text className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
              Starting from
            </Text>
            <Text className="text-3xl font-bold text-primary-500">
              ${tour.price.toLocaleString()}
            </Text>
            <Text className="text-primary-400 text-xs mt-0.5">per person</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Book Now Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16, paddingTop: 12 }}
      >
        <TouchableOpacity
          className={`rounded-2xl py-4 items-center ${
            !tour.isAvailable || isBooking
              ? "bg-gray-200"
              : "bg-primary-500"
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
                !tour.isAvailable ? "text-gray-400" : "text-white"
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
