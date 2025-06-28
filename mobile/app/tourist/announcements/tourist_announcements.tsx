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
    Platform,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SortButton from "../../../components/SortButton";
import { fetchAnnouncements, deleteAnnouncement } from "../../../lib/api/announcement";
import { LinearGradient } from 'expo-linear-gradient';

interface Announcement {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    date_posted: string;
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
const { width, height } = Dimensions.get('window');

interface TourPackageDetailsScreenProps {
    headerHeight: number;
}

export default function TouristAnnouncementsScreen({ headerHeight }: TourPackageDetailsScreenProps) {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Function to get category color
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

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    console.log("Loading announcements data...");
                    const data = await fetchAnnouncements();
                    console.log(`Received ${data?.length || 0} announcements`);
                    setAnnouncements(data || []);
                    setError("");
                } catch (err) {
                    console.error("Failed to fetch announcements", err);
                    // Don't show the error to the user
                    console.log("Error suppressed from UI");
                    // Set empty array to avoid showing previous data
                    setAnnouncements([]);
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

    const handleDelete = async () => {
        if (!selectedAnnouncementId) return;

        try {
            await deleteAnnouncement(selectedAnnouncementId);
            setAnnouncements((prev) => prev.filter((item) => item.id !== selectedAnnouncementId));
            setModalVisible(false);
        } catch (err) {
            console.error("Failed to delete announcement", err);
        }
    };

    const openDeleteModal = (id: string) => {
        setSelectedAnnouncementId(id);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>

        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#000" />
        </TouchableOpacity>
        </View>

            <ScrollView
            style={[styles.scrollView, { marginTop: headerHeight }]}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            >

            {/* Filter Tags in Grid Layout */}
            <View style={{ paddingHorizontal: 16, paddingTop: 10,borderWidth: 1.5, backgroundColor: '#f8fafc', borderColor: '#ececee', borderRadius: 0, marginBottom: 12 }}>
                {/* Search and Sort Row */}
                <View style={[styles.searchContainer]}>
                <View style={styles.searchRow}>
                    <View style={styles.searchInputContainer}>
                        <Icon name="search" size={16} color="#0c5e58" style={{ marginRight: 8 }} />
                        <TextInput
                            style={[styles.searchInput, { fontSize: 14 }]}
                            placeholder="Search announcements..."
                            placeholderTextColor="#9ca3af"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <SortButton sortOption={sortOption || "recent"} setSortOption={setSortOption} />
                </View>
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
                ) : filteredAnnouncements.length === 0 ? (
                <Text style={styles.message}>No announcements available at this time.</Text>
                ) : (
                filteredAnnouncements.map((item) => (
                    <Pressable 
                        key={item.id} 
                        style={styles.card}
                        onPress={() => router.push(`/tourist/announcements/tourist_announcement_view?id=${item.id}`)}
                    >
                        <LinearGradient
                            colors={['#fff', '#fff']}
                            style={styles.cardGradient}
                        />
                        
                        <View style={styles.cardContent}>
                            {/* Left color indicator */}
                            <View 
                                style={[
                                    styles.categoryIndicator, 
                                    { backgroundColor: getCategoryColor(item.category) }
                                ]} 
                            />
                            
                            {/* Main content */}
                            <View style={styles.mainContent}>
                                <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                                    {item.title
                                        .replace(/_/g, " ")
                                        .toLowerCase()
                                        .replace(/\b\w/g, (char) => char.toUpperCase())
                                    }
                                </Text>
                                <Text style={styles.categoryText}>
                                    {item.category
                                        .replace(/_/g, " ")
                                        .toLowerCase()
                                        .replace(/\b\w/g, (char) => char.toUpperCase())
                                    }
                                </Text>
                            </View>
                            
                            {/* Right section with actions */}
                            <View style={styles.rightSection}>
                                {/* Action buttons */}
                                <View style={styles.actionButtons}>
                                </View>
                                
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

            {/* Delete Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Delete</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to delete this announcement?
                        </Text>
                        <View style={styles.modalActions}>
                            <Pressable
                                style={styles.modalCancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={styles.modalDeleteButton}
                                onPress={handleDelete}
                            >
                                <Text style={styles.modalDeleteButtonText}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        justifyContent: 'center',
        alignItems: 'center',
      },
    safeContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },

    scrollView: {
        flex: 1,
        marginTop: 50 + STATUS_BAR_HEIGHT,
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    card: {
        borderRadius: 12,
        marginBottom: 6,
        borderColor: '#ececee',
        borderWidth: 1,
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
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#000",
    },
    categoryText: {
        fontSize: 12,
        color: '#000',
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
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    dateText: {
        fontSize: 11,
        color: '#4c4c4c',
        fontWeight: '800',
        maxWidth: 90,
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
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 14,
        color: "#374151",
        textAlign: "center",
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: "#6c757d",
        padding: 10,
        borderRadius: 6,
        marginRight: 5,
        alignItems: "center",
    },
    modalCancelButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    modalDeleteButton: {
        flex: 1,
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 6,
        marginLeft: 5,
        alignItems: "center",
    },
    modalDeleteButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    searchContainer: {
        marginTop: STATUS_BAR_HEIGHT + 50,
        backgroundColor: '#f8fafc',
        zIndex: 10,
      },
      searchRow: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 12, // Add spacing below the row
      },
      searchInputContainer: {
        flex: 1, // Allow the search input to take up available space
        flexDirection: 'row', // Align the search icon and input horizontally
        alignItems: 'center', // Vertically center the icon and input
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ececee',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8, // Add spacing between the search input and SortButton
      },
      searchIcon: {
        marginRight: 8, // Add spacing between the icon and the input text
      },
      searchInput: {
        flex: 1, // Allow the input to take up remaining space in the container
        fontSize: 16,
        color: '#0f172a',
      },
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
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
        backgroundColor: '#b6a59e',
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
        paddingVertical: 16,
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

        marginVertical: 12,
    },
    filterToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        alignSelf: 'flex-start',
        position: 'relative',
    },
    filterToggleText: {
        color: '#1c5461',
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
        marginBottom: 12,
    },
});
