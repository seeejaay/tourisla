import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

export default function GuideHome() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  type Package = {
    id: number;
    package_name: string;
    location: string;
    price: number;
    duration_days: number;
  };

  const [assignedPackages, setAssignedPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchAssignedPackages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch the currently logged-in user
        const userResponse = await axios.get(`${API_URL}/api/v1/user`, {
          withCredentials: true,
        });
        const user = userResponse.data.data.user; // ✅ correctly access user
        const userId = user.user_id;              // ✅ use user_id
        setUserName(user.first_name);             // ✅ first_name is already available
        console.log("User ID:", userId);

        // Step 2: Get the tourguide_id from the tourguide_applicants table
        const guideResponse = await axios.get(
          `${API_URL}/api/v1/guideApplicants?user_id=${userId}`,
          { withCredentials: true }
        );
        const guide = guideResponse.data;
        const tourguideId = guide.id;
        console.log("Tour Guide ID:", tourguideId);

        // Step 3: Get the assigned tour_package_id from the tourguide_assignments table
        const assignmentsResponse = await axios.get(
          `${API_URL}/api/v1/tourguide_assignments?tourguide_id=${tourguideId}`,
          { withCredentials: true }
        );
        const assignments = assignmentsResponse.data;
        type Assignment = { tour_package_id: number }; // Define the type for assignments
        const packageIds = assignments.map((assignment: Assignment) => assignment.tour_package_id);
        console.log("Assigned Package IDs:", packageIds);

        // Step 4: Fetch the tour package details from the tour_packages table
        const packagePromises = packageIds.map((packageId: number) =>
          axios.get(`${API_URL}/api/v1/tour_packages/${packageId}`, {
            withCredentials: true,
          })
        );
        const packageResponses = await Promise.all(packagePromises);
        const packages = packageResponses.map((response) => response.data);
        console.log("Assigned Packages:", packages);

        setAssignedPackages(packages);
      } catch (err) {
        console.error("Error fetching assigned packages:", err);
        setError("Failed to load your assigned tour packages.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedPackages();
  }, []);

  const renderPackageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.packageCard}
      onPress={() => router.push(`/guide/packages/${item.id}`)}
    >
      <Text style={styles.packageName}>{item.package_name}</Text>
      <Text style={styles.packageDetails}>Location: {item.location}</Text>
      <Text style={styles.packageDetails}>Price: ₱{item.price}</Text>
      <Text style={styles.packageDetails}>
        Duration: {item.duration_days} day(s)
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome{userName ? `, ${userName}` : ""}!
          </Text>
          <Text style={styles.welcomeSubtext}>
            Discover the beauty of Cebu
          </Text>
        </View>

        {/* Assigned Tour Packages Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Assigned Tour Packages</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0ea5e9" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : assignedPackages.length === 0 ? (
            <Text style={styles.emptyText}>
              You don't have any assigned tour packages yet.
            </Text>
          ) : (
            <FlatList
              data={assignedPackages}
              renderItem={renderPackageItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.packagesList}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
  },
  packagesList: {
    paddingVertical: 8,
  },
  packageCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  packageName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  packageDetails: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
});