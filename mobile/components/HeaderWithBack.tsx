// components/HeaderWithBack.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

interface Props {
  title?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function HeaderWithBack({
  title = "",
  backgroundColor = "#ffffff",
  textColor = "#000000",
}: Props) {
  const router = useRouter();

  return (
    <View style={[styles.navbar, { backgroundColor }]}>      
      <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
        <FontAwesome5 name="arrow-left" size={18} color={textColor} />
      </TouchableOpacity>
      <Text style={[styles.navTitle, { color: textColor }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingTop: Platform.OS === "android" ? STATUS_BAR_HEIGHT : 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
   elevation: 5,
  },
  navButton: {
    padding: 8,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
});
