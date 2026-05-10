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
import { useLoginMutation } from "../../src/api/authApi";
import { useAppDispatch } from "../../src/hooks/useAppDispatch";
import { setCredentials } from "../../src/store/authSlice";
import { storage } from "../../src/utils/storage";
import { parseRtkError } from "../../src/utils/errorUtils";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  async function handleLogin() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    // ── Exact DTO match: { email: string, password: string } ──────────────────
    // Matches NestJS LoginDto exactly — no extra fields, correct key names.
    const payload = { email: trimmedEmail, password: trimmedPassword };
    console.log("[Login] Sending payload:", { ...payload, password: "***" });

    try {
      const result = await login(payload).unwrap();

      console.log("[Login] Success — user:", result.user.email, "role:", result.user.role);

      // Persist to SecureStore (encrypted, survives app restarts)
      await storage.saveToken(result.access_token);
      await storage.saveUser(result.user);

      // Hydrate Redux so all subsequent RTK-Query calls get the Bearer token
      dispatch(setCredentials({ user: result.user, token: result.access_token }));

      // Route by role
      if (result.user.role === "DRIVER") {
        router.replace("/(driver)");
      } else {
        router.replace("/(client)");
      }
    } catch (err: unknown) {
      // parseRtkError logs the raw error AND returns a readable message
      const msg = parseRtkError(err, "LOGIN");
      Alert.alert("Login Failed", msg);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Brand */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 rounded-3xl bg-primary-500 items-center justify-center mb-4 shadow-lg">
              <Text className="text-white text-4xl font-bold">ن</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 tracking-tight">
              NurSafar
            </Text>
            <Text className="text-gray-400 mt-1 text-sm">
              Your Umrah Journey Companion
            </Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back
          </Text>
          <Text className="text-gray-400 mb-8 text-sm">
            Sign in to continue your journey
          </Text>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Email Address
            </Text>
            <TextInput
              className="border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 bg-gray-50 text-base"
              placeholder="your@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View className="mb-8">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Password
            </Text>
            <TextInput
              className="border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 bg-gray-50 text-base"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            className={`rounded-2xl py-4 items-center shadow-md ${
              isLoading ? "bg-primary-300" : "bg-primary-500"
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

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-primary-500 font-semibold text-sm">
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
