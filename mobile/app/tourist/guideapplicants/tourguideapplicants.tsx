import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useRouter } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import { toTitleCase } from "@/lib/utils/textFormat";

export default function TourGuideApplicantsPage() {
  const { fetchAllTourGuideApplicants, loading, error } = useTourGuideManager();
  const [applicants, setApplicants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const router = useRouter();

  useEffect(() => {
    const loadApplicants = async () => {
      const data = await fetchAllTourGuideApplicants();
      if (data) setApplicants(data);
    };
    loadApplicants();
  }, [fetchAllTourGuideApplicants]);

  const filteredApplicants = applicants.filter((applicant) => {
    const fullName = `${applicant.first_name} ${applicant.last_name}`.toLowerCase();
    const queryMatch =
      fullName.includes(searchQuery.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch =
      !selectedCategory || applicant.application_status === selectedCategory;

    return queryMatch && statusMatch;
  });

  const uniqueStatuses = Array.from(
    new Set(applicants.map((a) => a.application_status).filter(Boolean))
  );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { backgroundColor: "#ff9800", color: "#fff" };
      case "approved":
        return { backgroundColor: "#4caf50", color: "#fff" };
      case "rejected":
        return { backgroundColor: "#f44336", color: "#fff" };
      default:
        return { backgroundColor: "#9e9e9e", color: "#fff" };
    }
  };
  
  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.application_status);
  
    return (
      <View style={styles.card}>
        <View style={{ position: "relative" }}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {toTitleCase(item.application_status) || "N/A"}
            </Text>
          </View>
  
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={{
                uri: item.profile_picture || "https://via.placeholder.com/50",
              }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View>
              <Text style={styles.name}>
                {`${toTitleCase(item.first_name)} ${toTitleCase(item.last_name)}`}
              </Text>
              <Text style={styles.email}>{toTitleCase(item.email)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <HeaderWithBack
        title="Tour Guide Applicants"
        backgroundColor="transparent"
        textColor="#000"
      />

      <View style={{ paddingHorizontal: 16, flexDirection: "row", gap: 4, paddingTop: 16 }}>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or email"
          />
        </View>
        <FilterDropdown
          options={uniqueStatuses}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1c5461" style={styles.centered} />
      ) : error ? (
        <Text style={[styles.centered, styles.error]}>{error}</Text>
      ) : filteredApplicants.length === 0 ? (
        <Text style={styles.centered}>No applicants found.</Text>
      ) : (
        <FlatList
          data={filteredApplicants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centered: {
    marginTop: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
  },
  card: {
    backgroundColor: "#e0f2f1",
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#004d40",
  },
  email: {
    fontSize: 14,
    color: "#00695c",
  },
  status: {
    fontSize: 12,
    color: "#00796b",
    marginTop: 4,
    fontWeight: "700",
  },
  statusBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    zIndex: 1,
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
