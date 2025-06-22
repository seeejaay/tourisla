import React, { useEffect, useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useTourPackageManager } from "@/hooks/useTourPackagesManager";
import { useAuth } from "@/hooks/useAuth";

export default function GuideHome() {
  const [tourGuideId, setTourGuideId] = useState<number | null>(null);
  const { loggedInUser } = useAuth();
  const { fetchTourPackagesByGuide, loading, error } = useTourPackageManager();
  const [user, setUser] = useState<any>(null); // Adjust type as needed
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function getUserAndGuide() {
      const fetchedUser = await loggedInUser();
      if (!isMounted || !fetchedUser) return;
  
      setUser(fetchedUser); 
      console.log("GuideHome fetched user:", fetchedUser);
      const id = fetchedUser?.data?.user?.user_id;
      console.log('GuideHome user_id:', id); 
      setTourGuideId(id);
    }
    getUserAndGuide();
    return () => { isMounted = false; };
  }, [loggedInUser]);

  const loadPackages = useCallback(async () => {
    if (!tourGuideId) return;
    const data = await fetchTourPackagesByGuide(tourGuideId);
    setPackages(Array.isArray(data?.tourPackages) ? data.tourPackages : []);
  }, [fetchTourPackagesByGuide, tourGuideId]);
  console.log("AssignedTourPackagesPage packages:", packages);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading assigned tour packages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (packages.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No assigned tour packages found</Text>
        <Text style={styles.emptySubtitle}>You currently have no assigned tour packages.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={packages}
      keyExtractor={(pkg) => pkg.id?.toString()}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <>
          <Text style={styles.heading}>Assigned Tour Packages</Text>
          <Text style={styles.subheading}>View all tour packages assigned to you.</Text>
        </>
      }
      renderItem={({ item: pkg }) => (
        <View style={styles.card}>
          <Text style={styles.packageName}>{pkg.package_name}</Text>
          <Text style={styles.description}>{pkg.description}</Text>
          <Text style={styles.info}>Location: {pkg.location}</Text>
          <Text style={styles.info}>Price: ₱{pkg.price}</Text>
          <Text style={styles.info}>Duration: {pkg.duration_days} days</Text>
          <Text style={styles.info}>Slots: {pkg.available_slots}</Text>
          <Text style={styles.date}>{pkg.date_start} – {pkg.date_end}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    backgroundColor: "transparent",
    marginTop: 100,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 8,
    color: "#6b7280",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ef4444",
  },
  errorMessage: {
    color: "#b91c1c",
    marginTop: 4,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  emptySubtitle: {
    color: "#6b7280",
    textAlign: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  packageName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    color: "#374151",
    marginBottom: 8,
  },
  info: {
    color: "#6b7280",
    fontSize: 14,
  },
  date: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 8,
  },
});
