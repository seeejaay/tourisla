import { CameraView } from "expo-camera";
import { Platform, StyleSheet, TouchableOpacity, Text, View, Animated, Alert } from "react-native";
import { router, Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import Overlay from "@/components/Overlay"; // <-- default import now!
import { LinearGradient } from "expo-linear-gradient";

// Replace with your API URL
const API_URL = "https://tourisla-production.up.railway.app/api/v1"; 
fetch(`${API_URL}/manual-check-in`)

export default function QrScan() {
  const [ready, setReady] = useState(false);
  const [isScanning, setIsScanning] = useState(true); // prevent multiple scans

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 185, duration: 1500, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    setTimeout(() => setReady(true), 100);
  }, []);

  const handleScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;
    setIsScanning(false); // prevent repeat

    try {
      // POST to manualCheckInController
      const res = await fetch(`${API_URL}/register/manual-check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // pass session cookies
        body: JSON.stringify({ unique_code: data.trim().toUpperCase() }),
      });
      console.log("Check-in response:", res.status, res.statusText);

      const result = await res.json();
      if (res.ok) {
        Alert.alert(
          "Success",
          `Checked in successfully for registration ${result.registration.id}.`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Check-in failed. Please try again."
        );
        setIsScanning(true); // allow rescanning
      }
    } catch (error) {
      console.error("Error checking in:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setIsScanning(true); // allow rescanning
    }
  };

  if (!ready) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ headerShown: false }} />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleScanned}
      />

      <Overlay />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.overlay} />
      <View style={styles.scanFrame} />

      <Animated.View
        style={[
            styles.scanLine,
            { transform: [{ translateY: animatedValue }] },
        ]}
        >
        <LinearGradient
            colors={[
            "rgba(11,205,76,0.1)",
            "rgba(11,205,76,0.5)",
            "rgba(11,205,76,0.0)",
            "rgba(11,205,76,0)",
            "rgba(11,205,76,0)",
            "rgba(11,205,76,0)",
            "rgba(11,205,76,0)",
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 3 }}
        />
      </Animated.View>


        {/* Four corner brackets */}
        {/* top-left corner */}
        <View
        style={[
            styles.cornerBracket,
            {
            top: "50%",
            left: "50%",
            marginLeft: -boxSize / 2 - 3,
            marginTop: -boxSize / 2 - 3,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            },
        ]}
        />

        {/* top-right corner */}
        <View
        style={[
            styles.cornerBracket,
            {
            top: "50%",
            left: "50%",
            marginLeft: boxSize / 2 - 58,
            marginTop: -boxSize / 2 - 3,
            borderLeftWidth: 0,
            borderBottomWidth: 0,
            },
        ]}
        />

        {/* bottom-left corner */}
        <View
        style={[
            styles.cornerBracket,
            {
            top: "50%",
            left: "50%",
            marginLeft: -boxSize / 2 - 3,
            marginTop: boxSize / 2 - 58,
            borderRightWidth: 0,
            borderTopWidth: 0,
            },
        ]}
        />

        {/* bottom-right corner */}
        <View
        style={[
            styles.cornerBracket,
            {
            top: "50%",
            left: "50%",
            marginLeft: boxSize / 2 - 58,
            marginTop: boxSize / 2 - 58,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            },
        ]}
        />

      <Text style={styles.helperText}>Align QR code inside the box</Text>
    </View>
  );
}

const boxSize = 250;
const styles = StyleSheet.create({
    backButton: {
      position: "absolute",
      top: 50,
      left: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 8,
      zIndex: 3,
    },
    backButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1,
    },
  
    scanFrame: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: boxSize,
      height: boxSize,
      marginLeft: -boxSize / 2,
      marginTop: -boxSize / 2,
      borderWidth: 0,
      borderColor: "#0BCD4C",
      borderRadius: 0,
      backgroundColor: "rgba(0,0,0,0.1)",
      shadowColor: "#0BCD4C",
      shadowOpacity: 0.6,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 0 },
      zIndex: 2,
    },
  
    scanLine: {
        position: "absolute",
        top: "35%",
        left: "50%",
        width: boxSize - 16,
        height: 60,                // taller to make a fade gradient more visible
        zIndex: 3,
        marginLeft: -(boxSize - 16) / 2,
        borderRadius: 8,           // rounded edges for a smoother look
        overflow: "hidden",
    },
  
    helperText: {
      position: "absolute",
      top: "70%",
      width: "80%",
      alignSelf: "center",
      textAlign: "center",
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      backgroundColor: "rgba(255,255,255,0.2)",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      zIndex: 4,
    },
  
    cornerBracket: {
      position: "absolute",
      width: 60,
      height: 60,
      borderWidth: 6,
      borderColor: "#0BCD4C",
      backgroundColor: "transparent",
      zIndex: 2,
    },
});