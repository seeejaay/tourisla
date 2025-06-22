import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform, StatusBar, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchTourPackage } from "@/lib/api/tour-packages";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

interface TourPackageDetailsScreenProps {
    headerHeight: number;
}

interface TourPackage {
  id: number;
  package_name?: string;
  location?: string;
  description?: string;
  price?: number;
  duration_days?: string;
  inclusions?: string;
  exclusions?: string;
  available_slots?: number;
  date_start?: string;
  date_end?: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
}

const sharedPackageGroupStyle = {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  };

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width, height } = Dimensions.get('window');

export default function TourPackageDetailsScreen({ headerHeight }: TourPackageDetailsScreenProps) {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const data = await fetchTourPackage(Number(id));
        setPkg(data);
      } catch (err: any) {
        setError(err.message || "Error loading tour package");
      } finally {
        setLoading(false);
      }
    };
    loadPackage();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading tour package...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.goBackText} onPress={() => router.back()}>
          ← Go Back
        </Text>
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>No tour package found.</Text>
        <Text style={styles.goBackText} onPress={() => router.back()}>
          ← Go Back
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        </View>
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.content}>
      {pkg.package_name && <Text style={styles.packageName}>{pkg.package_name}{pkg.id}</Text>}
      {pkg.location && <Text style={styles.packageLocation}>{pkg.location}</Text>}
      {pkg.price !== undefined && (
        <View style={styles.pricecontent}>
          <Text style={styles.packagePrice}>₱{pkg.price}</Text>
          <Text style={styles.packagePriceText}>per person</Text>
        </View>
      )}
      {pkg.description && (
        <Text style={styles.packageDescription}>{pkg.description.charAt(0).toUpperCase() + pkg.description.slice(1).toLowerCase()}</Text>
      )}
      {pkg.inclusions !== undefined && (
        <View style={styles.packagegroup1}>
            <Text style={{ color: "#3747e6", fontWeight: "500", fontSize: 16 }}>Inclusions:</Text>
            <Text style={styles.textcontent}>{pkg.inclusions}</Text>
        </View>
      )} 
      {pkg.exclusions !== undefined && (
        <View style={styles.packagegroup2}>
            <Text style={{ color: "#c50007", fontWeight: "500", fontSize: 16 }}>Exclusions:</Text>
            <Text style={styles.textcontent}>{pkg.exclusions}</Text>
        </View>
      )} 
      {pkg.available_slots !== undefined && (
        <View style={styles.packagegroup3}>
            <Text style={{ color: "#368236", fontWeight: "500", fontSize: 16 }}>Available Slots:</Text>
            <Text style={styles.textcontent}>{pkg.available_slots}</Text>
        </View>
      )}  
      {pkg.start_time && pkg.end_time && (
            <View style={styles.packagegroup4}>
            <Text style={{ color: "#dfa716", fontWeight: "500", fontSize: 16 }}>Schedule:</Text>
            <Text style={styles.textcontent}>{pkg.date_start} - {pkg.date_end}</Text>
            <Text style={styles.textcontent}>{pkg.start_time} - {pkg.end_time}</Text>
            </View>
      )}
        <TouchableOpacity style={styles.bookButton} onPress={() => router.push(`/tourist/packages/${pkg.id}/book`)}>
        <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    backgroundColor: "#fff",
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    borderRadius: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  packageName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 2,
  },
  packageLocation: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 16,
  },
  packageDescription: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 16,
  },
  packagegroup1: {
    ...sharedPackageGroupStyle,
    backgroundColor: '#eff6ff',
  },
  packagegroup2: {
    ...sharedPackageGroupStyle,
    backgroundColor: '#fef2f2',
  },
  packagegroup3: {
    ...sharedPackageGroupStyle,
    backgroundColor: '#f0fdf4',
  },
  packagegroup4: {
    ...sharedPackageGroupStyle,
    backgroundColor: '#fefce8',
  },
  textcontent: {
    color: "#4c4c4c",
    fontWeight: "500",
  },
  packageDuration: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  pricecontent: {
    marginBottom: 16,
    flexDirection: "row",
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00a63e",
  },
  packagePriceText: {
    left: 8,
    fontSize: 14,
    color: "#475569",
    alignSelf: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#64748b",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  goBackText: {
    color: "#0ea5e9",
    fontSize: 16,
    marginTop: 16,
  },
  bookButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 24,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
