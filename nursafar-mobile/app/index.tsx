import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAppSelector } from "../src/hooks/useAppSelector";

export default function Index() {
  const { isAuthenticated, isHydrating, user } = useAppSelector(
    (s) => s.auth
  );

  if (isHydrating) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // DRIVER gets their own dedicated tab group
  if (user?.role === "DRIVER") {
    return <Redirect href="/(driver)" />;
  }

  // CLIENT, PARTNER — all go to client tabs
  return <Redirect href="/(client)" />;
}
