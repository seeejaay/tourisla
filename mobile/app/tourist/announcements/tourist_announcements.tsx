import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    StatusBar,
    Modal,
    SafeAreaView,
    Dimensions,
    ScrollView as RNScrollView,
} from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { fetchAnnouncements, deleteAnnouncement } from "../../../lib/api/announcement";
import { LinearGradient } from 'expo-linear-gradient';
import FilterSection, { getCategoryColor } from '@/components/announcements/FilterSection';
import { useRouter } from 'expo-router';
import HeaderWithBack from "@/components/HeaderWithBack";
import SearchBar from "@/components/SearchBar"; 
import { toTitleCase } from "@/lib/utils/textFormat";
import Pagination from '@/components/Pagination'; 

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

export default function TouristAnnouncementsScreen() {
    const scrollRef = useRef<RNScrollView>(null);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredAnnouncements = announcements.filter((item) => {
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const data = await fetchAnnouncements();
                    setAnnouncements(data || []);
                    setError(null);
                } catch (err) {
                    console.error("Failed to fetch announcements", err);
                    setAnnouncements([]);
                } finally {
                    setLoading(false);
                }
            };

            loadData();
        }, [])
    );

    const handleDelete = async () => {
        if (!selectedAnnouncementId) return;

        try {
            await deleteAnnouncement(selectedAnnouncementId);
            setAnnouncements((prev) =>
                prev.filter((item) => item.id !== selectedAnnouncementId)
            );
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
            <HeaderWithBack backgroundColor="#287674" textColor="#f9fafb"/>
                <ScrollView
                    ref={scrollRef}
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Latest Announcements</Text>
                    <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search announcements..."
                    />
                    <FilterSection
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                    />

                    <View>
                    {loading ? (
                        <Text style={styles.message}>Loading...</Text>
                    ) : filteredAnnouncements.length === 0 ? (
                        <Text style={styles.message}>No announcements available at this time.</Text>
                    ) : (
                        paginatedAnnouncements.map((item) => (
                            <Pressable
                                key={item.id}
                                style={styles.card}
                                onPress={() =>
                                    router.push(`/tourist/announcements/tourist_announcement_view?id=${item.id}`)
                                }
                            >
                                <LinearGradient colors={['#fff', '#fff']} style={styles.cardGradient} />
                                <View style={styles.cardContent}>
                                    <View
                                        style={[
                                            styles.categoryIndicator,
                                            { backgroundColor: getCategoryColor(item.category) },
                                        ]}
                                    />
                                    <View style={styles.mainContent}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>
                                    {toTitleCase(item.title.replace(/_/g, " "))}
                                    </Text>
                                    <Text style={styles.categoryText}>
                                    {toTitleCase(item.category.replace(/_/g, " "))}
                                    </Text>
                                    </View>
                                    <View style={styles.rightSection}>
                                        <Text style={styles.dateText} numberOfLines={1}>
                                            {new Date(item.date_posted).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    )}

                    </View>
                    <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredAnnouncements.length / itemsPerPage)}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        scrollRef.current?.scrollTo({ y: 0, animated: true });
                    }}
                    />
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
                                <Pressable style={styles.modalDeleteButton} onPress={handleDelete}>
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
        backgroundColor: "#f9fafb",
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1c8773',
        marginBottom: 16,
    },
    card: {
        borderRadius: 12,
        marginBottom: 6,
        borderColor: '#ececee',
        borderWidth: 1,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 12,
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
        fontWeight: '700',
        color: '#334155',
    },
    categoryText: {
        fontSize: 12,
        color: '#334155',
        fontWeight: '400',
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
        color: '#4c4c4c',
        fontWeight: '700',
        maxWidth: 90,
    },
    message: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 13,
        color: '#6b7280',
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 6,
        marginRight: 5,
        alignItems: 'center',
    },
    modalCancelButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    modalDeleteButton: {
        flex: 1,
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 6,
        marginLeft: 5,
        alignItems: 'center',
    },
    modalDeleteButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
