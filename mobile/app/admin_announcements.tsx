import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    StatusBar,
    Modal, SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";
import { fetchAnnouncements, deleteAnnouncement } from "../lib/api/announcement";

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
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Announcements</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
            >
                {loading ? (
                    <Text style={styles.message}>Loading...</Text>
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : announcements.length === 0 ? (
                    <Text style={styles.message}>No announcements found.</Text>
                ) : (
                    announcements.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <View style={styles.actionButtons}>
                                    <Pressable
                                        onPress={() =>
                                            router.push(`/admin_announcement_edit?id=${item.id}`)
                                        }
                                        style={styles.editButton}
                                    >
                                        <Icon name="edit-3" size={18} color="#ffffff" />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => openDeleteModal(item.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Icon name="trash-2" size={18} color="#ffffff" />
                                    </Pressable>
                                </View>
                            </View>

                            <Text style={styles.cardDescription}>{item.description}</Text>

                            <Text style={styles.cardFooter}>
                                {item.location} | {item.category}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>

            <Pressable
                style={styles.fab}
                onPress={() => router.push("/admin_announcement_create")}
            >
                <Icon name="plus" size={24} color="#007dab" />
            </Pressable>

            {/* Delete Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
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
        backgroundColor: "#f1f1f1",
    },
    container: {
        flex: 1,
        backgroundColor: "#f1f1f1",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50 + STATUS_BAR_HEIGHT,
        backgroundColor: "#007dab",
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
        marginTop: 50 + STATUS_BAR_HEIGHT, // Adjust for header height
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
        backgroundColor: "#007dab",
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
        backgroundColor: "#1c2b38",
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
});