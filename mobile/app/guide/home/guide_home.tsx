import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { currentUser } from "@/lib/api/auth"; 
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useTourPackageManager } from "@/hooks/useTourPackagesManager";



export default function GuideHome() {
  const router = useRouter();
  const { fetchTourGuideApplicants } = useTourGuideManager();
  const { fetchAll } = useTourPackageManager();

  const [userName, setemail] = useState("");
  const [userId, setUserId] = useState(null); 
  const [foundTourGuide, setTourGuideId] = useState<number | null>(null);
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
            const foundTourGuide = applicants?.find(
              (applicant) => Number(applicant.user_id) === Number(userId)
            );
          console.log("Tour Guide Record:", foundTourGuide);
  
          if (!foundTourGuide) {
            setError(`No tour guide record found for user ${userId}.`);
            return;
          }
  
          setTourGuideId(foundTourGuide.id); // Save the tourGuideId
          console.log("Tour Guide ID:", foundTourGuide.id);
        } catch (err) {
          setError("Error fetching tour guide record.");
        }
      };
      fetchTourGuideId();
    }, [userId, fetchTourGuideApplicants]);

  // Fetch assigned tour packages for the tour guide

  useEffect(() => {
    const fetchAssignedPackages = async () => {
      // Wait until we have the tour guide's ID
      if (!foundTourGuide) return;
  
      console.log("Fetching assigned packages for tour guide ID:", foundTourGuide);
  
      try {
        setLoading(true);
        setError(null); // clear previous errors
  
        // Fetch tour guide's assigned packages
        const assignmentsResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}tourguide_assignments?tourguide_id=${foundTourGuide}`, 
          { credentials: "include" }
        );
  
        if (!assignmentsResponse.ok) {
          throw new Error(`Server responded with status ${assignmentsResponse.status}`);
        }
  
        const assignmentsData: { tour_package_id: number }[] = await assignmentsResponse.json();
        console.log("Assignments Data:", assignmentsData);
  
        if (assignmentsData.length === 0) {
          setError(`No assigned packages found for tour guide ID ${foundTourGuide}.`);
          setAssignedPackages([]); // clear list
          return;
        }
  
        // Extract assigned package IDs
        const packageIds = assignmentsData.map((assignment) => assignment.tour_package_id);
        console.log("Assigned Package IDs:", packageIds);
  
        // Fetch all tour packages
        const packages = await fetchAll();
        const assignedPackages = packages.filter((pkg) => packageIds.includes(pkg.id));
        console.log("Assigned Packages:", assignedPackages);
  
        setAssignedPackages(assignedPackages);
      } catch (err) {
        console.error("Error fetching assigned packages:", err);
        setError(`Error fetching assigned packages: ${String(err)}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAssignedPackages();
  }, [foundTourGuide, fetchAll]);
  
  
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

