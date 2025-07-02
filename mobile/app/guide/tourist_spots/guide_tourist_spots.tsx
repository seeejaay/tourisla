import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { toTitleCase } from "@/lib/utils/textFormat";
import HeaderWithBack from "@/components/HeaderWithBack";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import Pagination from "@/components/Pagination";

export default function GuideTouristSpots() {
  const { touristSpots, loading, error, fetchTouristSpots } = useTouristSpotManager();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTouristSpots();
  }, [fetchTouristSpots]);

  const filteredSpots = touristSpots.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(search.toLowerCase()) ||
      (spot.municipality && spot.municipality.toLowerCase().includes(search.toLowerCase())) ||
      (spot.description && spot.description.toLowerCase().includes(search.toLowerCase()));
  
    const matchesCategory =
      !selectedCategory || toTitleCase(spot.type) === selectedCategory;
  
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredSpots.length / itemsPerPage);
  const paginatedSpots = filteredSpots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const renderSpot = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`./guide_tourist_spot_view?id=${item.id}`)}
      activeOpacity={0.85}
      style={{ borderRadius: 12, paddingBottom: 6 }}
    >
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          {item.images?.[0]?.image_url ? (
            <Image
              source={{ uri: item.images[0].image_url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.noImage}>No image available</Text>
          )}
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.spotName}>{toTitleCase(item.name)}</Text>
          <Text style={styles.spotType}>
            {toTitleCase(item.type)}{" "}
            {toTitleCase(item.category) && `· ${toTitleCase(item.category)}`}
          </Text>
          <Text style={styles.spotLocation}>
            {toTitleCase(item.municipality)}, {toTitleCase(item.province)}
          </Text>
          {item.description && (
            <Text numberOfLines={3} style={styles.description}>
              {toTitleCase(item.description)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const categories = Array.from(
    new Set(touristSpots.map((spot) => toTitleCase(spot.type)).filter(Boolean))
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <HeaderWithBack backgroundColor="#287674" textColor="#f9fafb" />
      <FlatList
        ref={listRef}
        data={paginatedSpots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSpot}
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.title}>Tourist Spots</Text>
            <View style={{ paddingHorizontal: 16, flexDirection: "row", gap: 4 }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by name or location"
                />
              </View>
              <FilterDropdown
                options={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </View>
            {loading && <Text style={styles.statusText}>Loading tourist spots...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {!loading && filteredSpots.length === 0 && (
              <Text style={styles.statusText}>No tourist spots found.</Text>
            )}
          </View>
        }
        ListFooterComponent={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        }
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "#f9fafb",
  },
  title: {
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: "800",
    color: "#1c5461",
    marginBottom: 12,
  },
  statusText: {
    textAlign: "center",
    color: "#3e979f",
    marginVertical: 10,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#f8fcfd",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderColor: "#e6f7fa",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  imageWrapper: {
    height: 180,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    color: "#94a3b8",
  },
  cardBody: {
    padding: 12,
  },
  spotName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1c5461",
  },
  spotType: {
    fontSize: 12,
    color: "#3e979f",
    fontWeight: "600",
    marginBottom: 2,
  },
  spotLocation: {
    fontSize: 13,
    color: "#334155",
  },
  description: {
    fontSize: 12,
    color: "#475569",
    marginVertical: 6,
  },
});
