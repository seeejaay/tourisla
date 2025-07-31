import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { toTitleCase } from "@/lib/utils/textFormat";
toTitleCase

export default function DashboardHeader() {
  const insets = useSafeAreaInsets();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const stored = await AsyncStorage.getItem("userData");
        if (!stored) throw new Error("No stored user");
        const data = JSON.parse(stored);
        if (!data.role) throw new Error("Invalid user");
        setCurrentUser(data);
      } catch (err: any) {
        console.warn("Header: user invalid:", err.message);
        await AsyncStorage.clear();
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const formatRole = (role: string) => {
    if (!role) return "User";
    if (role.toLowerCase() === "admin") return "Administrator";
    if (role.toLowerCase() === "tourist") return "Tourist";
    if (role === "tour_guide") return "Tour Guide";
    if (role === "tour_operator") return "Tour Operator";
    return role
      .split("_")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    
    <View style={{ ...styles.headerWrapper }}>
      <LinearGradient
        colors={["#f8fafc", "#f8fafc"]} //"#f4fcfd", "#5fd6c7"
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 4 }}
        style={[styles.headerContainer, { overflow: "hidden" }]}
      >
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => {
            const role = currentUser?.role?.toLowerCase();
            console.log("Current User Role:", role);
            if (role === "tourism staff") {
              router.push("/staff/profile/staff_profile");
            } else {
              router.push("/tourist/profile/tourist_profile");
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            {currentUser?.avatar ? (
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {currentUser?.first_name?.[0] || currentUser?.email?.[0] || "U"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            {loading ? (
              <Text style={styles.userName}>Loading…</Text>
            ) : (
              <>
                <Text style={styles.userRole}>
                  {currentUser?.role ? formatRole(currentUser.role) : "User"}
                </Text>
                <Text style={styles.userName} numberOfLines={1}>
                {currentUser
                    ? toTitleCase(
                        `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim() ||
                        currentUser.email
                    )
                    : "Unknown User"}
                </Text>
              </>
            )}
          </View>
          <Ionicons name="chevron-forward" size={16} color="rgba(132, 139, 150,0.5)" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    zIndex: 100,
    overflow: "visible", // Allow shadow to show outside bounds
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6, // For Android
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 16,
    width: "100%",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: 12,
  },
  avatar: { width: "100%", height: "100%" },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: "#e4f1f4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { color: "#3e979f", fontSize: 18, fontWeight: "600" },
  userInfo: { flex: 1 },
  userName: { color: "#1c5461", fontSize: 18, fontWeight: "900" },
  userRole: { color: "#94a3b8", fontSize: 12, fontWeight: "700" },
  headerShadow: {
    height: 10,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});
