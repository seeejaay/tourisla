import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Pressable,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
    Platform,
    Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width } = Dimensions.get('window');

// Helper function to get icon based on hotline type
const getHotlineIcon = (type: string) => {
    switch(type) {
        case "MEDICAL":
            return "medical-bag";
        case "POLICE":
            return "police-badge";
        case "BFP":
            return "fire-truck";
        case "NDRRMO":
            return "shield-alert";
        case "COAST_GUARD":
            return "sail-boat";
        default:
            return "phone";
    }
};

// Helper function to get color based on hotline type
const getTypeColor = (type: string) => {
    switch(type) {
        case "MEDICAL":
            return "#ef4444";
        case "POLICE":
            return "#3b82f6";
        case "BFP":
            return "#f97316";
        case "NDRRMO":
            return "#eab308";
        case "COAST_GUARD":
            return "#06b6d4";
        default:
            return "#6366f1";
    }
};

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
                <ActivityIndicator size="large" color="#007dab" />
                <Text style={styles.loadingText}>Loading emergency contact details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#ef4444" />
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
                <MaterialCommunityIcons name="phone-off" size={64} color="#94a3b8" />
                <Text style={styles.errorText}>No emergency contact found for ID: {id}</Text>
                <Pressable 
                    onPress={() => router.back()} 
                    style={styles.backToListButton}
                >
                    <Text style={styles.backToListButtonText}>Back to List</Text>
                </Pressable>
            </View>
        );
    }

    const typeColor = getTypeColor(hotline.type);
    const iconName = getHotlineIcon(hotline.type);
    const formattedType = hotline.type.replace(/_/g, " ");

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#007dab" />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back-outline" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>Emergency Contact</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section with Icon */}
                <View style={styles.heroSection}>
                    <View style={[styles.iconCircle, { backgroundColor: `${typeColor}20` }]}>
                        <MaterialCommunityIcons name={iconName} size={48} color={typeColor} />
                    </View>
                    <Text style={[styles.typeTitle, { color: typeColor }]}>{formattedType}</Text>
                    <View style={[styles.municipalityBadge, { backgroundColor: typeColor }]}>
                        <Text style={styles.municipalityText}>{hotline.municipality}</Text>
                    </View>
                </View>

                {/* Contact Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardHeaderText}>Contact Information</Text>
                    </View>
                    
                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="phone" size={20} color="#64748b" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Contact Number</Text>
                                <Text style={styles.infoValue}>{hotline.contact_number}</Text>
                            </View>
                        </View>
                        
                        {hotline.address && (
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="map-marker" size={20} color="#64748b" />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Address</Text>
                                    <Text style={styles.infoValue}>{hotline.address}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        height: 50 + STATUS_BAR_HEIGHT,
        backgroundColor: "#0f172a",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: STATUS_BAR_HEIGHT,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    content: {
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    typeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    municipalityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    municipalityText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    cardHeader: {
        backgroundColor: '#f1f5f9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    cardHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
    },
    infoSection: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    infoTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: "#64748b",
        marginTop: 12,
    },
    errorText: {
        fontSize: 16,
        color: "#ef4444",
        textAlign: "center",
        marginTop: 16,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007dab',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    backToListButton: {
        backgroundColor: '#0f172a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backToListButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
