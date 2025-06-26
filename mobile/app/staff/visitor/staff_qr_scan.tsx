import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAuth } from "@/hooks/useAuth"; // assuming you use this for auth
import axios from "axios";

export default function StaffQRScan() {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setLoading(true);

    try {
      // Adjust this URL as per your API setup
      const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/register/manual-check-in`;
      const response = await axios.post(
        API_URL,
        { unique_code: data },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      Alert.alert(
        "Check-In Successful",
        `Checked in visitor group: ${response.data.registration.unique_code}`
      );
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.error ||
        "Error while checking in. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
      setScanned(false); // allow scanning again
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 8 }}>No access to camera</Text>
        <TouchableOpacity onPress={() => setHasPermission(null)} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Text style={styles.title}>Scan Visitor's QR Code</Text>

      {loading && <ActivityIndicator size="large" color="#0ea5e9" style={styles.spinner} />}

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />

      {scanned && !loading && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  scanner: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  scanAgainButton: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  scanAgainText: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  spinner: {
    marginVertical: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  retryButton: {
    padding: 12,
    backgroundColor: "#38bdf8",
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
