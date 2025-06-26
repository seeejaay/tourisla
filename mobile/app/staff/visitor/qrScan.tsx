import { CameraView } from "expo-camera";
import { Platform, StyleSheet, TouchableOpacity, Text, View, Animated } from "react-native";
import { router, Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import  Overlay from "@/components/Overlay"; 

export default function qrScan() {
  const [ready, setReady] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: boxSize - 4, duration: 1500, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  
  const animatedY = animatedValue.interpolate({ inputRange: [0, boxSize-4], outputRange: [0, boxSize-4] });

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100); 
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ headerShown: false }} />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => {
          console.log('Scanned:', data);
        }}
      />
      <Overlay />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Scan Frame */}
      <View style={styles.scanFrame} />

      {/* Animated Scan-line */}
      <Animated.View
        style={[
            styles.scanLine,
            { transform: [{ translateY: animatedValue }] },
        ]}
        />

      {/* Optional helper text */}
      <Text style={styles.helperText}>Align QR code inside the box</Text>
    </View>
  );
}

const boxSize = 250;
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 20 : 50,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
    zIndex: 2,
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
    borderWidth: 3,
    borderColor: "#0BCD4C",
    borderRadius: 0, 
    backgroundColor: "transparent",
    zIndex: 2,         
  },

  scanLine: {
    position: "absolute",
    top: "35%", 
    left: "50%",
    width: boxSize - 16,
    height: 2,
    backgroundColor: "#0BCD4C",
    opacity: 0.8,
    zIndex: 3,
    marginLeft: -(boxSize - 16) / 2,
  },

  helperText: {
    position: "absolute",
    top: "80%",
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
});
