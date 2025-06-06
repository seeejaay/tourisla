import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width } = Dimensions.get('window');

interface Announcement {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date_posted: string;
  image_url?: string;
}

export default function AdminAnnouncementViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { viewAnnouncement, loading, error } = useAnnouncementManager();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (id) {
      loadAnnouncement(id);
    }
  }, [id]);

  const loadAnnouncement = async (announcementId: string) => {
    try {
      const data = await viewAnnouncement(announcementId);
      if (data) {
        setAnnouncement(data as Announcement);
      } else {
        setAnnouncement(null);
      }
    } catch (error) {
      console.error("Failed to load announcement:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007dab" />
          <Text style={styles.loadingText}>Loading announcement details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !announcement) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#dc3545" />
          <Text style={styles.errorText}>
            {error || "Announcement not found"}
          </Text>
          <Pressable
            style={styles.backToListButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToListButtonText}>Back to List</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Format the category by replacing underscores with spaces and capitalizing each word
  const formattedCategory = announcement.category
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Get a color based on the category
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      EVENTS: "#4f46e5",
      FIESTA: "#f59e0b",
      CULTURAL_TOURISM: "#10b981",
      ENVIRONMENTAL_COASTAL: "#059669",
      HOLIDAY_SEASONAL: "#f97316",
      GOVERNMENT_PUBLIC_SERVICE: "#6366f1",
      STORM_SURGE: "#dc2626",
      TSUNAMI: "#b91c1c",
      GALE_WARNING: "#ef4444",
      MONSOON_LOW_PRESSURE: "#7c3aed",
      RED_TIDE: "#c026d3",
      JELLYFISH_BLOOM: "#8b5cf6",
      FISH_KILL: "#ec4899",
      PROTECTED_WILDLIFE: "#14b8a6",
      OIL_SPILL: "#4b5563",
      COASTAL_EROSION: "#78716c",
      CORAL_BLEACHING: "#f43f5e",
      HEAT_WAVE: "#f97316",
      FLOOD_LANDSLIDE: "#0ea5e9",
      DENGUE_WATERBORNE: "#84cc16",
      POWER_INTERRUPTION: "#64748b",
    };
    
    return colors[category] || "#6b7280";
  };

  const categoryColor = getCategoryColor(announcement.category);
  const formattedDate = new Date(announcement.date_posted).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.header}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Announcement Details</Text>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{formattedCategory}</Text>
        </View>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{announcement.title}</Text>
          <View style={styles.dateContainer}>
            <MaterialCommunityIcons name="calendar" size={16} color="#6b7280" />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          {announcement.image_url && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: announcement.image_url }} 
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
          
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>{announcement.description}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Location</Text>
            <View style={styles.locationContainer}>
              <MaterialCommunityIcons name="map-marker" size={18} color="#6b7280" />
              <Text style={styles.locationText}>{announcement.location}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 60 + STATUS_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 34,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  backToListButton: {
    backgroundColor: "#0f172a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToListButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
