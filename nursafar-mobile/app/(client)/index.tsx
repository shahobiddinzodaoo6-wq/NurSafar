import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGetToursQuery } from "../../src/api/toursApi";
import { useGetCampaignsQuery } from "../../src/api/crowdfundApi";
import { useAppSelector } from "../../src/hooks/useAppSelector";
import type { Tour, CrowdfundCampaign } from "../../src/types";

function TourCard({ tour }: { tour: Tour }) {
  return (
    <TouchableOpacity
      className="mr-4 w-56 rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 dark:border-gray-800"
      activeOpacity={0.9}
      onPress={() => router.push(`/(client)/tours/${tour.id}`)}
    >
      <View className="h-32 bg-primary-50 dark:bg-gray-800 items-center justify-center relative">
        {tour.imageUrl ? (
          <Image source={{ uri: tour.imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="items-center justify-center p-6">
            <Ionicons name="home" size={40} color="#2B6CB0" />
          </View>
        )}
        <View className="absolute top-3 right-3 bg-black/40 px-2.5 py-1 rounded-full flex-row items-center gap-1">
          <Ionicons name="star" size={12} color="#FBBF24" />
          <Text className="text-[10px] font-bold text-white">{tour.hotelStars}★</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="font-bold text-gray-900 dark:text-white text-sm" numberOfLines={1}>
          {tour.title}
        </Text>
        <View className="flex-row items-center gap-1 mt-1">
          <Ionicons name="location-outline" size={12} color="#9CA3AF" />
          <Text className="text-gray-400 dark:text-gray-500 text-xs" numberOfLines={1}>
            {tour.departureCity}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
          <View>
            <Text className="text-[9px] text-gray-400 dark:text-gray-500 uppercase font-bold">Price</Text>
            <Text className="text-primary-500 dark:text-primary-400 font-extrabold text-sm">
              ${tour.price.toLocaleString()}
            </Text>
          </View>
          <View className="bg-primary-50 dark:bg-primary-950/30 px-3 py-1.5 rounded-xl">
            <Text className="text-primary-600 dark:text-primary-400 font-bold text-[10px]">Details</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CampaignCard({ campaign }: { campaign: CrowdfundCampaign }) {
  const progress = Math.min(
    (campaign.currentAmount / campaign.targetAmount) * 100,
    100
  );

  return (
    <TouchableOpacity
      className="mb-3 p-4 rounded-3xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800"
      activeOpacity={0.9}
      onPress={() => router.push(`/(client)/campaigns/${campaign.id}`)}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-2">
          <Text className="font-bold text-gray-900 dark:text-white text-sm leading-tight" numberOfLines={2}>
            {campaign.title}
          </Text>
          {campaign.description && (
            <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1" numberOfLines={1}>
              {campaign.description}
            </Text>
          )}
        </View>
        {campaign.isCompleted ? (
          <View className="bg-emerald-100 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
            <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Funded</Text>
          </View>
        ) : (
          <View className="bg-gold-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full">
            <Text className="text-gold-500 dark:text-gold-400 text-[10px] font-bold">Active</Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
        <View
          className="h-full bg-gold-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-xs font-bold text-gray-900 dark:text-white">
            ${campaign.currentAmount.toLocaleString()}
          </Text>
          <Text className="text-[10px] text-gray-400 dark:text-gray-500">
            raised of ${campaign.targetAmount.toLocaleString()}
          </Text>
        </View>
        <Text className="text-xs font-extrabold text-primary-500 dark:text-primary-400">
          {Math.round(progress)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ClientHome() {
  const [searchText, setSearchText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const { data: tours, isLoading: toursLoading } = useGetToursQuery();
  const { data: campaigns, isLoading: campaignsLoading } = useGetCampaignsQuery();

  const featuredTours = tours?.filter((t) => t.isAvailable).slice(0, 6) ?? [];
  const activeCampaigns = campaigns?.filter((c) => !c.isCompleted).slice(0, 5) ?? [];

  function handleSearch() {
    if (searchText.trim()) {
      router.push({
        pathname: "/(client)/tours",
        params: { q: searchText.trim() },
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Hero Header */}
        <View className="px-5 pt-4 pb-6 bg-primary-500 dark:bg-gray-900 rounded-b-[36px] shadow-lg shadow-primary-500/10">
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-primary-100 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Assalamu Alaikum</Text>
              <Text className="text-white text-xl font-bold" numberOfLines={1}>
                {user?.name ?? "Pilgrim"}
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/15 dark:bg-gray-800 items-center justify-center border border-white/10"
              onPress={() => router.push("/(client)/profile")}
            >
              <Ionicons name="person" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View
            className={`flex-row items-center bg-white dark:bg-gray-950 rounded-2xl px-4 py-3 gap-2 border transition-all ${
              searchFocused ? "border-white dark:border-primary-500" : "border-transparent"
            }`}
          >
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-gray-900 dark:text-white text-sm"
              placeholder="Search tours by city..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleSearch}>
                <View className="bg-primary-500 dark:bg-primary-600 px-3 py-1.5 rounded-xl">
                  <Text className="text-white text-xs font-bold">Go</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Featured Tours */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-5 mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              Featured Tours
            </Text>
            <TouchableOpacity onPress={() => router.push("/(client)/tours")}>
              <Text className="text-primary-500 dark:text-primary-400 text-sm font-bold">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {toursLoading ? (
            <ActivityIndicator color="#2B6CB0" className="py-8" />
          ) : featuredTours.length === 0 ? (
            <Text className="text-gray-400 dark:text-gray-500 text-center py-8">
              No tours available
            </Text>
          ) : (
            <FlatList
              data={featuredTours}
              keyExtractor={(t) => t.id}
              renderItem={({ item }) => <TourCard tour={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          )}
        </View>

        {/* Active Campaigns */}
        <View className="mt-8 px-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              Help a Pilgrim
            </Text>
            <TouchableOpacity onPress={() => router.push("/(client)/campaigns")}>
              <Text className="text-primary-500 dark:text-primary-400 text-sm font-bold">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {campaignsLoading ? (
            <ActivityIndicator color="#2B6CB0" className="py-8" />
          ) : activeCampaigns.length === 0 ? (
            <Text className="text-gray-400 dark:text-gray-500 text-center py-8">
              No active campaigns
            </Text>
          ) : (
            activeCampaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
