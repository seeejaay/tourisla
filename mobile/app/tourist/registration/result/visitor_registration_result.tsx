// mobile/tourist/registration/visitor_registration/VisitorRegistrationResultScreen.tsx
import { View, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import { router } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export default function VisitorRegistrationResultScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { getVisitorResultByCode, loading, error } = useVisitorRegistration();
  const [result, setResult] = useState<{
    unique_code: string;
    qr_code_url: string;
  } | null>(null);

  useEffect(() => {
    if (code) {
      getVisitorResultByCode(code).then((res) => {
        if (res && res.registration) {
          setResult({
            unique_code: res.registration.unique_code,
            qr_code_url: res.registration.qr_code_url,
          });
        }
      });
    }
  }, [code]);

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync();
  }, []);
  
  const downloadQRCode = async () => {
    try {
      if (!result?.qr_code_url) return;
  
      // Request permission if not already granted
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "We need permission to save to your gallery.");
        return;
      }
  
      // Download file to a temp path
      const fileUri = `${FileSystem.cacheDirectory}${result.unique_code}.png`;
      await FileSystem.downloadAsync(result.qr_code_url, fileUri);
  
      // Save directly to main Gallery
      await MediaLibrary.saveToLibraryAsync(fileUri);
  
      Alert.alert(
        "Saved",
        "Your QR code was saved to your photo gallery!"
      );
  
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Could not save image.");
    }
  };

  if (!code) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No code provided.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#075778" />
        <Text style={styles.message}>Loading your registration...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Fetching your registration result...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Complete!</Text>
      <Text style={styles.message}>Your unique code:</Text>
      <Text style={styles.code}>{result.unique_code}</Text>
      <Text style={styles.message}>Show this QR code at the entrance:</Text>
      <Image
        source={{ uri: result.qr_code_url }}
        style={styles.qrCode}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.downloadButton} onPress={downloadQRCode}>
      <Text style={styles.downloadButtonText}>Download QR Code</Text>
      </TouchableOpacity>

      {/* Back to Home Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {router.replace("/tourist/tourist_dashboard");
          router.dismiss(2);
        }}
        
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#075778",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 8,
  },
  code: {
    fontSize: 18,
    fontWeight: "700",
    color: "#075778",
    fontFamily: "monospace",
    marginVertical: 8,
  },
  error: {
    color: "red",
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  qrCode: {
    width: 176,
    height: 176,
    marginTop: 12,
  },
  backButton: {
    backgroundColor: "#075778",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    alignSelf: "center",
  },
  downloadButton: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    width: "100%",
    marginTop: 12,
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    alignSelf: "center",
  },
});
