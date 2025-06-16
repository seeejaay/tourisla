import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Modal, 
  SafeAreaView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";
import SortButton from "../../../components/SortButton";
import { fetchAnnouncements } from "../../../lib/api/announcement";
import { LinearGradient } from 'expo-linear-gradient';

interface Announcement {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date_posted: string; // Assuming this is a string in ISO format
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

export default function StaffAnnouncementsScreen({ headerHeight }) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useFocusEffect(
      useCallback(() => {
        const loadData = async () => {
          setLoading(true);
          try {
            const data = await fetchAnnouncements();
            setAnnouncements(data);
          } catch (err) {
            console.error("Failed to fetch announcements", err);
            setError("Failed to load announcements.");
          } finally {
            setLoading(false);
          }
        };
    
        loadData();
      }, [])
  );

  const filteredAnnouncements = announcements
  .filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
  .sort((a, b) => {
      if (sortOption === "recent") {
        // "Recent" - newest date at the top (most recently created first)
        return new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime();
      } else if (sortOption === "newest") {
        // "Newest" - oldest date at the top (oldest created first)
        return new Date(a.date_posted).getTime() - new Date(b.date_posted).getTime();
      }
      return 0;
  });

  return (
      <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>

          <ScrollView
          style={[styles.scrollView, { marginTop: headerHeight }]}
          contentContainerStyle={{ paddingBottom: 120 }}
          >

          {/* Filter Tags in Grid Layout */}
          <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              {/* Search and Sort Row */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <View style={[styles.searchContainer, { flex: 1 }]}>
                      <Icon name="search" size={16} color="#6b7280" style={{ marginRight: 8 }} />
                      <TextInput
                          style={styles.searchInput}
                          placeholder="Search announcements..."
                          placeholderTextColor="#9ca3af"
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                      />
                  </View>
                  
                  {/* Sorting Options */}
                  <SortButton sortOption={sortOption || "recent"} setSortOption={setSortOption} />
              </View>
              
              {/* Filter Toggle Button Row */}
              <View style={styles.filterToggleRow}>
                  <Pressable 
                      style={styles.filterToggleButton}
                      onPress={() => setShowFilters(!showFilters)}
                  >
                      <Icon name={showFilters ? "chevron-up" : "chevron-down"} size={16} color="#475569" style={{ marginRight: 4 }} />
                      <Text style={styles.filterToggleText}>
                          {showFilters ? "Hide Filters" : "Show Filters"}
                      </Text>
                      {selectedCategory && (
                          <View style={styles.filterBadge}>
                              <Text style={styles.filterBadgeText}>1</Text>
                          </View>
                      )}
                  </Pressable>
              </View>
              
              {/* Collapsible Filter Section */}
              {showFilters && (
                  <View style={styles.filtersSection}>
                      <View style={styles.filterContainer}>
                          {[
                              'EVENTS',
                              'FIESTA',
                              'CULTURAL_TOURISM',
                              'ENVIRONMENTAL_COASTAL',
                              'HOLIDAY_SEASONAL',
                              'GOVERNMENT_PUBLIC_SERVICE',
                              'STORM_SURGE',
                              'TSUNAMI',
                              'GALE_WARNING',
                              'MONSOON_LOW_PRESSURE',
                              'RED_TIDE',
                              'JELLYFISH_BLOOM',
                              'FISH_KILL',
                              'PROTECTED_WILDLIFE',
                              'OIL_SPILL',
                              'COASTAL_EROSION',
                              'CORAL_BLEACHING',
                              'HEAT_WAVE',
                              'FLOOD_LANDSLIDE',
                              'DENGUE_WATERBORNE',
                              'POWER_INTERRUPTION',
                          ].map((category) => (
                              <Pressable
                                  key={category}
                                  style={[
                                      styles.filterTag,
                                      selectedCategory === category && styles.filterTagSelected
                                  ]}
                                  onPress={() => {
                                      setSelectedCategory((prev) => (prev === category ? null : category));
                                  }}
                              >
                                  <Text style={[
                                      styles.filterTagText,
                                      selectedCategory === category && styles.filterTagTextSelected
                                  ]}>
                                      {category.replace(/_/g, " ")}
                                  </Text>
                                  {selectedCategory === category && (
                                      <Icon name="x" size={12} color="#fff" style={styles.filterTagIcon} />
                                  )}
                              </Pressable>
                          ))}
                      </View>
                      
                      {selectedCategory && (
                          <Pressable 
                              style={styles.clearFiltersButton}
                              onPress={() => setSelectedCategory(null)}
                          >
                              <Text style={styles.clearFiltersText}>Clear Filter</Text>
                          </Pressable>
                      )}
                  </View>
              )}
          </View>

          {/* Announcement Cards */}
          <View style={styles.contentContainer}>
              {loading ? (
              <Text style={styles.message}>Loading...</Text>
              ) : error ? (
              <Text style={styles.error}>{error}</Text>
              ) : filteredAnnouncements.length === 0 ? (
              <Text style={styles.message}>No announcements found.</Text>
              ) : (
              filteredAnnouncements.map((item) => (
                  <Pressable 
                      key={item.id} 
                      style={styles.card}
                      onPress={() => router.push(`/staff/announcements/staff_announcement_view?id=${item.id}`)}
                  >
                      <LinearGradient
                          colors={['#0f172a', '#1e293b']}
                          style={styles.cardGradient}
                      />
                      
                      <View style={styles.cardContent}>
                          <View style={[
                              styles.categoryIndicator, 
                              getCategoryColor(item.category)
                          ]} />
                          
                          {/* Main content section */}
                          <View style={styles.mainContent}>
                              <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                                  {item.title}
                              </Text>
                              <Text style={styles.categoryText}>
                                  {item.category.replace(/_/g, " ")}
                              </Text>
                          </View>
                          
                          {/* Right section with date */}
                          <View style={styles.rightSection}>
                              {/* Date at bottom right */}
                              <Text style={styles.dateText} numberOfLines={1} ellipsizeMode="tail">
                                  {new Date(item.date_posted).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric"
                                  })}
                              </Text>
                          </View>
                      </View>
                  </Pressable>
              ))
              )}
          </View>
          </ScrollView>
      </View>
      </SafeAreaView>
  );
}

// Function to get category color
const getCategoryColor = (category: string) => {
  const colors: Record<string, object> = {
      EVENTS: { backgroundColor: '#4f46e5' },
      FIESTA: { backgroundColor: '#f59e0b' },
      CULTURAL_TOURISM: { backgroundColor: '#10b981' },
      ENVIRONMENTAL_COASTAL: { backgroundColor: '#059669' },
      HOLIDAY_SEASONAL: { backgroundColor: '#f97316' },
      GOVERNMENT_PUBLIC_SERVICE: { backgroundColor: '#6366f1' },
      STORM_SURGE: { backgroundColor: '#dc2626' },
      TSUNAMI: { backgroundColor: '#b91c1c' },
      GALE_WARNING: { backgroundColor: '#ef4444' },
      MONSOON_LOW_PRESSURE: { backgroundColor: '#7c3aed' },
      RED_TIDE: { backgroundColor: '#c026d3' },
      JELLYFISH_BLOOM: { backgroundColor: '#8b5cf6' },
      FISH_KILL: { backgroundColor: '#ec4899' },
      PROTECTED_WILDLIFE: { backgroundColor: '#14b8a6' },
      OIL_SPILL: { backgroundColor: '#4b5563' },
      COASTAL_EROSION: { backgroundColor: '#78716c' },
      CORAL_BLEACHING: { backgroundColor: '#f43f5e' },
      HEAT_WAVE: { backgroundColor: '#f97316' },
      FLOOD_LANDSLIDE: { backgroundColor: '#0ea5e9' },
      DENGUE_WATERBORNE: { backgroundColor: '#84cc16' },
      POWER_INTERRUPTION: { backgroundColor: '#64748b' },
  };
  
  return colors[category] || { backgroundColor: '#6b7280' };
};

const styles = StyleSheet.create({
  safeContainer: {
      flex: 1,
      backgroundColor: "#f3f4f6",
  },
  container: {
      flex: 1,
      backgroundColor: "#f3f4f6",
  },
  scrollView: {
      flex: 1,
      marginTop: 50 + STATUS_BAR_HEIGHT,
  },
  contentContainer: {
      padding: 16,
  },
  card: {
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
      overflow: 'hidden',
      position: 'relative',
  },
  cardGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
  },
  cardContent: {
      flexDirection: 'row',
      height: 84,
  },
  categoryIndicator: {
      width: 5,
      height: '70%',
      borderTopRightRadius: 3,
      borderBottomRightRadius: 3,
      alignSelf: 'center',
  },
  mainContent: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      justifyContent: 'center',
  },
  cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: 4,
  },
  categoryText: {
      fontSize: 12,
      color: '#8ecae6',
      fontWeight: '500',
  },
  rightSection: {
      width: 90,
      height: '100%',
      paddingRight: 16,
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingVertical: 12,
  },
  dateText: {
      fontSize: 11,
      color: '#a8dadc',
      fontWeight: '400',
      maxWidth: 90,
  },
  searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#e5e7eb",
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 10,
      marginTop: 8,
      height: 40,
  },
  searchInput: {
      flex: 1,
      fontSize: 14,
      color: "#111827",
  },
  message: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: "#6b7280",
  },
  error: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: "red",
  },
  filterContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 12,
  },
  filterTag: {
      backgroundColor: '#d1d5db',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
  },
  filterTagSelected: {
      backgroundColor: '#1194fe',
  },
  filterTagText: {
      fontSize: 10,
      color: '#374151',
  },
  filterTagTextSelected: {
      color: '#fff',
  },
  filterTagIcon: {
      marginLeft: 4,
  },
  clearFiltersButton: {
      backgroundColor: '#6c757d',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
  },
  clearFiltersText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  filterToggleRow: {
      marginBottom: 12,
  },
  filterToggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f1f5f9',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignSelf: 'flex-start',
      position: 'relative',
      // Shadow for Android
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
  },
  filterToggleText: {
      color: '#475569',
      fontSize: 14,
      fontWeight: '900',
  },
  filterBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: '#ef4444',
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
  },
  filterBadgeText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: 'bold',
  },
  filtersSection: {
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
  },
});
