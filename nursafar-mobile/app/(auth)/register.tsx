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
import { useRegisterMutation } from "../../src/api/authApi";
import { useAppDispatch } from "../../src/hooks/useAppDispatch";
import { setCredentials } from "../../src/store/authSlice";
import { storage } from "../../src/utils/storage";
import { parseRtkError } from "../../src/utils/errorUtils";
import type { Role } from "../../src/types";

type AllowedRole = Exclude<Role, "ADMIN">;

const ROLE_OPTIONS: { label: string; emoji: string; value: AllowedRole }[] = [
  { label: "Pilgrim", emoji: "🕌", value: "CLIENT" },
  { label: "Driver", emoji: "🚐", value: "DRIVER" },
];

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AllowedRole>("CLIENT");

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

    // ── Exact DTO match: RegisterDto { name, email, phone, password, role } ────
    // All field names and types match NestJS RegisterDto exactly.
    // role must be 'CLIENT' | 'PARTNER' | 'DRIVER' (not 'ADMIN').
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
      const msg = parseRtkError(err, "REGISTER");
      Alert.alert("Registration Failed", msg);
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
        <View className="flex-1 px-6 py-12">
          {/* Brand */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl bg-primary-500 items-center justify-center mb-3">
              <Text className="text-white text-3xl font-bold">ن</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">NurSafar</Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Create account
          </Text>
          <Text className="text-gray-400 mb-6 text-sm">
            Join thousands of pilgrims on their blessed journey
          </Text>

          {/* Role Selector */}
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            I am a...
          </Text>
          <View className="flex-row gap-3 mb-6">
            {ROLE_OPTIONS.map((opt) => {
              const active = role === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setRole(opt.value)}
                  activeOpacity={0.8}
                  className={`flex-1 py-4 rounded-2xl border-2 items-center ${
                    active
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <Text className="text-2xl mb-1">{opt.emoji}</Text>
                  <Text
                    className={`font-semibold text-sm ${
                      active ? "text-primary-600" : "text-gray-400"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Fields */}
          {[
            {
              label: "Full Name",
              value: name,
              setter: setName,
              placeholder: "Ahmad Al-Rashid",
              keyboard: "default" as const,
              auto: "name" as const,
              capitalize: "words" as const,
            },
            {
              label: "Email Address",
              value: email,
              setter: setEmail,
              placeholder: "your@email.com",
              keyboard: "email-address" as const,
              auto: "email" as const,
              capitalize: "none" as const,
            },
            {
              label: "Phone Number",
              value: phone,
              setter: setPhone,
              placeholder: "+998 90 123 4567",
              keyboard: "phone-pad" as const,
              auto: "tel" as const,
              capitalize: "none" as const,
            },
          ].map((f) => (
            <View className="mb-4" key={f.label}>
              <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {f.label}
              </Text>
              <TextInput
                className="border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 bg-gray-50 text-base"
                placeholder={f.placeholder}
                placeholderTextColor="#9CA3AF"
                keyboardType={f.keyboard}
                autoComplete={f.auto}
                autoCapitalize={f.capitalize}
                autoCorrect={false}
                value={f.value}
                onChangeText={f.setter}
              />
            </View>
          ))}

          <View className="mb-6">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Password
            </Text>
            <TextInput
              className="border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 bg-gray-50 text-base"
              placeholder="Min. 6 characters"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleRegister}
              returnKeyType="done"
            />
          </View>

          {/* Driver notice */}
          {role === "DRIVER" && (
            <View className="mb-5 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex-row items-start gap-2">
              <Text className="text-amber-500 text-base">⚠️</Text>
              <Text className="text-amber-700 text-xs flex-1 leading-relaxed">
                Driver accounts require admin approval before you can access the
                app. You will be notified once approved.
              </Text>
            </View>
          )}

          <TouchableOpacity
            className={`rounded-2xl py-4 items-center shadow-md ${
              isLoading ? "bg-primary-300" : "bg-primary-500"
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

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-400 text-sm">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary-500 font-semibold text-sm">
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
