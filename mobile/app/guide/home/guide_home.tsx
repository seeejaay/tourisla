import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { currentUser } from "@/lib/api/auth"; 
import { useTourGuideManager } from "@/hooks/useTourGuideManager";


export default function GuideHome() {
  const router = useRouter();
  const { fetchTourGuideApplicants } = useTourGuideManager();

  const [userName, setemail] = useState("");
  const [userId, setUserId] = useState(null); 
  const [tourguide_id, setTourGuideId] = useState<number | null>(null);
  const [tour_package_id, setAssignedPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await currentUser(); // Fetch the current user
        console.log("Current User:", user);
        setemail(user.data.user.email);
        console.log("User Email:", user.data.user.email);
        setUserId(user.data.user.user_id);      // Set user_id
        console.log("User ID:", user.data.user.user_id);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchCurrentUser();
  }, []);

    // Fetch tourGuideId based on user_id
    useEffect(() => {
      const fetchTourGuideId = async () => {
        if (!userId) return;
        try {
          const applicants = await fetchTourGuideApplicants();
          console.log("Tour Guide Applicants:", applicants);
            const tourguide_id = applicants?.find(
              (applicant) => Number(applicant.user_id) === Number(userId)
            );
          console.log("Tour Guide Record:", tourguide_id);
  
          if (!tourguide_id) {
            setError(`No tour guide record found for user ${userId}.`);
            return;
          }
  
          setTourGuideId(tourguide_id.id); // Save the tourGuideId
          console.log("Tour Guide ID:", tourguide_id.id);
        } catch (err) {
          setError("Error fetching tour guide record.");
        }
      };
      fetchTourGuideId();
    }, [userId, fetchTourGuideApplicants]);

  // Fetch assigned tour packages for the tour guide


  const renderPackageItem = ({ item }) => (
    <TouchableOpacity style={styles.packageCard} onPress={() => router.push(`/guide/packages/${item.id}`)}>
      <Text style={styles.packageName}>{item.package_name}</Text>
      <Text style={styles.packageDetails}>Location: {item.location}</Text>
      <Text style={styles.packageDetails}>Price: ₱{item.price}</Text>
      <Text style={styles.packageDetails}>Duration: {item.duration_days} day(s)</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome{userName ? `, ${userName}` : ""}!</Text>
          <Text style={styles.welcomeSubtext}>Discover the beauty of Cebu</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Assigned Tour Packages</Text>
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
    backgroundColor: "#ffffff",
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

