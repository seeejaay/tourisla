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

const toSentenceCase = (text: string) => {
  if (!text) return '';
  const lowercase = text.toLowerCase();
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
    if (id) loadAnnouncement(id);
  }, [id]);

  const loadAnnouncement = async (announcementId: string) => {
    try {
      const data = await viewAnnouncement(announcementId);
      setAnnouncement(data || null);
    } catch (error) {
      console.error("Failed to load announcement:", error);
    }
  };

  const handleShare = async () => {
    if (!announcement) return;
  
    const formattedDate = new Date(announcement.date_posted).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    const imageLink = announcement.image_url || "";
  
    const shareMessage = `${imageLink}
  
  📢 ${announcement.title}
  
  🗓️ Date: ${formattedDate}
  📍 Location: ${toSentenceCase(announcement.location)}
  
  📝 ${toSentenceCase(announcement.description)}
  
  — Powered by TourisLa`;
  
    try {
      // prevent duplicate call by disabling double-tap
      await Share.share({
        message: shareMessage,
        title: announcement.title,
      });
    } catch (error: any) {
      console.error("Error sharing announcement:", error.message);
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Loading announcement...</Text>
      </View>
    );
  }

  if (error || !announcement) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <FontAwesome5 name="exclamation-triangle" size={50} color="#fbbf24" />
        <Text style={styles.errorTitle}>Announcement Not Found</Text>
        <Text style={styles.errorText}>{error || "We couldn't find the announcement you're looking for."}</Text>
        <TouchableOpacity style={styles.backToListButton} onPress={() => router.back()}>
          <Text style={styles.backToListButtonText}>Return to List</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formattedCategory = announcement.category.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

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
  const formattedDate = new Date(announcement.date_posted).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <LinearGradient
      colors={['#fff', '#0c5e58']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={18} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleShare}>
          <FontAwesome5 name="share-alt" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {announcement.image_url ? (
          <Image source={{ uri: announcement.image_url }} style={styles.fullImage} resizeMode="cover" />
        ) : (
          <LinearGradient colors={[categoryColor, '#0f172a']} style={styles.noImageGradient}>
            <FontAwesome5 name="image" size={40} color="#fff" />
            <Text style={styles.noImageText}>No image available</Text>
          </LinearGradient>
        )}

        <View style={styles.card}>
          <View style={styles.metaContainer}>
            <View style={[styles.categoryTag, { backgroundColor: categoryColor }]}> 
              <Text style={styles.categoryTagText}>{formattedCategory}</Text>
            </View>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          <Text style={styles.title}>{toSentenceCase(announcement.title)}
          </Text>
          <View style={styles.locationContainer}>
            <FontAwesome5 name="map-marker-alt" size={16} color={categoryColor} />
            <Text style={styles.locationText}>{toSentenceCase(announcement.location)}</Text>
          </View>

          <Text style={styles.descriptionText}>{toSentenceCase(announcement.description)}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: { flex: 1 },
  fullImage: { width: '100%', height: height * 0.3 },
  noImageGradient: {
    width: '100%',
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: { color: '#fff', fontSize: 16, marginTop: 12, opacity: 0.8 },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginTop: -20,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryTagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dateText: { fontSize: 13, color: '#000' },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 4,
    lineHeight: 23,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: { marginLeft: 8, fontSize: 14, color: '#334155' },
  descriptionText: { fontSize: 14, lineHeight: 20, color: '#475569' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  loadingText: { color: '#cbd5e1', marginTop: 16, fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', padding: 24 },
  errorTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 16, marginBottom: 8 },
  errorText: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 24 },
  backToListButton: { backgroundColor: '#3b82f6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  backToListButtonText: { color: '#fff', fontWeight: '600' },
});
