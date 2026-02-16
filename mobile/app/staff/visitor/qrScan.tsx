import { CameraView } from "expo-camera";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Animated,
  Alert,
} from "react-native";
import { router, Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import Overlay from "@/components/Overlay"; // <-- default import now!
import { LinearGradient } from "expo-linear-gradient";

// Use API URL from environment variable
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function QrScan() {
  const [ready, setReady] = useState(false);
  const [isScanning, setIsScanning] = useState(true); // prevent multiple scans
  const isVisitorCode = (code: string) => /^[A-Z]{3}[0-9]{3}$/.test(code);
  const isIslandEntryCode = (code: string) => /^[A-Z0-9]{6}$/.test(code);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 185,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    setTimeout(() => setReady(true), 100);
  }, []);

  const handleScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;
    setIsScanning(false);
    console.log("Scanned data:", data);
    let extracted = data.trim().toUpperCase();
    console.log("Extracted code:", extracted);
    const match = extracted.match(/\/([A-Z0-9]{6})(?:\?.*)?$/);
    const trimmedCode = match ? match[1] : extracted;
    console.log("Trimmed code:", trimmedCode);
    try {
      const payload = { unique_code: trimmedCode };
      console.log("API URL:", API_URL);
      // Handle Island Entry Code: Mark as paid first, then check-in
      if (isIslandEntryCode(trimmedCode)) {
        // Step 1: Mark as paid
        const markPaidRes = await fetch(`${API_URL}island-entry/mark-paid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const markPaidResult = await markPaidRes.json();
        console.log("Mark as paid response:", markPaidResult);

        if (!markPaidRes.ok) {
          Alert.alert(
            "Error",
            markPaidResult.error || "Failed to mark as paid.",
            [{ text: "OK", onPress: () => setIsScanning(true) }],
          );
          return;
        }

        // Step 2: Manual check-in
        const checkInRes = await fetch(
          `${API_URL}island-entry/manual-check-in`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          },
        );

        const checkInResult = await checkInRes.json();
        console.log("Check-in response:", checkInResult);

        if (checkInRes.ok) {
          Alert.alert(
            "Success",
            `Check-in successful for code ${trimmedCode}`,
            [{ text: "OK", onPress: () => router.back() }],
          );
        } else {
          if (
            checkInResult.error?.toLowerCase().includes("already") ||
            checkInResult.message?.toLowerCase().includes("already")
          ) {
            Alert.alert(
              "Already Scanned",
              "This QR code has already been checked in.",
              [{ text: "OK", onPress: () => setIsScanning(true) }],
            );
          } else {
            Alert.alert("Error", checkInResult.error || "Check-in failed.", [
              { text: "OK", onPress: () => setIsScanning(true) },
            ]);
          }
        }
        return;
      }

      // Handle Visitor Code: Direct check-in
      let endpoint = "";
      if (isVisitorCode(trimmedCode)) {
        endpoint = `${API_URL}register/manual-check-in`;
      } else {
        Alert.alert("Invalid Code", "Unrecognized QR code format.");
        setIsScanning(true);
        return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const result = await res.json();
      console.log("API response:", result);
      if (res.ok) {
        Alert.alert("Success", `Check-in successful for code ${trimmedCode}`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        if (
          result.error?.toLowerCase().includes("already") ||
          result.message?.toLowerCase().includes("already")
        ) {
          Alert.alert(
            "Already Scanned",
            "This QR code has already been checked in.",
            [{ text: "OK", onPress: () => setIsScanning(true) }],
          );
        } else {
          Alert.alert("Error", result.error || "Check-in failed.", [
            { text: "OK", onPress: () => setIsScanning(true) },
          ]);
        }
      }
    } catch (e) {
      console.log("Error during API call:", e);
      Alert.alert("Error", "Network or server issue.");
      setIsScanning(true);
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
    height: 60, // taller to make a fade gradient more visible
    zIndex: 3,
    marginLeft: -(boxSize - 16) / 2,
    borderRadius: 8, // rounded edges for a smoother look
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
