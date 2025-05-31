import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useHotlineManager } from "@/hooks/useHotlineManager"; // Import the useHotlineManager hook
import Icon from "react-native-vector-icons/Ionicons";

export default function AdminHotlineViewScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>(); // Get the hotline ID from the URL params
    const { viewHotline, loading, error } = useHotlineManager(); // Use the hook
    const [hotline, setHotline] = useState<null | {
        id: number;
        municipality: string;
        type: string;
        contact_number: string;
        address?: string;
    }>(null);

    useEffect(() => {
        if (id) {
            loadHotline(Number(id)); // Convert ID to number and fetch hotline details
        }
    }, [id]);

    const loadHotline = async (hotlineId: number) => {
        const data = await viewHotline(hotlineId); // Use the viewHotline function from the hook
        if (data) {
            if (data.id !== undefined) {
                setHotline(data as { id: number; municipality: string; type: string; contact_number: string; address?: string });
            } else {
                console.error("Hotline data is missing the required 'id' property.");
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading hotline details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={() => loadHotline(Number(id))} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    if (!hotline) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>No hotline found for ID: {id}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back-outline" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>Hotline Details</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{hotline.type}</Text>
                <Text style={styles.subtitle}>{hotline.municipality}</Text>
                <Text style={styles.info}>📞 {hotline.contact_number}</Text>
                {hotline.address && <Text style={styles.info}>🏠 {hotline.address}</Text>}
            </View>
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
        height: 50 + (StatusBar.currentHeight || 24),
        backgroundColor: "#007dab",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight || 24,
        zIndex: 50,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    content: {
        marginTop: 100,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: "#6B7280",
        marginBottom: 20,
    },
    info: {
        fontSize: 16,
        color: "#34495e",
        marginBottom: 10,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#2563EB",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
    retryButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007dab",
        borderRadius: 6,
    },
    retryButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
});