import React, { useEffect } from "react";
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
  SafeAreaView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Waves, Sun, TreePalm } from "lucide-react-native";
import { useTripAdvisor } from "@/hooks/useTripAdvisor"; // your mobile hook
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


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
    description: "Snorkel, dive, and explore vibrant marine life.",
    icon: <Waves size={18} color="#04807e" />,
    cta: "Crystal Clear Waters",
    bgColor: "#bbe1d0",
    textColor: "#04807e",
  },
  {
    title: "Sun",
    description: "Bask on beautiful beaches under golden sun.",
    icon: <Sun size={18} color="#ae5b7d" />,
    cta: "Breathtaking Sunsets",
    bgColor: "#ffece5",
    textColor: "#ae5b7d",
  },
  {
    title: "Sand",
    description: "Stroll the soft, powdery sands of Bantayan.",
    icon: <TreePalm size={18} color="#ffece5" />,
    cta: "Powdery Shores",
    bgColor: "#ce5f27",
    textColor: "#ffece5",
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
        <Carousel
          width={width}
          height={400}
          loop
          autoPlay
          data={images}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <Image source={item} style={styles.heroImage} />
          )}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Bantayan Island</Text>
          <Text style={styles.heroSubtitle}>
            Discover the hidden gem of the Philippines
          </Text>
            <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/tourist/tourist_spots/tourist_tourist_spots")}
            >
            <Sun color="#1c5461" size={16} />
            <Text style={styles.exploreButtonText}>Explore Tourist Spots</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>
          Sea, Sun, and Sand: The Essence of Bantayan
        </Text>
        <Text style={styles.sectionDescription}>
          Turquoise seas, golden sun, and powdery sands await. Experience
          Bantayan Island’s vibrant culture and warm hospitality.
        </Text>

        {cardData.map((card, index) => (
          <View key={index} style={[styles.card, { backgroundColor: card.bgColor }]}>
            <Text style={[styles.cardTitle, { color: card.textColor }]}>
              {card.icon} {card.title}
            </Text>
            <Text style={styles.cardText}>{card.description}</Text>
          </View>
        ))}
      </View>

      {/* Hotels Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Recommended Hotels</Text>
        {loading ? (
          <Text>Loading hotels...</Text>
        ) : error ? (
          <Text style={{ color: "red" }}>{error.message}</Text>
        ) : (
          <Carousel
            width={width * 0.9}
            height={300}
            loop
            autoPlay
            data={hotels}
            scrollAnimationDuration={1000}
            mode="parallax"
            renderItem={({ item: hotel }) => {
              const hasImage = !hotel.photosError && hotel.photos?.[0]?.images?.large?.url;
              const imageUrl = hasImage
                ? hotel.photos[0].images.large.url
                : "https://via.placeholder.com/400x300";
            
              return (
                <View style={styles.hotelCard}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.hotelImage}
                  />
                  <View style={styles.hotelContent}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <Text style={styles.hotelAddress}>
                      {hotel.address_obj?.address_string}
                    </Text>
                    <TouchableOpacity
                      style={styles.tripadvisorButton}
                      onPress={() =>
                        Linking.openURL(
                          `https://www.tripadvisor.com.ph/Hotel_Review-d${hotel.location_id}`
                        )
                      }
                    >
                      <Text style={styles.tripadvisorButtonText}>
                        View on Tripadvisor
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            
          />
        )}
      </View>

      {/* Gallery (Bento-style) */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Island Gallery</Text>
        <View style={styles.galleryWrapper}>
          <View style={styles.galleryColumn}>
            {images.filter((_, i) => i % 2 === 0).map((src, i) => (
              <Image
                key={`left-${i}`}
                source={src}
                style={[
                  styles.galleryImage,
                  { height: [160, 120, 180][i % 3] }, // Alternate heights
                ]}
              />
            ))}
          </View>
          <View style={styles.galleryColumn}>
            {images.filter((_, i) => i % 2 === 1).map((src, i) => (
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
    <TouchableOpacity
        style={styles.weatherFab}
        onPress={() => router.push('/tourist/weather')}
      >
        <MaterialCommunityIcons
          name="weather-partly-cloudy"
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1" },
  heroContainer: { position: "relative", height: 400 },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroText: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e6f7fa",
    textAlign: "center",
    marginVertical: 8,
  },
  exploreButton: {
    backgroundColor: "#e6f7fa",
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 10,
  },
  exploreButtonText: {
    marginLeft: 6,
    color: "#1c5461",
    fontWeight: "bold",
  },
  section: {
    padding: 16,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1c5461",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  hotelCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  hotelImage: {
    width: "100%",
    height: 180,
  },
  hotelContent: {
    padding: 12,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c5461",
  },
  hotelAddress: {
    fontSize: 13,
    color: "#555",
    marginVertical: 4,
  },
  tripadvisorButton: {
    backgroundColor: "#00aeac",
    padding: 8,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  tripadvisorButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  galleryWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  galleryColumn: {
    width: '48%',
  },
  galleryImage: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  weatherFab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 105,
    left: 10,
    backgroundColor: '#34cfc7',
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 9999,
  },
  
});
