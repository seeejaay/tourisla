import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function TouristRegistrationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tourist Registration</Text>
      <Text style={styles.subtitle}>
        Please choose a registration type
      </Text>

      {/* Visitor Registration Button */}
      <TouchableOpacity
        style={styles.imageButton}
        onPress={() => router.push("/tourist/regis/visitor_registration/visitor_registration")}
      >
        <Image
          source={require("@/assets/images/camp_sawi.webp")} // Replace with actual path
          style={styles.buttonImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.imageButtonText}>Visitor Registration</Text>
        </View>
      </TouchableOpacity>

      {/* Island Entry Registration Button */}
      <TouchableOpacity
        style={styles.imageButton}
        onPress={() => router.push("/tourist/regis/island_registration/island_registration")}
      >
        <Image
          source={require("@/assets/images/bg_hero.webp")} // Replace with actual path
          style={styles.buttonImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.imageButtonText}>Island Entry Registration</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 0,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1c5461",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
  },
  imageButton: {
    width: width * 0.9,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 10,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
