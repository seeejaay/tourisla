import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Pressable,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import Icon from "react-native-vector-icons/Ionicons";

export default function AdminHotlineViewScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { viewHotline, loading, error } = useHotlineManager();
    const [hotline, setHotline] = useState<null | {
        id: number;
        municipality: string;
        type: string;
        contact_number: string;
        address?: string;
    }>(null);

    useEffect(() => {
        if (id) {
            loadHotline(Number(id));
        }
    }, [id]);

    const loadHotline = async (hotlineId: number) => {
        try {
            const data = await viewHotline(hotlineId);
            if (data && data.id !== undefined) {
                setHotline(data as { id: number; municipality: string; type: string; contact_number: string; address?: string });
            } else {
                setHotline(null);
            }
        } catch (error) {
            console.error("Failed to load hotline:", error);
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

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.value}>{hotline.type}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Municipality</Text>
                    <Text style={styles.value}>{hotline.municipality}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Contact Number</Text>
                    <Text style={styles.value}>{hotline.contact_number}</Text>
                </View>
                {hotline.address && (
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Address</Text>
                        <Text style={styles.value}>{hotline.address}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
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
        paddingTop: 100,
        paddingHorizontal: 20,
    },
    infoSection: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e5e5",
        paddingBottom: 10,
    },
    label: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 5,
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2c3e50",
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
