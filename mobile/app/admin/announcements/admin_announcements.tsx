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
import { fetchAnnouncements, deleteAnnouncement } from "../../../lib/api/announcement";
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

// Add this function at the top of your component or in a utility file
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

export default function AdminAnnouncementsScreen() {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<"recent" | "newest">("recent");
    const [searchQuery, setSearchQuery] = useState("");


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

            {/* Header */}
            <View style={styles.header}><Text style={styles.headerTitle}>Announcements</Text></View>

            <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: 20 }}
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
                        onPress={() => router.push(`/admin/announcements/admin_announcement_view?id=${item.id}`)}
                    >
                        <LinearGradient
                            colors={['#0f172a', '#1e293b']}
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
                                    {item.title}
                                </Text>
                                <Text style={styles.categoryText}>
                                    {item.category.replace(/_/g, " ")}
                                </Text>
                            </View>
                            
                            {/* Right section with actions */}
                            <View style={styles.rightSection}>
                                {/* Action buttons */}
                                <View style={styles.actionButtons}>
                                    <Pressable
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            router.push(`/admin/announcements/admin_announcement_edit?id=${item.id}`);
                                        }}
                                        style={styles.editButton}
                                    >
                                        <Icon name="edit-3" size={16} color="#ffffff" />
                                    </Pressable>
                                    <Pressable
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            openDeleteModal(item.id);
                                        }}
                                        style={styles.deleteButton}
                                    >
                                        <Icon name="trash-2" size={16} color="#ffffff" />
                                    </Pressable>
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

            <Pressable
                style={styles.fab}
                onPress={() => router.push("/admin/announcements/admin_announcement_create")}
            >
                <Icon name="plus" size={24} color="#1fd8d6" />
            </Pressable>

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
    safeContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50 + STATUS_BAR_HEIGHT,
        backgroundColor: "#0f172a",
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: STATUS_BAR_HEIGHT,
        paddingHorizontal: 20,
        zIndex: 50,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "900",
        color: "#ecf0f1",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
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
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    dateText: {
        fontSize: 11,
        color: '#a8dadc',
        fontWeight: '400',
        maxWidth: 90,
    },
    editButton: {
        backgroundColor: "#4cc9f0",
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#ef4444",
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    fab: {
        position: "absolute",
        bottom: 16,
        right: 16,
        backgroundColor: "#0f172a",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#1fd8d6",
        shadowOpacity: 0.2,
        shadowRadius: 4,
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
    },
    filterToggleText: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '500',
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
        borderWidth: 1,
        borderColor: '#2accde',
    },
});
