import {
  Stack,
  useRouter,
  useRootNavigationState,
  usePathname,
} from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "./global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // ...existing code...
    "Poppins-BlackItalic": require("../assets/fonts/Poppins-BlackItalic.ttf"),
  });

  const router = useRouter();
  const pathname = usePathname();
  const navState = useRootNavigationState(); // navigation readiness
  const [checkingSession, setCheckingSession] = useState(true);
  const ranRef = useRef(false); // guard against multiple runs (Strict Mode, re-nav)

  const routeForRole = (role: string) => {
    switch (role) {
      case "Admin":
        return "/admin/admin_dashboard";
      case "Tourist":
        return "/tourist/tourist_dashboard";
      case "Tour Guide":
      case "tour_guide":
        return "/guide/guide_dashboard";
      case "Tour Operator":
      case "tour_operator":
        return "/operator/operator_dashboard";
      case "Tourism Staff":
        return "/staff/staff_dashboard";
      default:
        return "/login";
    }
  };

  useEffect(() => {
    if (!fontsLoaded || !navState?.key || ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        const role = await AsyncStorage.getItem("role");
        console.log("Restored role from AsyncStorage:", role);
        const target = role ? routeForRole(role) : "/login";

        if (pathname !== target) {
          router.replace(target);
        }
      } catch {
        if (pathname !== "/login") router.replace("/login");
      } finally {
        setCheckingSession(false);
      }
    })();
    // Intentionally do NOT depend on pathname/router to avoid re-runs on navigation
  }, [fontsLoaded, navState?.key]);

  if (!fontsLoaded || checkingSession || !navState?.key) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
