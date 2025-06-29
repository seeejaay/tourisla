import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
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

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("/tourist/regis/visitor_registration/visitor_registration")}
      >
        <Text style={styles.optionText}>Visitor Registration</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("/tourist/regis/island_registration/island_registration")}
      >
        <Text style={styles.optionText}>Island Entry Registration</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#03312e",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#24b4ab",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    width: width * 0.9,
    alignSelf: "center",
    shadowColor: "#24b4ab",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  optionText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
