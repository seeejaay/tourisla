import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useRouter } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";

export default function TourGuideApplicantsPage() {
  const { fetchAllTourGuideApplicants, loading, error } = useTourGuideManager();
  const [applicants, setApplicants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadApplicants = async () => {
      const data = await fetchAllTourGuideApplicants();
      if (data) setApplicants(data);
    };
    loadApplicants();
  }, [fetchAllTourGuideApplicants]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/admin/tour_guide_applicant_view?id=${item.id}`)}
      style={styles.card}
    >
      <Text style={styles.name}>{item.full_name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Tour Guide Applicants" backgroundColor="#1c5461" textColor="#fff" />

      {loading ? (
        <ActivityIndicator size="large" color="#1c5461" style={styles.centered} />
      ) : error ? (
        <Text style={[styles.centered, styles.error]}>{error}</Text>
      ) : applicants.length === 0 ? (
        <Text style={styles.centered}>No applicants found.</Text>
      ) : (
        <FlatList
          data={applicants}
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
  },
});
