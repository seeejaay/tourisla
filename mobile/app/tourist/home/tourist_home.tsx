import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import { Waves, Sun, TreePalm, MapPin } from "lucide-react-native";
import { useTripAdvisor } from "@/hooks/useTripAdvisor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import RecommendedHotelsCarousel from "@/components/carouselhome/RecommendedHotelsCarousel";
import RecommendedTouristSpotsCarousel from "@/components/carouselhome/RecommendedTouristSpotsCarousel";

const { width } = Dimensions.get("window");

const images = [
  require("@/assets/images/hero-carousel/1.jpg"),
  require("@/assets/images/hero-carousel/2.jpg"),
  require("@/assets/images/hero-carousel/3.jpg"),
  require("@/assets/images/hero-carousel/5.jpg"),
  require("@/assets/images/hero-carousel/11.webp"),
  require("@/assets/images/hero-carousel/13.jpg"),
];

const cardData = [
  {
    title: "Sea",
    description: "Experience the thrill of snorkeling, diving, and exploring the vibrant marine life of Bantayan's waters.",
    icon: <Waves size={18} color="#46b1b8" />,
    cta: "Crystal Clear Waters",
    bgColor: "#bbe1d0",
    textColor: "#04807e",
    image: require("@/assets/images/nature/sea.jpg"),
  },
  {
    title: "Sun",
    description: "Bask in the golden sun on Bantayan's beautiful beaches, where relaxation meets adventure.",
    icon: <Sun size={18} color="#fdcb8f" />,
    cta: "Breathtaking Sunsets",
    bgColor: "#ffece5",
    textColor: "#ae5b7d",
    image: require("@/assets/images/nature/sun.jpg"),
  },
  {
    title: "Sand",
    description: "Feel the soft, powdery sand between your toes as you stroll along Bantayan's stunning beaches.",
    icon: <TreePalm size={18} color="#d0947a" />,
    cta: "Powdery Shores",
    bgColor: "#fecfa1",
    textColor: "#9d9792",
    image: require("@/assets/images/nature/sand.jpg"),
  },
];


export default function TouristHomeMobile() {
  const { hotels, loading, error } = useTripAdvisor();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Carousel */}
        <View style={styles.heroContainer}>
      <Image
        source={require("@/assets/images/hero-carousel/13.jpg")}
        style={styles.heroImage}
      />
      <LinearGradient
        colors={["transparent", "rgba(241, 241, 241, 0.7)", "#f8fafc"]}
        locations={[0, 0.6, 1]}
        style={styles.heroGradient}
      />
      <View style={styles.heroText}>
        <Text style={styles.heroTitle}>Bantayan Island</Text>
        <Text style={styles.heroSubtitle}>
          Discover the hidden gem of the Philippines
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() =>
            router.push("/tourist/tourist_spots/tourist_tourist_spots")
          }
        >
          <MapPin color="#fff" size={16} />
          <Text style={styles.exploreButtonText}>Explore Bantayan</Text>
        </TouchableOpacity>
      </View>
    </View>

        {/* About Section */}
        <View style={styles.section}>
        <Text style={styles.sectionmainHeading}>
          <Text style={{ color: "#46b1b8", fontWeight: "900", fontSize: 30 }}>Sea</Text>
          {", "}
          <Text style={{ color: "#fdcb8f", fontWeight: "900", fontSize: 30 }}>Sun</Text>
          {" and "}
          <Text style={{ color: "#d0947a", fontWeight: "900", fontSize: 30 }}>Sand</Text>
          {": The Essence of Bantayan"}
          </Text>
          <Text style={styles.sectionDescription}>
            Turquoise seas, golden sun, and powdery sands await. Experience
            Bantayan Island’s vibrant culture and warm hospitality.
          </Text>

          {cardData.map((card, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: card.bgColor }]}
            >
              <Image source={card.image} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: card.textColor }]}>
                  {card.icon} {card.title}
                </Text>
                <Text style={[styles.cardText, { color: card.textColor }]}>{card.description}</Text>
              </View>
            </View>

          ))}
        </View>

        <RecommendedTouristSpotsCarousel />

        {/* Hotels Section */}
        <RecommendedHotelsCarousel />

        {/* Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Island Gallery</Text>
          <View style={styles.galleryWrapper}>
            <View style={styles.galleryColumn}>
              {images
                .filter((_, i) => i % 2 === 0)
                .map((src, i) => (
                  <Image
                    key={`left-${i}`}
                    source={src}
                    style={[
                      styles.galleryImage,
                      { height: [160, 120, 180][i % 3] },
                    ]}
                  />
                ))}
            </View>
            <View style={styles.galleryColumn}>
              {images
                .filter((_, i) => i % 2 === 1)
                .map((src, i) => (
                  <Image
                    key={`right-${i}`}
                    source={src}
                    style={[
                      styles.galleryImage,
                      { height: [120, 180, 160][i % 3] },
                    ]}
                  />
                ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.fabStack}>
        {/* Announcement FAB (on top) */}
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: "#1fc0a6", marginBottom: 12 }]}
          onPress={() =>
            router.push("/tourist/announcements/tourist_announcements")
          }
        >
          <MaterialCommunityIcons name="bullhorn-outline" size={24} color="white" />
        </TouchableOpacity>

        {/* Weather FAB (below) */}
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: "#34cfc7" }]}
          onPress={() => router.push("/tourist/weather")}
        >
          <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  heroContainer: {
    position: "relative",
    height: 400,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 220, // height of the fade blend
  },
  heroText: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1c5461",
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1c5461",
    marginVertical: 0,
  },
  exploreButton: {
    backgroundColor: "#1c8773",
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  exploreButtonText: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    padding: 16,
  },
  sectionmainHeading: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1c5461",
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1c5461",
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1c5461",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    alignItems: "flex-start", // align top
    gap: 12, // spacing between image and content
  },
  cardImage: {
    width: 150, // larger image
    height: 150,
    borderRadius: 12,
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    flexShrink: 1, // allows text to wrap properly
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  cardText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
    flexWrap: "wrap",
  },
  galleryWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  galleryColumn: {
    width: "48%",
  },
  galleryImage: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover",
  },
  fabStack: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 105,
    left: 10,
    alignItems: "flex-start",
    zIndex: 9999,
  },
  fabButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
});


