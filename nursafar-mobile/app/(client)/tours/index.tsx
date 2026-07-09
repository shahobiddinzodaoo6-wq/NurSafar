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
          color={i < count ? "#FBBF24" : "#E5E7EB"}
        />
      ))}
    </View>
  );
}

function TourListCard({ tour }: { tour: Tour }) {
  return (
    <TouchableOpacity
      className="mb-4 mx-5 rounded-3xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
      activeOpacity={0.9}
      onPress={() => router.push(`/(client)/tours/${tour.id}`)}
    >
      <View className="h-44 bg-primary-50 dark:bg-gray-800 items-center justify-center relative">
        {tour.imageUrl ? (
          <Image
            source={{ uri: tour.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center justify-center p-8">
            <Ionicons name="business-outline" size={48} color="#2B6CB0" />
          </View>
        )}
        {!tour.isAvailable && (
          <View className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full">
            <Text className="text-white text-[10px] font-bold uppercase">Fully Booked</Text>
          </View>
        )}
      </View>

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <Text
            className="font-bold text-gray-900 dark:text-white text-base flex-1 mr-2 leading-tight"
            numberOfLines={2}
          >
            {tour.title}
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 mb-4">
          <Ionicons name="location-outline" size={13} color="#9CA3AF" />
          <Text className="text-gray-400 dark:text-gray-500 text-xs">{tour.departureCity}</Text>
        </View>

        <View className="flex-row items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-850">
          <View>
            <StarRow count={tour.hotelStars} />
            <Text className="text-gray-400 dark:text-gray-500 text-[10px] font-medium mt-1">
              {tour.distanceToHaram}km to Haram · {tour.duration} days
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-primary-500 dark:text-primary-400 font-extrabold text-lg">
              ${tour.price.toLocaleString()}
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-[10px] font-medium">per person</Text>
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
  const [searchFocused, setSearchFocused] = useState(false);

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
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-2 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
          Umrah Tours
        </Text>
        <View
          className={`flex-row items-center bg-gray-50 dark:bg-gray-950 border rounded-2xl px-4 py-3 gap-2 transition-all ${
            searchFocused ? "border-primary-500 ring-1 ring-primary-500" : "border-gray-200 dark:border-gray-800"
          }`}
        >
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            className="flex-1 text-gray-900 dark:text-white text-sm"
            placeholder="Search by departure city..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={submitSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
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
            <View className="items-center py-20 px-6">
              <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
                <Ionicons name="search-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-800 dark:text-white font-bold text-lg">No tours found</Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1 text-center">
                Try searching for another departure city.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
