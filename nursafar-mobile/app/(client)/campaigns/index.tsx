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
      className="mx-5 mb-4 p-4 rounded-3xl bg-white shadow-sm border border-gray-100"
      activeOpacity={0.9}
      onPress={() => router.push(`/(client)/campaigns/${item.id}`)}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="w-10 h-10 rounded-2xl bg-primary-50 items-center justify-center mr-3">
          <Text className="text-lg">🤲</Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-sm" numberOfLines={2}>
            {item.title}
          </Text>
          {item.description && (
            <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
        {item.isCompleted && (
          <View className="ml-2 bg-emerald-100 px-2 py-0.5 rounded-full">
            <Text className="text-emerald-600 text-xs font-semibold">
              Funded
            </Text>
          </View>
        )}
      </View>

      <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: item.isCompleted ? "#10B981" : "#D4AF37",
          }}
        />
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm font-bold text-gray-900">
            ${item.currentAmount.toLocaleString()}
          </Text>
          <Text className="text-xs text-gray-400">
            of ${item.targetAmount.toLocaleString()} goal
          </Text>
        </View>
        {!item.isCompleted && (
          <View className="items-end">
            <Text className="text-xs font-semibold text-primary-500">
              {Math.round(progress)}% complete
            </Text>
            <Text className="text-xs text-gray-400">
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-5 pt-2 pb-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Campaigns</Text>
        <Text className="text-gray-400 text-sm mt-0.5">
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
            <View className="items-center py-20">
              <Text className="text-4xl mb-3">🤲</Text>
              <Text className="text-gray-500 font-semibold">
                No campaigns yet
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                Be the first to start one
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
