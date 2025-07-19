import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Linking,
  StyleSheet,
} from "react-native";
import { useTripAdvisor } from "@/hooks/useTripAdvisor";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function RecommendedHotelsCarousel() {
  const { hotels, loading, error } = useTripAdvisor();
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Recommended Hotels</Text>
        <TouchableOpacity onPress={() => router.push("/listings")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading hotels...</Text>
      ) : error ? (
        <Text style={{ color: "red" }}>{error.message}</Text>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={hotels}
          keyExtractor={(item) => item.location_id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item: hotel }) => {
            const hasImage =
              !hotel.photosError && hotel.photos?.[0]?.images?.large?.url;
            const imageUrl = hasImage
              ? hotel.photos[0].images.large.url
              : "https://via.placeholder.com/400x300";

            return (
              <View style={styles.hotelCard}>
                <Image source={{ uri: imageUrl }} style={styles.hotelImage} />
                <View style={styles.hotelContent}>
                  <View>
                    <Text
                      style={styles.hotelName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {hotel.name}
                    </Text>
                    <Text
                      style={styles.hotelAddress}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {hotel.address_obj?.address_string}
                    </Text>
                  </View>
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
  );
}

const styles = StyleSheet.create({
  section: {
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
  hotelCard: {
    width: width * 0.6,
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 12,
    marginRight: 6,
    overflow: "hidden",
  },
  hotelImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  hotelContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  hotelName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1c5461",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  hotelAddress: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1c5461",
    marginTop: 4,
    flexWrap: "wrap",
  },
  tripadvisorButton: {
    backgroundColor: "#00aeac",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  tripadvisorButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
});
