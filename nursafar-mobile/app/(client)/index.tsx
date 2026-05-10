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
      className="mr-4 w-56 rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100"
      activeOpacity={0.9}
      onPress={() => router.push(`/(client)/tours/${tour.id}`)}
    >
      <View className="h-32 bg-primary-100 items-center justify-center">
        {tour.imageUrl ? (
          <Image source={{ uri: tour.imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Text className="text-4xl">🕌</Text>
        )}
      </View>
      <View className="p-3">
        <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>
          {tour.title}
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5">{tour.departureCity}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-primary-500 font-bold text-sm">
            ${tour.price.toLocaleString()}
          </Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={10} color="#D4AF37" />
            <Text className="text-xs text-gray-500">{tour.hotelStars}★</Text>
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
      className="mb-3 p-4 rounded-3xl bg-white shadow-sm border border-gray-100"
      activeOpacity={0.9}
      onPress={() => router.push(`/(client)/campaigns/${campaign.id}`)}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="font-bold text-gray-900 flex-1 mr-2" numberOfLines={2}>
          {campaign.title}
        </Text>
        {campaign.isCompleted && (
          <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
            <Text className="text-emerald-600 text-xs font-semibold">Funded</Text>
          </View>
        )}
      </View>

      <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <View
          className="h-full bg-gold-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>

      <View className="flex-row justify-between">
        <Text className="text-xs text-gray-400">
          ${campaign.currentAmount.toLocaleString()} raised
        </Text>
        <Text className="text-xs font-semibold text-primary-500">
          {Math.round(progress)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ClientHome() {
  const [searchText, setSearchText] = useState("");
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Hero Header */}
        <View className="px-5 pt-4 pb-6 bg-primary-500 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-primary-100 text-sm">Assalamu Alaikum</Text>
              <Text className="text-white text-xl font-bold" numberOfLines={1}>
                {user?.name ?? "Pilgrim"}
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => router.push("/(client)/profile")}
            >
              <Ionicons name="person" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 gap-2">
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-gray-900 text-sm"
              placeholder="Search tours by city..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleSearch}>
                <View className="bg-primary-500 px-3 py-1 rounded-xl">
                  <Text className="text-white text-xs font-semibold">Go</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Featured Tours */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-5 mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Featured Tours
            </Text>
            <TouchableOpacity onPress={() => router.push("/(client)/tours")}>
              <Text className="text-primary-500 text-sm font-semibold">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {toursLoading ? (
            <ActivityIndicator color="#2B6CB0" className="py-8" />
          ) : featuredTours.length === 0 ? (
            <Text className="text-gray-400 text-center py-8">
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
            <Text className="text-lg font-bold text-gray-900">
              Help a Pilgrim
            </Text>
            <TouchableOpacity onPress={() => router.push("/(client)/campaigns")}>
              <Text className="text-primary-500 text-sm font-semibold">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {campaignsLoading ? (
            <ActivityIndicator color="#2B6CB0" className="py-8" />
          ) : activeCampaigns.length === 0 ? (
            <Text className="text-gray-400 text-center py-8">
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
