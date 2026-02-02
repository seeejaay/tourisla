import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await AsyncStorage.getItem("userData");

        if (!userData) {
          console.log("Index: No user data, redirecting to login");
          router.replace("/login");
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(userData);
        } catch (e) {
          console.error("Index: Corrupted data, redirecting to login");
          await AsyncStorage.clear();
          router.replace("/login");
          return;
        }

        const role = parsed?.role;
        console.log("Index: Found role:", role);

        if (!role) {
          console.log("Index: No role found, redirecting to login");
          router.replace("/login");
          return;
        }

        // Route to appropriate dashboard based on role
        switch (role) {
          case "Admin":
            router.replace("/admin/admin_dashboard");
            break;
          case "Tourist":
            router.replace("/tourist/tourist_dashboard");
            break;
          case "Tour Guide":
          case "tour_guide":
            router.replace("/guide/guide_dashboard");
            break;
          // case "Tour Operator":
          // case "tour_operator":
          //   router.replace("/operator/operator_dashboard");
          //   break;
          case "Tourism Staff":
            router.replace("/staff/staff_dashboard");
            break;
          default:
            console.log("Index: Unknown role, redirecting to login");
            router.replace("/login");
        }
      } catch (e) {
        console.error("Index: Error checking auth:", e);
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    }

    // Small delay to ensure layout is ready
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#3e979f" />
      </View>
    );
  }

  return null;
}
