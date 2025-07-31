import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ManualVisitorCheckIn from "../visitor/staff_visitor_checkin";
import IslandEntryCheckInScreen from "../visitor/staff_island_entry_checkin";

export default function StaffCheckInScreen() {
  const [activeTab, setActiveTab] = useState<"manual" | "island">("manual");

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "manual" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("manual")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "manual" && styles.activeTabText,
            ]}
          >
            Manual Check-In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "island" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("island")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "island" && styles.activeTabText,
            ]}
          >
            Island Entry Check-In
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "manual" ? (
          <ManualVisitorCheckIn />
        ) : (
          <IslandEntryCheckInScreen />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: "#E5E7EB",
      borderRadius: 8,
      margin: 16,
      overflow: "hidden",
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: "#1c5461",
    },
    tabText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#6B7280",
    },
    activeTabText: {
      color: "#fff",
    },
    content: {
      flex: 1,
    },
  });
  