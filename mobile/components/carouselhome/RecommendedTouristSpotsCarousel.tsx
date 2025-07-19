// components/RecommendedTouristSpotsCarousel.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { useRouter } from "expo-router";
import { toTitleCase } from "@/lib/utils/textFormat";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

export default function RecommendedTouristSpotsCarousel() {
  const router = useRouter();
  const {
    touristSpots,
    loading,
    error,
    fetchTouristSpots,
  } = useTouristSpotManager();

  useEffect(() => {
    fetchTouristSpots();
  }, [fetchTouristSpots]);

  return (
    <LinearGradient
    colors={["rgba(118, 201, 170, 0.2)", "transparent"]}
    style={styles.gradientSection}
    >
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Recommended Tourist Spots</Text>
      </View>

      {loading ? (
        <Text>Loading spots...</Text>
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : touristSpots.length === 0 ? (
        <Text>No tourist spots found.</Text>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[...touristSpots.slice(0, 6), { id: "viewAll" }]}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => {
            if (item.id === "viewAll") {
              return (
                <TouchableOpacity
                  style={[styles.card, styles.viewAllCard]}
                  activeOpacity={0.85}
                  onPress={() => router.push("/tourist/tourist_spots/tourist_tourist_spots")}
                >
                  <View style={[styles.cardContent, { alignItems: 'center' }]}>
                    <Ionicons style={{ marginVertical: 10, borderRadius: 50, borderWidth: 1, borderColor: '#959fa5', padding: 12 , backgroundColor: '#fff'}} name="chevron-forward" size={20}  />
                    <Text style={styles.viewAllLabel}>See more</Text>
                  </View>
                </TouchableOpacity>
              );
            }
          
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  router.push(`/tourist/tourist_spots/tourist_tourist_spot_view?id=${item.id}`)
                }
              >
                <Image
                  source={{
                    uri: item.images?.[0]?.image_url || "https://via.placeholder.com/300x200",
                  }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {toTitleCase(item.name)}
                  </Text>
                  <Text style={styles.cardLocation}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="location-outline" size={16} color="#4a4a4a" />
                      <Text style={styles.cardLocation}>
                        {toTitleCase(item.municipality)}, {toTitleCase(item.province)}
                      </Text>
                    </View>
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' , marginTop: 4 }}>
                    <MaterialIcons name="category" size={16} color="#4a4a4a" />
                    <Text style={styles.cardSubTitle}>
                      {toTitleCase(item.type)}
                      {item.category ? ` · ${toTitleCase(item.category)}` : ""}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientSection: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1c5461",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00aeac",
  },
  viewAllCard: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.3,
  },
  viewAllLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  card: {
    width: width * 0.6,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardContent: {
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1c5461",
  },
  cardSubTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3e979f",
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: "#334155",
  },
  cardDescription: {
    fontSize: 11,
    color: "#475569",
    marginTop: 6,
  },
});
