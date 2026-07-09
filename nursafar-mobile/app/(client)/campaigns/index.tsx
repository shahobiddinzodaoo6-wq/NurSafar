import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGetCampaignsQuery } from "../../../src/api/crowdfundApi";
import type { CrowdfundCampaign } from "../../../src/types";

function CampaignCard({ item }: { item: CrowdfundCampaign }) {
  const progress = Math.min(
    (item.currentAmount / item.targetAmount) * 100,
    100
  );
  const remaining = Math.max(item.targetAmount - item.currentAmount, 0);

  return (
    <TouchableOpacity
      className="mx-5 mb-4 p-5 rounded-3xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800"
      activeOpacity={0.9}
      onPress={() => router.push(`/(client)/campaigns/${item.id}`)}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/20 items-center justify-center mr-3">
          <Ionicons name="heart" size={22} color="#2B6CB0" />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-gray-900 dark:text-white text-base leading-tight" numberOfLines={2}>
            {item.title}
          </Text>
          {item.description && (
            <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1" numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
        {item.isCompleted ? (
          <View className="ml-2 bg-emerald-100 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full">
            <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              Funded
            </Text>
          </View>
        ) : (
          <View className="ml-2 bg-gold-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full">
            <Text className="text-gold-500 dark:text-gold-400 text-[10px] font-bold">
              Active
            </Text>
          </View>
        )}
      </View>

      <View className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: item.isCompleted ? "#10B981" : "#C5A028",
          }}
        />
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-base font-extrabold text-gray-900 dark:text-white">
            ${item.currentAmount.toLocaleString()}
          </Text>
          <Text className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mt-0.5">
            of ${item.targetAmount.toLocaleString()} goal
          </Text>
        </View>
        {!item.isCompleted && (
          <View className="items-end">
            <Text className="text-xs font-bold text-primary-500 dark:text-primary-400">
              {Math.round(progress)}% complete
            </Text>
            <Text className="text-[10px] text-gray-450 dark:text-gray-500 font-semibold mt-0.5">
              ${remaining.toLocaleString()} needed
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function CampaignsScreen() {
  const { data: campaigns, isLoading } = useGetCampaignsQuery();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={["top"]}>
      <View className="px-5 pt-2 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">Campaigns</Text>
        <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Help a fellow pilgrim reach Makkah
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2B6CB0" />
        </View>
      ) : (
        <FlatList
          data={campaigns ?? []}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <CampaignCard item={item} />}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="items-center py-20 px-6">
              <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
                <Ionicons name="heart-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-850 dark:text-white font-bold text-lg">No campaigns yet</Text>
              <Text className="text-gray-450 dark:text-gray-500 text-sm mt-1 text-center">
                Be the first to start a crowdfunding campaign for Umrah.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
