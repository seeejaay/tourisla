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

interface Announcement {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    date_posted: string; // Assuming this is a string in ISO format
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

export default function AdminAnnouncementsScreen() {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

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
          return new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime(); // Most recently updated first
        } else if (sortOption === "newest") {
          return new Date(a.date_posted).getTime() - new Date(b.date_posted).getTime(); // Newest last
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

            {/* Filter + Sort Options */}
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", gap: 8 }}>
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
                            style={{
                            backgroundColor: selectedCategory === category ? "#007dab" : "#d1d5db",
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                            }}
                            onPress={() => setSelectedCategory((prev) => (prev === category ? null : category))}
                        >
                            <Text style={{ fontSize: 10, color: selectedCategory === category ? "#fff" : "#374151" }}>
                            {category.replace(/_/g, " ")}
                            </Text>
                        </Pressable>
                        ))}
                    </View>
                </ScrollView>
                
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8}}>
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
                    <SortButton sortOption={sortOption || "recent"} setSortOption={setSortOption} style={{ marginLeft: 8 }} />
                </View>

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
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <View style={styles.actionButtons}>
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation(); // Prevent triggering the card's onPress
                                    router.push(`/admin/announcements/admin_announcement_edit?id=${item.id}`);
                                }}
                                style={styles.editButton}
                            >
                                <Icon name="edit-3" size={18} color="#ffffff" />
                            </Pressable>
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation(); // Prevent triggering the card's onPress
                                    openDeleteModal(item.id);
                                }}
                                style={styles.deleteButton}
                            >
                                <Icon name="trash-2" size={18} color="#ffffff" />
                            </Pressable>
                            </View>
                        </View>
                        <Text style={styles.cardDescription}>{item.description}</Text>
                        <Text style={styles.cardFooter}>
                            {item.location} | {item.category.replace(/_/g, " ")} | {
                            new Date(item.date_posted).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })
                            }
                        </Text>
                    </Pressable>
                ))
                )}
            </View>
            </ScrollView>

            <Pressable
                style={styles.fab}
                onPress={() => router.push("/admin/announcements/admin_announcement_create")}
            >
                <Icon name="plus" size={24} color="#007dab" />
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
        backgroundColor: "#ffffff",
        borderRadius: 12,
        paddingTop: 16,
        paddingRight: 16,
        paddingLeft: 16,
        paddingBottom: 4,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "bold",
        flex: 1,
    },
    actionButtons: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 4,
        marginLeft: 16,
    },
    editButton: {
        backgroundColor: "#38bdf8",
        padding: 10,
        borderRadius: 6,
    },
    cardDescription: {
        fontSize: 10,
        color: "#374151",
        marginBottom: 12,
    },
    cardFooter: {
        fontSize: 8,
        color: "#6b7280",
        fontStyle: "italic",
        textAlign: "right",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 6,
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
        shadowColor: "#000",
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
});
