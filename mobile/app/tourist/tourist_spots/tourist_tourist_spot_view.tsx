import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Dimensions,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toTitleCase } from "@/lib/utils/textFormat";
import ExpandableText from "@/components/ExpandableText";
import HeaderWithBack from "@/components/HeaderWithBack";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function TouristSpotView() {
  const { id } = useLocalSearchParams();
  const { touristSpots, fetchTouristSpots } = useTouristSpotManager();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = React.useRef(null);
  const handleScrollEndDrag = (e) => {
    const velocityX = e.nativeEvent.velocity.x;
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex =
      velocityX > 0
        ? Math.min(currentIndex + 1, supportedImages.length - 1)
        : velocityX < 0
        ? Math.max(currentIndex - 1, 0)
        : Math.round(offsetX / SCREEN_WIDTH);
  
    flatListRef.current?.scrollToOffset({
      offset: newIndex * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentIndex(newIndex);
  };
  const getLatLngFromGoogleMapsUrl = (url: string) => {
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return `${match[1]},${match[2]}`;
    }
    const coords = url.match(/\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coords) {
      return `${coords[1]},${coords[2]}`;
    }
    return null;
  };

  useEffect(() => {
    fetchTouristSpots();
  }, []);

  useEffect(() => {
    if (touristSpots.length > 0) {
      const found = touristSpots.find((s) => s.id.toString() === id);
      setSpot(found);
      setLoading(false);
    }
  }, [touristSpots, id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1c5461" />
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={styles.center}>
        <Text>Tourist spot not found.</Text>
      </View>
    );
  }

  const supportedImages = spot.images?.filter((img) => {
    const ext = img.image_url.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "webp"].includes(ext);
  }) || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
    <HeaderWithBack title="Tourist Spot" backgroundColor="#ffece5" textColor="#1c5461" />
    <LinearGradient
      colors={['#f9fafb', '#f9fafb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.section}>
        <Text style={styles.name}>{toTitleCase(spot.name)}</Text>
        <Text style={styles.location}>
          <Ionicons name="location-outline" size={16} color="#1c5461" />
          {" "}
          {toTitleCase(spot.barangay)}, {toTitleCase(spot.municipality)}, {toTitleCase(spot.province)}
        </Text>
      </View>

      {supportedImages && supportedImages.length > 0 && (
        <View style={[styles.carouselWrapper, { width: SCREEN_WIDTH }]}>
          <FlatList
            ref={flatListRef}
            data={supportedImages}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            bounces={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              </View>
            )}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentIndex(index);
            }}
          />
          <Text style={styles.paginationText}>
            {currentIndex + 1} / {supportedImages.length}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
          {spot.type && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{toTitleCase(spot.type)}</Text>
            </View>
          )}
          {spot.category && (
            <Text style={[styles.label, {alignSelf:"flex-start", marginBottom: 10, color: "#2f9576", fontWeight: "700"}]}>Category: <Text style={styles.value}>{toTitleCase(spot.category)}</Text></Text>
          )}
        </View>
        <View style={{ flexDirection: "row", width: '100%', gap: 6 }}>
        {spot.days_open && spot.days_open !== "null" && (
          <View style={{ flex: 1, backgroundColor: "#cfead9", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 }}>
          <Text style={styles.label}>Days Open: <Text style={styles.value}>{toTitleCase(spot.days_open)}</Text></Text>
          </View>
        )}
        {spot.opening_time && (
          <View style={{ flex: 1, backgroundColor: "#cfead9", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 }}>
            <Text style={styles.label}>Opening Time:</Text> 
            <Text style={styles.value}>{toTitleCase(spot.opening_time)}</Text>
          </View>
        )}
        {spot.closing_time && (
          <View style={{ flex: 1, backgroundColor: "#cfead9", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 }}>
            <Text style={styles.label}>Closing Time:</Text> 
            <Text style={styles.value}>{toTitleCase(spot.closing_time)}</Text>
          </View>
        )}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        {spot.location && (
          <TouchableOpacity
            onPress={() => {
              const coordinates = getLatLngFromGoogleMapsUrl(spot.location);
              const encodedName = encodeURIComponent(spot.name);

              const destination = coordinates
                ? `${coordinates}`
                : `${encodedName}`;

              const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

              Linking.openURL(url);
            }}
          >
            <Text style={styles.link}>Navigate with Google Maps</Text>
          </TouchableOpacity>

        )}

        </View>
      </View>

      {spot.description && (
        <View style={styles.section}>
          {spot.description && (
            <View>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.separator} />
              <ExpandableText
                text={toTitleCase(spot.description)}
                style={styles.description}
              />
            </View>
          )}
        </View>
      )}

      <View style={styles.section}>
        {spot.entrance_fee && spot.entrance_fee !== "0" && (
          <LinearGradient
            colors={['#43aea6', '#43aea6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.feeBox}
          >
            <Text style={styles.feeText}>Entrance Fee: ₱{toTitleCase(spot.entrance_fee)}</Text>
          </LinearGradient>
        )}

        {spot.other_fees && spot.other_fees !== "NONE" && (
          <LinearGradient
            colors={['#90e8db', '#90e8db']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.otherFeeBox}
          >
            <Text style={styles.otherFeeText}>Other Fees: {toTitleCase(spot.other_fees)}</Text>
          </LinearGradient>
        )}
      </View>

      {spot.rules && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules</Text>
          <Text style={styles.rules}>{toTitleCase(spot.rules)}</Text>
        </View>
      )}

      <View style={[styles.section, {paddingVertical: 16}]}>
        <Text style={styles.sectionTitle}>Contact</Text>
        {spot.facebook_page && spot.facebook_page !== "null" && (
          <TouchableOpacity onPress={() => Linking.openURL(spot.facebook_page)}>
            <Text style={styles.link}>Visit Facebook Page</Text>
          </TouchableOpacity>
        )}
        {spot.email && spot.email !== "null" && (
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${spot.email}`)}>
            <Text style={styles.link}>{spot.email}</Text>
          </TouchableOpacity>
        )}
        {spot.contact_number && spot.contact_number !== "null" && (
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${spot.contact_number}`)}>
            <Text style={styles.linkGreen}>Call: {spot.contact_number}</Text>
          </TouchableOpacity>
        )}
      </View>

    </ScrollView>
    </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 16,
    paddingBottom: 90,
  },
  container: {
    backgroundColor: "#f9fafb",
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselWrapper: {
    height: 240,
    marginBottom: 16,
    position: "relative",
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: "100%",
    resizeMode: "cover",
  },
  carouselItem: {
    width: SCREEN_WIDTH,
    height: 240,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  paginationText: {
    position: "absolute",
    bottom: 10,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1c5461",
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1c5461",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#334155",
  },
  typeBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#00aeac",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#8bc4bf",
  },
  typeText: {
    color: "#ececea",
    fontWeight: "700",
    fontSize: 13,
    textTransform: "uppercase",
  },
  label: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "500",
  },
  value: {
    fontWeight: "500",
    color: "#90918c",
  },
  description: {
    fontSize: 14,
    color: "#475569",
  },
  feeBox: {
    padding: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  feeText: {
    color: "#d3f0e3",
    fontSize: 13,
    fontWeight: "700",
  },
  otherFeeBox: {
    padding: 16,
    borderRadius: 6,
  },
  otherFeeText: {
    color: "#92400e",
    fontSize: 13,
    fontWeight: "700",
  },
  rules: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
  link: {
    fontSize: 14,
    color: "#2563eb",
    textDecorationLine: "underline",
    marginVertical: 4,
  },
  linkGreen: {
    fontSize: 14,
    color: "green",
    textDecorationLine: "underline",
    marginVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#90918c", // Or any color you want for the line
    marginVertical: 12, // Optional spacing
    width: "100%", // Or set a custom width like "80%" if needed
  },
});
