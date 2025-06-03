import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router"; // Ensure useRouter is used correctly
import { useEffect, useState } from "react";
import { fetchHotlines, deleteHotline } from "../../../lib/api/hotline";
import Icon from "react-native-vector-icons/Ionicons"; 

interface Hotline {
    id: number;
    municipality: string;
    type: string;
    contact_number: string;
    address?: string;
}

interface HotlineCardProps {
    id: number; 
    name: string;
    location: string;
    contactNumber: string;
    onDelete: () => void;
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;


export default function AdminHotlinesScreen() {
    const router = useRouter();
    const [hotlines, setHotlines] = useState<Hotline[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadHotlines();
    }, []);

    const loadHotlines = async () => {
        setLoading(true);
        try {
            const data = await fetchHotlines();
            setHotlines(data);
        } catch (err: any) {
            setError("Failed to fetch hotlines.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this hotline?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteHotline(id);
                        setHotlines((prev) => prev.filter((h) => h.id !== id));
                    } catch (err) {
                        Alert.alert("Error", "Failed to delete hotline.");
                    }
                },
            },
        ]);
    };

    const HotlineCard = ({
        id,
        name,
        location,
        contactNumber,
        onDelete,
    }: HotlineCardProps) => {
        return (
            <View style={styles.card}>
                {/* Title */}
                <View style={styles.cardRow}>
                    <Icon name="call-outline" size={24} color="#2563EB" style={styles.icon} />
                    <Text style={styles.cardTitle}>{name}</Text>
                </View>
    
                {/* Location */}
                <View style={styles.cardRow}>
                    <Icon name="location-outline" size={20} color="#6B7280" style={styles.icon} />
                    <Text style={styles.cardText}>{location}</Text>
                </View>
    
                {/* Contact Number */}
                <View style={styles.cardRow}>
                    <Icon name="phone-portrait-outline" size={20} color="#6B7280" style={styles.icon} />
                    <Text style={styles.cardText}>{contactNumber}</Text>
                </View>
    
                {/* Actions */}
                <View style={styles.cardActions}>
                    {/* Delete Button */}
                    <Pressable onPress={onDelete} style={styles.deleteButton}>
                        <Icon name="trash-outline" size={18} color="#FFFFFF" style={styles.icon} />
                        <Text style={styles.deleteButtonText}>Remove</Text>
                    </Pressable>
    
                    {/* More Info Button */}
                    <Pressable
                        onPress={() => router.push({ pathname: "/admin/hotlines/admin_hotline_view", params: { id } })}
                        style={styles.moreInfoButton}
                    >
                        <Icon name="chevron-forward-outline" size={20} color="#2563EB" />
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hotlines Directory</Text>
            </View>
            <ScrollView style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                >
            {loading ? (
                <ActivityIndicator size="large" color="#2563EB" style={styles.loadingIndicator} />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : hotlines.length === 0 ? (
                <Text style={styles.message}>No hotlines available.</Text>
            ) : (
                hotlines.map((hotline) => (
                    <HotlineCard
                        key={hotline.id}
                        id={hotline.id} // Pass the id here
                        name={hotline.type}
                        location={hotline.municipality}
                        contactNumber={hotline.contact_number}
                        onDelete={() => handleDelete(hotline.id)}
                    />
                ))
            )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
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
        marginTop: 50 + STATUS_BAR_HEIGHT,
    },
    contentContainer: {
        padding: 16,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    error: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    message: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 8, // Reduced margin between cards
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2c3e50",
    },
    cardText: {
        fontSize: 14,
        color: "#6B7280",
    },
    cardActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    moreInfoButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: "#f1f1f1",
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#dc3545",
        borderRadius: 6,
        elevation: 3,
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
});