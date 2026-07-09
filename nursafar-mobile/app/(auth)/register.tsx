import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRegisterMutation } from "../../src/api/authApi";
import { useAppDispatch } from "../../src/hooks/useAppDispatch";
import { setCredentials } from "../../src/store/authSlice";
import { storage } from "../../src/utils/storage";
import { parseRtkError } from "../../src/utils/errorUtils";
import type { Role } from "../../src/types";

type AllowedRole = Exclude<Role, "ADMIN">;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AllowedRole>("CLIENT");

  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();

  async function handleRegister() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      password,
      role,
    };
    console.log("[Register] Sending payload:", { ...payload, password: "***" });

    try {
      const result = await register(payload).unwrap();

      console.log("[Register] Success — user:", result.user.email, "role:", result.user.role);

      await storage.saveToken(result.access_token);
      await storage.saveUser(result.user);

      dispatch(setCredentials({ user: result.user, token: result.access_token }));

      if (result.user.role === "DRIVER") {
        router.replace("/(driver)");
      } else {
        router.replace("/(client)");
      }
    } catch (err: unknown) {
      const msg = parseRtkError(err, "REGISTER");
      Alert.alert("Registration Failed", msg);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 py-10 justify-center">
          {/* Brand Logo & Name */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl bg-primary-500 items-center justify-center mb-3 shadow-lg shadow-primary-500/25">
              <Text className="text-white text-3xl font-extrabold">ن</Text>
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Nur<Text className="text-gold-400">Safar</Text>
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Create account
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 mb-6 text-sm">
              Join thousands of pilgrims on their blessed journey
            </Text>

            {/* Role Selector */}
            <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              I am registering as...
            </Text>
            <View className="flex-row gap-3 mb-6">
              {/* Pilgrim Card */}
              <TouchableOpacity
                onPress={() => setRole("CLIENT")}
                activeOpacity={0.8}
                className={`flex-1 py-4 rounded-2xl border-2 items-center transition-all ${
                  role === "CLIENT"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                    : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
                }`}
              >
                <Ionicons
                  name="compass-outline"
                  size={28}
                  color={role === "CLIENT" ? "#2B6CB0" : "#9CA3AF"}
                  className="mb-1"
                />
                <Text
                  className={`font-bold text-sm ${
                    role === "CLIENT" ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  Pilgrim
                </Text>
              </TouchableOpacity>

              {/* Driver Card */}
              <TouchableOpacity
                onPress={() => setRole("DRIVER")}
                activeOpacity={0.8}
                className={`flex-1 py-4 rounded-2xl border-2 items-center transition-all ${
                  role === "DRIVER"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                    : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
                }`}
              >
                <Ionicons
                  name="car-outline"
                  size={28}
                  color={role === "DRIVER" ? "#2B6CB0" : "#9CA3AF"}
                  className="mb-1"
                />
                <Text
                  className={`font-bold text-sm ${
                    role === "DRIVER" ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  Driver
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Full Name
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 bg-gray-50 dark:bg-gray-950 ${
                  nameFocused
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={nameFocused ? "#2B6CB0" : "#9CA3AF"}
                />
                <TextInput
                  className="flex-1 py-4 pl-3 text-gray-900 dark:text-white text-base"
                  placeholder="Ahmad Al-Rashid"
                  placeholderTextColor="#9CA3AF"
                  autoComplete="name"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            {/* Email Address */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 bg-gray-50 dark:bg-gray-950 ${
                  emailFocused
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={emailFocused ? "#2B6CB0" : "#9CA3AF"}
                />
                <TextInput
                  className="flex-1 py-4 pl-3 text-gray-900 dark:text-white text-base"
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Phone Number
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 bg-gray-50 dark:bg-gray-950 ${
                  phoneFocused
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={phoneFocused ? "#2B6CB0" : "#9CA3AF"}
                />
                <TextInput
                  className="flex-1 py-4 pl-3 text-gray-900 dark:text-white text-base"
                  placeholder="+998 90 123 4567"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Password
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 bg-gray-50 dark:bg-gray-950 ${
                  passwordFocused
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={passwordFocused ? "#2B6CB0" : "#9CA3AF"}
                />
                <TextInput
                  className="flex-1 py-4 px-3 text-gray-900 dark:text-white text-base"
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onSubmitEditing={handleRegister}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Driver Approval Notice */}
            {role === "DRIVER" && (
              <View className="mb-5 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex-row items-start gap-2">
                <Ionicons name="warning" size={16} color="#D97706" className="mt-0.5" />
                <Text className="text-amber-800 dark:text-amber-300 text-xs flex-1 leading-relaxed">
                  Driver accounts require admin approval before you can access the
                  app. You will be notified once approved.
                </Text>
              </View>
            )}

            {/* Register CTA */}
            <TouchableOpacity
              className={`rounded-2xl py-4.5 items-center justify-center shadow-lg ${
                isLoading ? "bg-primary-300" : "bg-primary-500 shadow-primary-500/20"
              }`}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-base tracking-wide">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Log In Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-400 dark:text-gray-500 text-sm">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary-500 dark:text-primary-400 font-bold text-sm">
                  Sign in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

