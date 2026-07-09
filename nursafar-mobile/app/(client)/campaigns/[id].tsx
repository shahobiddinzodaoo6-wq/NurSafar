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
  const [amountFocused, setAmountFocused] = useState(false);
  const [msgFocused, setMsgFocused] = useState(false);

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
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <Ionicons name="heart-dislike-outline" size={64} color="#EF4444" className="mb-3" />
        <Text className="text-gray-500 dark:text-gray-400">Campaign not found</Text>
        <TouchableOpacity className="mt-4 bg-primary-500 px-5 py-2.5 rounded-full" onPress={() => router.back()}>
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <SafeAreaView edges={["top"]} className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity
            className="mr-3 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-850 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={18} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 dark:text-white flex-1" numberOfLines={1}>
            Campaign Details
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-5 pt-6">
          {/* Title Card */}
          <View className="bg-white dark:bg-gray-900 p-5 rounded-3xl mb-4 border border-gray-100 dark:border-gray-805 shadow-sm shadow-black/5">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {campaign.title}
            </Text>
            {campaign.description && (
              <Text className="text-gray-500 dark:text-gray-450 text-sm leading-relaxed mt-2">
                {campaign.description}
              </Text>
            )}
          </View>

          {/* Progress Widget */}
          <View className="p-5 bg-white dark:bg-gray-900 rounded-3xl mb-6 border border-gray-100 dark:border-gray-805 shadow-sm shadow-black/5">
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-2xl font-black text-gray-900 dark:text-white">
                  ${campaign.currentAmount.toLocaleString()}
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mt-0.5">raised</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-black text-primary-500 dark:text-primary-400">
                  {Math.round(progress)}%
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mt-0.5">funded</Text>
              </View>
            </View>

            <View className="h-3 bg-gray-100 dark:bg-gray-850 rounded-full overflow-hidden mb-3">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: campaign.isCompleted ? "#10B981" : "#C5A028",
                }}
              />
            </View>

            <Text className="text-gray-400 dark:text-gray-500 text-xs text-right font-medium">
              Goal: ${campaign.targetAmount.toLocaleString()}
            </Text>
          </View>

          {/* Donations list */}
          {campaign.donations && campaign.donations.length > 0 ? (
            <View className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-805 shadow-sm shadow-black/5">
              <Text className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Recent Donations ({campaign.donations.length})
              </Text>
              {campaign.donations.slice(0, 10).map((d) => (
                <View
                  key={d.id}
                  className="flex-row items-center py-3.5 border-b border-gray-50 dark:border-gray-850"
                >
                  <View className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/20 items-center justify-center mr-3">
                    <Ionicons name="heart" size={18} color="#F43F5E" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-850 dark:text-white">
                      Anonymous Donor
                    </Text>
                    {d.message && (
                      <Text
                        className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 italic"
                        numberOfLines={1}
                      >
                        "{d.message}"
                      </Text>
                    )}
                  </View>
                  <Text className="text-primary-500 dark:text-primary-400 font-extrabold text-sm">
                    +${d.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-805 shadow-sm shadow-black/5 items-center justify-center">
              <Ionicons name="heart-outline" size={32} color="#D1D5DB" className="mb-2" />
              <Text className="text-gray-400 dark:text-gray-500 text-xs font-semibold">No donations yet. Be the first!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Donate CTA */}
      {!campaign.isCompleted && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-5 shadow-lg shadow-black/10"
          style={{
            paddingBottom: Platform.OS === "ios" ? 34 : 16,
            paddingTop: 16,
          }}
        >
          <TouchableOpacity
            className="bg-gold-400 rounded-2xl py-4.5 items-center justify-center shadow-lg shadow-gold-500/25"
            onPress={() => setShowDonateModal(true)}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base tracking-wide">
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
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-900 rounded-t-[36px] px-5 pt-6 pb-12 shadow-2xl">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-extrabold text-gray-900 dark:text-white">
                Make a Donation
              </Text>
              <TouchableOpacity onPress={() => setShowDonateModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Donation Amount */}
            <Text className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-widest mb-2.5">
              Amount (USD)
            </Text>
            <View
              className={`flex-row items-center border rounded-2xl px-4 bg-gray-50 dark:bg-gray-950 mb-5 ${
                amountFocused ? "border-primary-500 ring-1 ring-primary-500" : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <Text className="text-gray-400 dark:text-gray-500 text-lg font-bold mr-1.5">$</Text>
              <TextInput
                className="flex-1 py-4 text-gray-900 dark:text-white text-lg font-bold"
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
              />
            </View>

            {/* Donation Message */}
            <Text className="text-xs font-bold text-gray-555 dark:text-gray-400 uppercase tracking-widest mb-2.5">
              Message (optional)
            </Text>
            <View
              className={`flex-row items-center border rounded-2xl px-4 bg-gray-50 dark:bg-gray-950 mb-6 ${
                msgFocused ? "border-primary-500 ring-1 ring-primary-500" : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <TextInput
                className="flex-1 py-4 text-gray-900 dark:text-white text-base"
                placeholder="Leave a kind message..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
                value={message}
                onChangeText={setMessage}
                onFocus={() => setMsgFocused(true)}
                onBlur={() => setMsgFocused(false)}
              />
            </View>

            {/* Modal Confirm Button */}
            <TouchableOpacity
              className={`rounded-2xl py-4.5 items-center justify-center shadow-lg ${
                isDonating ? "bg-primary-300" : "bg-primary-500 shadow-primary-500/25"
              }`}
              onPress={handleDonate}
              disabled={isDonating}
              activeOpacity={0.85}
            >
              {isDonating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base tracking-wide">
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
