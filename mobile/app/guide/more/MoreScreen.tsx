// mobile/guide/more/MoreScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const links = [
  // { label: "Announcements", path: "/guide/announcements/guide_announcements", icon: "bullhorn" },
  { label: "Culture", path: "/guide/culture/guide_culture", icon: "landmark" },
  { label: "Tourist Spots", path: "/guide/tourist_spots/guide_tourist_spots", icon: "map-marker" },
  { label: "Map", path: "/guide/map/guide_map", icon: "map" },
  // { label: "Incident-Report", path: "/tourist/profile/about/incident-report", icon: "flag" },
];

export default function MoreScreen({ headerHeight }: { headerHeight?: number }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: headerHeight || 0, paddingBottom: 32 }}
    >
      {links.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => router.push(item.path)}
        >
          <FontAwesome5 name={item.icon} size={20} color="#0f172a" style={styles.icon} />
          <Text style={styles.label}>{item.label}</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#94a3b8" style={styles.chevron} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#e1edf2",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    width: 24,
    textAlign: "center",
    marginRight: 16,
    color: "#075778",
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#075778",
    fontWeight: "700",
  },
  chevron: {
    marginLeft: 8,
  },
});
