import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetCampaignByIdQuery,
  useDonateMutation,
} from "../../../src/api/crowdfundApi";

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: campaign, isLoading } = useGetCampaignByIdQuery(id!);
  const [donate, { isLoading: isDonating }] = useDonateMutation();

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const progress = campaign
    ? Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)
    : 0;

  async function handleDonate() {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid donation amount.");
      return;
    }
    try {
      await donate({ id: id!, amount: parsed, message: message.trim() || undefined }).unwrap();
      setShowDonateModal(false);
      setAmount("");
      setMessage("");
      Alert.alert("JazakAllah Khair!", "Your donation has been received.");
    } catch (err: any) {
      Alert.alert("Donation Failed", err?.data?.message ?? "Please try again.");
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Campaign not found</Text>
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <Text className="text-primary-500 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]} className="bg-white">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
          <TouchableOpacity
            className="mr-3 w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={18} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 flex-1" numberOfLines={1}>
            Campaign
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-5 pt-5">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {campaign.title}
          </Text>
          {campaign.description && (
            <Text className="text-gray-500 text-sm leading-relaxed mb-6">
              {campaign.description}
            </Text>
          )}

          {/* Progress */}
          <View className="p-4 bg-gray-50 rounded-2xl mb-6">
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  ${campaign.currentAmount.toLocaleString()}
                </Text>
                <Text className="text-gray-400 text-xs">raised</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-gray-900">
                  {Math.round(progress)}%
                </Text>
                <Text className="text-gray-400 text-xs">funded</Text>
              </View>
            </View>

            <View className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: campaign.isCompleted ? "#10B981" : "#D4AF37",
                }}
              />
            </View>

            <Text className="text-gray-400 text-xs text-right">
              Goal: ${campaign.targetAmount.toLocaleString()}
            </Text>
          </View>

          {/* Donations list */}
          {campaign.donations && campaign.donations.length > 0 && (
            <View>
              <Text className="text-base font-bold text-gray-900 mb-3">
                Recent Donors ({campaign.donations.length})
              </Text>
              {campaign.donations.slice(0, 10).map((d) => (
                <View
                  key={d.id}
                  className="flex-row items-center py-3 border-b border-gray-50"
                >
                  <View className="w-9 h-9 rounded-full bg-primary-100 items-center justify-center mr-3">
                    <Text className="text-primary-500 font-bold text-sm">
                      {d.amount > 0 ? "❤️" : ""}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">
                      Anonymous Donor
                    </Text>
                    {d.message && (
                      <Text
                        className="text-gray-400 text-xs mt-0.5"
                        numberOfLines={1}
                      >
                        "{d.message}"
                      </Text>
                    )}
                  </View>
                  <Text className="text-primary-500 font-bold text-sm">
                    ${d.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Donate CTA */}
      {!campaign.isCompleted && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5"
          style={{
            paddingBottom: Platform.OS === "ios" ? 34 : 16,
            paddingTop: 12,
          }}
        >
          <TouchableOpacity
            className="bg-gold-400 rounded-2xl py-4 items-center"
            onPress={() => setShowDonateModal(true)}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">
              🤲 Donate Now
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Donate Modal */}
      <Modal
        visible={showDonateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDonateModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-xl font-bold text-gray-900">
                Make a Donation
              </Text>
              <TouchableOpacity onPress={() => setShowDonateModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Amount (USD)
            </Text>
            <TextInput
              className="border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 text-lg font-bold mb-4 bg-gray-50"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Message (optional)
            </Text>
            <TextInput
              className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 bg-gray-50 mb-6"
              placeholder="Leave a kind message..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity
              className={`rounded-2xl py-4 items-center ${
                isDonating ? "bg-primary-300" : "bg-primary-500"
              }`}
              onPress={handleDonate}
              disabled={isDonating}
              activeOpacity={0.85}
            >
              {isDonating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Confirm Donation
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
