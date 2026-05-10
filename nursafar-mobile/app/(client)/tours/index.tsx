import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetToursQuery,
  useSearchToursQuery,
} from "../../../src/api/toursApi";
import type { Tour } from "../../../src/types";

function StarRow({ count }: { count: number }) {
  return (
    <View className="flex-row">
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name="star"
          size={11}
          color={i < count ? "#D4AF37" : "#E5E7EB"}
        />
      ))}
    </View>
  );
}

function TourListCard({ tour }: { tour: Tour }) {
  return (
    <TouchableOpacity
      className="mb-4 mx-5 rounded-3xl bg-white overflow-hidden shadow-sm border border-gray-100"
      activeOpacity={0.9}
      onPress={() => router.push(`/(client)/tours/${tour.id}`)}
    >
      <View className="h-44 bg-primary-100 items-center justify-center">
        {tour.imageUrl ? (
          <Image
            source={{ uri: tour.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-6xl">🕌</Text>
        )}
      </View>

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-1">
          <Text
            className="font-bold text-gray-900 text-base flex-1 mr-2"
            numberOfLines={2}
          >
            {tour.title}
          </Text>
          {!tour.isAvailable && (
            <View className="bg-red-100 px-2 py-0.5 rounded-full">
              <Text className="text-red-500 text-xs font-semibold">Full</Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons name="location-outline" size={12} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs">{tour.departureCity}</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View>
            <StarRow count={tour.hotelStars} />
            <Text className="text-gray-400 text-xs mt-0.5">
              {tour.distanceToHaram}km to Haram · {tour.duration} days
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-primary-500 font-bold text-lg">
              ${tour.price.toLocaleString()}
            </Text>
            <Text className="text-gray-400 text-xs">per person</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ToursScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [searchText, setSearchText] = useState(params.q ?? "");
  const [activeSearch, setActiveSearch] = useState(params.q ?? "");

  const isSearching = activeSearch.trim().length > 0;

  const { data: allTours, isLoading: allLoading } = useGetToursQuery(
    undefined,
    { skip: isSearching }
  );
  const { data: searchResults, isLoading: searchLoading } = useSearchToursQuery(
    { departureCity: activeSearch },
    { skip: !isSearching }
  );

  const tours = isSearching ? searchResults : allTours;
  const isLoading = isSearching ? searchLoading : allLoading;

  function submitSearch() {
    setActiveSearch(searchText.trim());
  }

  function clearSearch() {
    setSearchText("");
    setActiveSearch("");
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-2 pb-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Umrah Tours
        </Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 gap-2">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            className="flex-1 text-gray-900 text-sm"
            placeholder="Search by departure city..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={submitSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2B6CB0" />
        </View>
      ) : (
        <FlatList
          data={tours ?? []}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => <TourListCard tour={item} />}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-4xl mb-3">🔍</Text>
              <Text className="text-gray-500 font-semibold">No tours found</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Try a different search term
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
