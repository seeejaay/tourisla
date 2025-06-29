import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { handleForgotPassword, error, setError, loading } = useAuth();

  const handleSubmit = async () => {
    setError("");
    const resForgotPassword = await handleForgotPassword(email);
    if (resForgotPassword) {
      setMessage("✅ If that email exists, a reset link has been sent.");
    } else {
      setMessage(error);
    }
  };

  return (
    <LinearGradient colors={["#fff", "#fff"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.wrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                textContentType="emailAddress"
                placeholderTextColor="#6b7280"
              />

              {!!message && (
                <Text
                  style={[
                    styles.message,
                    message.startsWith("✅")
                      ? styles.messageSuccess
                      : styles.messageError,
                  ]}
                >
                  {message}
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Button pinned at the bottom */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    justifyContent: "flex-start",
  },
  card: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#005582",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8c8f90",
    marginBottom: 20,
    textAlign: "left",
    fontWeight: "600",
    fontStyle: "italic",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0086ad",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#97ebdb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#005582",
  },
  buttonWrapper: {
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#00c2c7",
    paddingVertical: 14,
    marginBottom: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#66cfd2",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  message: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  messageSuccess: {
    color: "#005582",
  },
  messageError: {
    color: "#e11d48",
  },
});
