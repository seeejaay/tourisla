import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useTourPackageManager } from "@/hooks/useTourPackagesManager";
import HeaderWithBack from "@/components/HeaderWithBack";
import { toTitleCase } from "@/lib/utils/textFormat";

interface TourGuide {
  first_name: string;
  last_name: string;
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
  tour_guides?: TourGuide[];
}

const sharedPackageGroupStyle = {
  marginBottom: 8,
  padding: 12,
  borderRadius: 8,
  elevation: 1,
};

export default function TourPackageDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { fetchAllTourPackages } = useTourPackageManager();
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
        const allPackages = await fetchAllTourPackages();
        const pkg = allPackages.find(p => p.id === Number(id));
        setPkg(pkg || null);
        console.log("Fetched package data:", pkg);
      } catch (err: any) {
        console.error("Error fetching tour package:", err);
        setError(err.message || "Error loading tour package");
      } finally {
        setLoading(false);
      }
    };
    loadPackage();
    console.log("Received ID param:", id);
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
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="Package Details"
        backgroundColor="#transparent"
        textColor="#002b11"
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {pkg.package_name && (
            <Text style={styles.packageName}>
              {toTitleCase(pkg.package_name)}
            </Text>
          )}
          {pkg.location && (
            <Text style={styles.packageLocation}>
              {toTitleCase(pkg.location)}
            </Text>
          )}
          {pkg.description && (
            <Text style={styles.packageDescription}>
              {toTitleCase(pkg.description)}
            </Text>
          )}

          <View style={styles.gridContainer}>
            {pkg.inclusions && (
              <View style={styles.packagegroup1}>
                <Text style={styles.gridLabel}>Inclusions:</Text>
                <Text style={styles.textcontent}>
                  {toTitleCase(pkg.inclusions)}
                </Text>
              </View>
            )}

            {pkg.available_slots !== undefined && (
              <View style={styles.packagegroup1}>
                <Text style={styles.gridLabel}>Available Slots:</Text>
                <Text style={styles.textcontent}>{pkg.available_slots}</Text>
              </View>
            )}

            {pkg.exclusions && (
              <View style={styles.packagegroup1}>
                <Text style={styles.gridLabel}>Exclusions:</Text>
                <Text style={styles.textcontent}>
                  {toTitleCase(pkg.exclusions)}
                </Text>
              </View>
            )}

            {pkg.start_time && pkg.end_time && (
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: 8, borderBottomWidth: 1, borderBottomColor: '#ececee', paddingBottom: 8, marginBottom: 8,}}>
                <View style={{ borderRadius: 8, flexDirection: 'column'}}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#7b7b7b',}}>Schedule</Text>
                  <Text style={styles.scheduleTime}>
                    {formatTime(pkg.start_time)} - {formatTime(pkg.end_time)}
                  </Text>
                </View>
                <View style={{ borderRadius: 8, flexDirection: 'column'}}>
                  <View style={{ marginBottom: 8, }}>
                    <Text style={styles.scheduleLabel}>Start</Text>
                    <Text style={styles.scheduleDate}>{formatDate(pkg.date_start)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.scheduleLabel}>End</Text>
                    <Text style={styles.scheduleDate}>{formatDate(pkg.date_end)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {pkg.price !== undefined && (
            <View style={styles.pricecontent}>
              <Text style={styles.packagePrice}>₱ {pkg.price}</Text>
              <Text style={styles.packagePriceText}>per person</Text>

            </View>
          )}
          {pkg.tour_guides && pkg.tour_guides.length > 0 && (
            <View style={[styles.packagegroup1, { marginTop: 12 }]}>
              <Text style={styles.gridLabel}>
                Assigned Tour Guide{pkg.tour_guides.length > 1 ? "s" : ""}:
              </Text>
              <Text style={styles.textcontent}>
                {pkg.tour_guides
                  .map(guide =>
                    toTitleCase(`${guide.first_name} ${guide.last_name}`.trim())
                  )
                  .join(", ")}
              </Text>
            </View>
          )}
          {pkg.available_slots && pkg.available_slots > 0 ? (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => router.push(`/tourist/packages/${pkg.id}/book`)}
            >
              <Text style={styles.bookButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.bookButton, { backgroundColor: "#94a3b8" }]}>
              <Text style={styles.bookButtonText}>Fully Booked</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 24,
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
    color: "#002b11",
    marginBottom: 2,
  },
  packageLocation: {
    fontSize: 12,
    color: "#002b11",
    marginBottom: 16,
  },
  packageDescription: {
    fontSize: 14,
    color: "#002b11",
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
  gridLabel: {
    color: "#7b7b7b",
    fontWeight: "700",
    fontSize: 12,
  },
  packagegroup1: {
    borderColor: '#ececee',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  textcontent: {
    fontSize: 13,
    color: "#49796b",
    fontWeight: "500",
  },
  scheduleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7b7b7b',
    alignSelf: 'flex-end',
  },
  scheduleDate: {
    marginTop: -5,
    fontSize: 15,
    color: '#00ab84',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  scheduleTime: {
    marginTop: -3,
    fontSize: 18,
    color: '#00ab84',
    fontStyle: 'italic',
    fontWeight: '900',
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
    marginTop: -3,
    fontSize: 14,
    color: "#7b7b7b",
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
    backgroundColor: "#61daaf",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 24,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
