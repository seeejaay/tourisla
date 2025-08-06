import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTourPackageManager } from "@/hooks/useTourPackagesManager";
import { Picker } from "@react-native-picker/picker";
import { toTitleCase } from "@/lib/utils/textFormat";
import Pagination from "@/components/Pagination";
import { router } from "expo-router";

const PAGE_SIZE = 6;

const TouristPackagesScreen = () => {
  const { fetchAllTourPackages } = useTourPackageManager();
  const [tourPackages, setTourPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocation, setFilteredLocation] = useState("All");
  const [filteredOperator, setFilteredOperator] = useState("All");
  const [filteredGuide, setFilteredGuide] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllTourPackages();
        setTourPackages(data || []);
      } catch (error) {
        console.error("Error loading tour packages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date();

  const filteredPackages = useMemo(() => {
    return tourPackages
      .filter(pkg => {
        const endDate = new Date(pkg.date_end);
        const matchesSearch =
          pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation =
          filteredLocation === "All" || pkg.location === filteredLocation;
        const matchesOperator =
          filteredOperator === "All" ||
          pkg.operator_name === filteredOperator;
        const matchesGuide =
          filteredGuide === "All" ||
          pkg.assigned_guides?.some(
            g =>
              `${g.first_name} ${g.last_name}`.trim() === filteredGuide.trim()
          );

        return (
          pkg.is_active &&
          endDate >= today &&
          matchesSearch &&
          matchesLocation &&
          matchesOperator &&
          matchesGuide
        );
      });
  }, [
    tourPackages,
    searchTerm,
    filteredLocation,
    filteredOperator,
    filteredGuide,
  ]);

  const totalPages = Math.ceil(filteredPackages.length / PAGE_SIZE);
  const paginatedPackages = filteredPackages.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const uniqueLocations = useMemo(() => {
    const set = new Set(
      tourPackages?.map(pkg => pkg.location).filter(Boolean)
    );
    return ["All", ...Array.from(set)];
  }, [tourPackages]);

  const uniqueOperators = useMemo(() => {
    const set = new Set(
      tourPackages?.map(pkg => pkg.operator_name).filter(Boolean)
    );
    return ["All", ...Array.from(set)];
  }, [tourPackages]);

  const uniqueGuides = useMemo(() => {
    const guideNames = new Set<string>();
    tourPackages?.forEach(pkg => {
      pkg.assigned_guides?.forEach(g => {
        guideNames.add(`${g.first_name} ${g.last_name}`.trim());
      });
    });
    return ["All", ...Array.from(guideNames)];
  }, [tourPackages]);

  const renderPackage = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardWrapper}>
        <Image
          source={
            item.image_url
              ? { uri: item.image_url }
              : require("@/assets/images/nature/sand.jpg")
          }
          style={styles.image}
        />
        <Text style={styles.operatorOverlay}>
          {toTitleCase(item.operator_name)}
        </Text>
        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{toTitleCase(item.package_name)}</Text>
          <Text style={styles.subtitle}>{item.location}</Text>
          <Text style={styles.text}>Price: ₱ {item.price}</Text>
          <Text style={styles.subtitle}>{item.available_slots} slots available</Text>
          <Text numberOfLines={3} style={styles.description}>
            {toTitleCase(item.description)}
          </Text>
          {item.assigned_guides?.length > 0 && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.guideHeader}>Guides:</Text>
              <View style={styles.guideChipContainer}>
                {item.assigned_guides.map((g, idx) => (
                  <View key={idx} style={styles.guideChip}>
                    <Text style={styles.guideChipText}>
                      {toTitleCase(`${g.first_name} ${g.last_name}`)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() =>
              router.push(`/tourist/packages/packages/${item.id}`)
            }
          >
            <Text style={styles.detailsBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search packages..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Filters */}
      <View style={styles.dropdownContainer}>
  {/* Location Dropdown */}
  <View style={styles.dropdownWrapper}>
    <Text style={styles.filterLabel}>Location</Text>
    <Picker
      selectedValue={filteredLocation}
      onValueChange={(value) => setFilteredLocation(value)}
      style={styles.picker}
    >
      {uniqueLocations.map((loc, i) => (
        <Picker.Item label={loc} value={loc} key={i} />
      ))}
    </Picker>
  </View>

  {/* Operator Dropdown */}
  <View style={styles.dropdownWrapper}>
    <Text style={styles.filterLabel}>Operator</Text>
    <Picker
      selectedValue={filteredOperator}
      onValueChange={(value) => setFilteredOperator(value)}
      style={styles.picker}
    >
      {uniqueOperators.map((op, i) => (
        <Picker.Item label={op} value={op} key={i} />
      ))}
    </Picker>
  </View>

  {/* Guide Dropdown */}
  <View style={styles.dropdownWrapper}>
    <Text style={styles.filterLabel}>Guide</Text>
    <Picker
      selectedValue={filteredGuide}
      onValueChange={(value) => setFilteredGuide(value)}
      style={styles.picker}
    >
      {uniqueGuides.map((g, i) => (
        <Picker.Item label={g} value={g} key={i} />
      ))}
    </Picker>
  </View>
</View>

      {/* Packages */}
      <FlatList
        data={paginatedPackages}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        renderItem={renderPackage}
        contentContainerStyle={{ paddingBottom: 0 }}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f7fafa",
    paddingBottom: 100,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownContainer: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dropdownWrapper: {
    flex: 1,
  },
picker: {
  backgroundColor: "#fff",
  borderColor: "#ccc",
  borderWidth: 1,
  borderRadius: 6,
  paddingHorizontal: 4,
  marginBottom: 8,
},
  filters: {
    marginBottom: 16,
  },
  filterGroup: {
    marginRight: 16,
  },
  filterLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 16,
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: "#1c5461",
  },
  filterText: {
    color: "#333",
  },
  filterTextActive: {
    color: "#fff",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  cardWrapper: {
    position: "relative",
  },
  operatorOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(62, 151, 159, 0.8)",
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1c5461",
  },
  subtitle: {
    fontSize: 12,
    color: "#3e979f",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#444",
  },
  guideChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  guideChip: {
    backgroundColor: "#e0f0f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  guideChipText: {
    fontSize: 13,
    color: "#1c5461",
    fontWeight: "500",
  },
  guideHeader: {
    fontWeight: "bold",
    marginTop: 4,
  },
  guideName: {
    fontSize: 13,
    color: "#1c5461",
  },
  detailsBtn: {
    marginTop: 10,
    backgroundColor: "#3e979f",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  detailsBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TouristPackagesScreen;
