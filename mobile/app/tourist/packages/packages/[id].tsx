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

  const formatDate = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string | undefined): string => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

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
      {pkg.package_name && (
        <Text style={styles.packageName}>
          {pkg.package_name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
          {pkg.id}
        </Text>
      )}
      {pkg.location && (
        <Text style={styles.packageLocation}>
          {pkg.location
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </Text>
      )}
      {pkg.description && (
        <Text style={styles.packageDescription}>{pkg.description.charAt(0).toUpperCase() + pkg.description.slice(1).toLowerCase()}</Text>
      )}
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          {pkg.inclusions !== undefined && (
            <View style={styles.packagegroup1}>
              <Text style={styles.gridLabelBlue}>Inclusions:</Text>
                <Text style={styles.textcontent}>
                {pkg.inclusions
                  ?.toLowerCase()
                  .split('. ')
                  .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
                  .join('. ')}
                </Text>
            </View>
          )}
        </View>
        <View style={styles.gridItem}>
          {pkg.available_slots !== undefined && (
            <View style={styles.packagegroup1}>
              <Text style={styles.gridLabelBlue}>Available Slots:</Text>
              <Text style={styles.textcontent}>{pkg.available_slots}</Text>
            </View>
          )}
        </View>

        <View style={styles.gridItem}>
          {pkg.exclusions !== undefined && (
            <View style={styles.packagegroup1}>
              <Text style={styles.gridLabelBlue}>Exclusions:</Text>
                <Text style={styles.textcontent}>
                {pkg.exclusions
                  ?.toLowerCase()
                  .split('. ')
                  .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
                  .join('. ')}
                </Text>
            </View>
          )}
        </View>
        <View style={styles.gridItem}>
          {pkg.start_time && pkg.end_time && (
            <View style={styles.scheduleCard}>
              <Text style={styles.scheduleLabel}>Schedule</Text>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleDate}>
                  {formatDate(pkg.date_start)}
                </Text>
                <Text style={styles.scheduleDate}>→</Text>
                <Text style={styles.scheduleDate}>
                  {formatDate(pkg.date_end)}
                </Text>
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleTime}>
                  {formatTime(pkg.start_time)} - {formatTime(pkg.end_time)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      {pkg.price !== undefined && (
        <View style={styles.pricecontent}>
          <Text style={styles.packagePrice}>₱{pkg.price}</Text>
          <Text style={styles.packagePriceText}>per person</Text>
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
  },
  content: {
    margin: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  packageName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1c5461",
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
  gridContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  gridItem: {
    flex: 1,
  },
  gridLabelBlue: {
    color: "#00ab84",
    fontWeight: "900",
    fontSize: 16,
  },
  packagegroup1: {
    borderColor: '#ececee',
    borderWidth: 2,
    padding: 16,
    borderRadius: 12,
  },
  textcontent: {
    color: "#4c4c4c",
    fontWeight: "500",
  },
  scheduleCard: {
    ...sharedPackageGroupStyle,
    backgroundColor: '#fff2d5',
    borderLeftWidth: 4,
    borderLeftColor: '#61daaf',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  
  scheduleLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#082140',
    marginBottom: 2,
  },
  
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleDate: {
    fontSize: 14,
    color: '#a19d9b',
    fontWeight: '700',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#1c1917',
    fontStyle: 'italic',
  },
  pricecontent: {
    marginTop: 16,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  packagePrice: {
    fontSize: 30,
    fontWeight: "900",
    color: "#00a63e",
  },
  packagePriceText: {
    fontSize: 14,
    color: "#475569",
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
    backgroundColor: "#24b4ab",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 24,
    width: "100%"
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
});
