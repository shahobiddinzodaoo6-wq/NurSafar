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
import { useLoginMutation } from "../../src/api/authApi";
import { useAppDispatch } from "../../src/hooks/useAppDispatch";
import { setCredentials } from "../../src/store/authSlice";
import { storage } from "../../src/utils/storage";
import { parseRtkError } from "../../src/utils/errorUtils";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  async function handleLogin() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    const payload = { email: trimmedEmail, password: trimmedPassword };
    console.log("[Login] Sending payload:", { ...payload, password: "***" });

    try {
      const result = await login(payload).unwrap();

      console.log("[Login] Success — user:", result.user.email, "role:", result.user.role);

      await storage.saveToken(result.access_token);
      await storage.saveUser(result.user);

      dispatch(setCredentials({ user: result.user, token: result.access_token }));

      if (result.user.role === "DRIVER") {
        router.replace("/(driver)");
      } else {
        router.replace("/(client)");
      }
    } catch (err: unknown) {
      const msg = parseRtkError(err, "LOGIN");
      Alert.alert("Login Failed", msg);
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
        <View className="flex-1 justify-center px-6 py-10">
          {/* Brand Logo & Name */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-3xl bg-primary-500 items-center justify-center mb-4 shadow-xl shadow-primary-500/30">
              <Text className="text-white text-4xl font-extrabold">ن</Text>
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Nur<Text className="text-gold-400">Safar</Text>
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 mt-1.5 text-sm font-medium">
              Your Umrah Journey Companion
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 mb-8 text-sm">
              Sign in to continue your journey
            </Text>

            {/* Email Address */}
            <View className="mb-5">
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
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
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
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onSubmitEditing={handleLogin}
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

            {/* CTA Button */}
            <TouchableOpacity
              className={`rounded-2xl py-4.5 items-center justify-center shadow-lg ${
                isLoading ? "bg-primary-300" : "bg-primary-500 shadow-primary-500/20"
              }`}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-base tracking-wide">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Create Account Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-400 dark:text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-primary-500 dark:text-primary-400 font-bold text-sm">
                  Create one
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

