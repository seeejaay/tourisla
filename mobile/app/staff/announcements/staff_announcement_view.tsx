import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width, height } = Dimensions.get('window');

// Helper function to convert text to sentence case (capitalize only first letter)
const toSentenceCase = (text: string) => {
  if (!text) return '';
  // Convert to lowercase first
  const lowercase = text.toLowerCase();
  // Capitalize only the first letter
  return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
};

interface Announcement {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date_posted: string;
  image_url?: string;
}

export default function StaffAnnouncementViewScreen() {
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

  const handleShare = async () => {
    if (!announcement) return;
    
    try {
      await Share.share({
        message: `${announcement.title}\n\n${announcement.description}\n\nLocation: ${announcement.location}`,
        title: announcement.title,
      });
    } catch (error) {
      console.error("Error sharing announcement:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Loading announcement...</Text>
        </View>
      </View>
    );
  }

  if (error || !announcement) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <FontAwesome5 name="exclamation-triangle" size={50} color="#fbbf24" />
        <Text style={styles.errorTitle}>Announcement Not Found</Text>
        <Text style={styles.errorText}>
          {error || "We couldn't find the announcement you're looking for."}
        </Text>
        <TouchableOpacity
          style={styles.backToListButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backToListButtonText}>Return to List</Text>
        </TouchableOpacity>
      </View>
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Top Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleShare}
        >
          <FontAwesome5 name="share-alt" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        {announcement.image_url ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: announcement.image_url }} 
              style={styles.fullImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <LinearGradient
              colors={[categoryColor, '#0f172a']}
              style={styles.noImageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="image" size={40} color="#fff" />
              <Text style={styles.noImageText}>No image available</Text>
            </LinearGradient>
          </View>
        )}
        
        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Category and Date */}
          <View style={styles.metaContainer}>
            <View style={[styles.categoryTag, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryTagText}>{formattedCategory}</Text>
            </View>
            
            <View style={styles.dateContainer}>
              <FontAwesome5 name="calendar-alt" solid size={14} color="#94a3b8" />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>
          
          {/* Title */}
          <Text style={styles.title}>{announcement.title}</Text>
          
          {/* Location */}
          <View style={styles.locationContainer}>
            <FontAwesome5 name="map-marker-alt" solid size={14} color={categoryColor} />
            <Text style={styles.locationText}>{toSentenceCase(announcement.location)}</Text>
          </View>
          
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{toSentenceCase(announcement.description)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00365e',
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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.45,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: '100%',
    height: height * 0.3,
  },
  noImageGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
    opacity: 0.8,
  },
  contentContainer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryTagText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 25,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginLeft: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#cbd5e1',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#cbd5e1',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  backToListButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToListButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
