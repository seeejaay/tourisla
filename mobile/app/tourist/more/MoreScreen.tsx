// mobile/tourist/more/MoreScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const links = [
  { label: "Map", path: "/tourist/map/tourist_map", icon: "map" },
  { label: "List of Tour Guides", path: "/tourist/guideapplicants/tourguideapplicants", icon: "users" },
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
