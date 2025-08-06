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
  email?: string;
  tourguide_id?: number;
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
  assigned_guides?: TourGuide[];
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
      backgroundColor="transparent"
      textColor="#002b11"
    />
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Hero Image Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.overlay} />
        <Text style={styles.heroTitle}>{toTitleCase(pkg.package_name || "")}</Text>
        <Text style={styles.heroSubtitle}>{toTitleCase(pkg.location || "")}</Text>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₱ {Number(pkg.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          <Text style={styles.pricePerPerson}>per person</Text>
        </View>

        <Text style={styles.description}>{pkg.description}</Text>

        {/* Operator Info */}
        {pkg.operator_name && (
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Operator:</Text>
            <Text style={styles.infoValue}>{toTitleCase(pkg.operator_name)}</Text>
          </View>
        )}
        {pkg.operator_email && (
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{toTitleCase(pkg.operator_email)}</Text>
          </View>
        )}

        {/* Inclusions / Exclusions */}
        {pkg.inclusions && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Inclusions:</Text>
            <View style={styles.list}>
              {pkg.inclusions.split(",").map((item, idx) => (
                <Text key={idx} style={styles.listItem}>• {toTitleCase(item.trim())}</Text>
              ))}
            </View>
          </View>
        )}

        {pkg.exclusions && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Exclusions:</Text>
            <View style={styles.list}>
              {pkg.exclusions.split(",").map((item, idx) => (
                <Text key={idx} style={styles.listItem}>• {toTitleCase(item.trim())}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Available Slots */}
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Available Slots:</Text>
          <Text style={styles.infoValue}>{pkg.available_slots}</Text>
        </View>

        {/* Schedule */}
        {(pkg.date_start || pkg.date_end) && (
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Schedule:</Text>
            <Text style={styles.infoValue}>
              {formatDate(pkg.date_start)} {pkg.start_time ? `• ${formatTime(pkg.start_time)}` : ""} {"\n"}
              {formatDate(pkg.date_end)} {pkg.end_time ? `• ${formatTime(pkg.end_time)}` : ""}
            </Text>
          </View>
        )}

        {/* Assigned Tour Guides */}
        {pkg.assigned_guides && pkg.assigned_guides.length > 0 && (
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Assigned Guide{pkg.assigned_guides.length > 1 ? 's' : ''}:</Text>
            <Text style={styles.infoValue}>
              {pkg.assigned_guides.map(guide =>
                `${toTitleCase(guide.first_name.trim())} ${toTitleCase(guide.last_name.trim())} (${guide.email?.toLowerCase()})`
              ).join(", ")}
            </Text>
          </View>
        )}

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookButton, pkg.available_slots === 0 && { backgroundColor: "#94a3b8" }]}
          disabled={pkg.available_slots === 0}
          onPress={() => router.push(`/tourist/packages/${pkg.id}/book`)}
        >
          <Text style={styles.bookButtonText}>
            {pkg.available_slots === 0 ? "Fully Booked" : "Book Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingBottom: 40
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
  heroBanner: {
    height: 200,
    backgroundColor: "#1c5461",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(28, 84, 97, 0.6)",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#d1f7f7",
    marginTop: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  price: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00a63e",
  },
  pricePerPerson: {
    fontSize: 14,
    color: "#6b7280",
  },
  description: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 12,
  },
  infoBlock: {
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: "700",
    color: "#1c5461",
  },
  infoValue: {
    color: "#3e979f",
    fontSize: 14,
    marginTop: 2,
  },
  sectionBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#1c5461",
    marginBottom: 6,
  },
  list: {
    paddingLeft: 8,
  },
  listItem: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 4,
  },
  bookButton: {
    backgroundColor: "#3e979f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
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
});
