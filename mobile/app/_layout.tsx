import { Stack, SplashScreen, router } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import "./global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
    "Poppins-MediumItalic": require("../assets/fonts/Poppins-MediumItalic.ttf"),
    "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
    "Poppins-BoldItalic": require("../assets/fonts/Poppins-BoldItalic.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-BlackItalic": require("../assets/fonts/Poppins-BlackItalic.ttf"),
  });

  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const role = await AsyncStorage.getItem("role");
        if (role) {
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
            case "Tour Operator":
            case "tour_operator":
              router.replace("/operator/operator_dashboard");
              break;
            case "Tourism Staff":
              router.replace("/staff/staff_dashboard");
              break;
            default:
              router.replace("/login");
          }
        }
      } catch (e) {
        console.error("Error restoring session:", e);
        router.replace("/login");
      } finally {
        setCheckingSession(false);
        await SplashScreen.hideAsync();
      }
    };

    if (fontsLoaded) {
      restoreSession();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || checkingSession) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
