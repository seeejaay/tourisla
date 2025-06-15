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
    Linking,
    TouchableOpacity,
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

export default function StaffHotlineViewScreen() {
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

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
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
    const formattedMunicipality = hotline.municipality.replace(/_/g, " ");

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
                        <MaterialCommunityIcons name={iconName} size={64} color={typeColor} />
                    </View>
                    <Text style={styles.hotlineType}>{formattedType}</Text>
                    <View style={[styles.municipalityBadge, { backgroundColor: typeColor }]}>
                        <Text style={styles.municipalityText}>{formattedMunicipality}</Text>
                    </View>
                </View>

                {/* Details Card */}
                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailLabelContainer}>
                            <MaterialCommunityIcons name="phone" size={20} color="#64748b" />
                            <Text style={styles.detailLabel}>Contact Number</Text>
                        </View>
                        <Text style={styles.detailValue}>{hotline.contact_number}</Text>
                    </View>

                    {hotline.address && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailLabelContainer}>
                                <MaterialCommunityIcons name="map-marker" size={20} color="#64748b" />
                                <Text style={styles.detailLabel}>Address</Text>
                            </View>
                            <Text style={styles.detailValue}>{hotline.address}</Text>
                        </View>
                    )}
                </View>

                {/* Emergency Instructions */}
                <View style={styles.instructionsCard}>
                    <Text style={styles.instructionsTitle}>Emergency Instructions</Text>
                    
                    <View style={styles.instructionItem}>
                        <View style={styles.instructionNumber}>
                            <Text style={styles.instructionNumberText}>1</Text>
                        </View>
                        <Text style={styles.instructionText}>
                            Stay calm and assess the situation
                        </Text>
                    </View>
                    
                    <View style={styles.instructionItem}>
                        <View style={styles.instructionNumber}>
                            <Text style={styles.instructionNumberText}>2</Text>
                        </View>
                        <Text style={styles.instructionText}>
                            Call this emergency number and clearly state your location
                        </Text>
                    </View>
                    
                    <View style={styles.instructionItem}>
                        <View style={styles.instructionNumber}>
                            <Text style={styles.instructionNumberText}>3</Text>
                        </View>
                        <Text style={styles.instructionText}>
                            Follow the instructions given by emergency personnel
                        </Text>
                    </View>
                </View>

                {/* Call Button */}
                <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCall(hotline.contact_number)}
                >
                    <MaterialCommunityIcons name="phone" size={24} color="#ffffff" />
                    <Text style={styles.callButtonText}>Call Now</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f3f4f6",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: "#ef4444",
        textAlign: "center",
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: "#3b82f6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    backToListButton: {
        marginTop: 20,
        backgroundColor: "#0f172a",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backToListButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    header: {
        height: 56 + STATUS_BAR_HEIGHT,
        backgroundColor: "#0f172a",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: STATUS_BAR_HEIGHT,
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#ffffff",
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: "center",
        marginBottom: 24,
        marginTop: 16,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    hotlineType: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: 8,
        textAlign: "center",
    },
    municipalityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    municipalityText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14,
        textTransform: "uppercase",
    },
    detailsCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    detailRow: {
        marginBottom: 16,
    },
    detailLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    detailLabel: {
        fontSize: 14,
        color: "#64748b",
        marginLeft: 8,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0f172a",
    },
    instructionsCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0f172a",
        marginBottom: 16,
    },
    instructionItem: {
        flexDirection: "row",
        marginBottom: 12,
        alignItems: "center",
    },
    instructionNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    instructionNumberText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14,
    },
    instructionText: {
        flex: 1,
        fontSize: 16,
        color: "#334155",
    },
    callButton: {
        backgroundColor: "#22c55e",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    callButtonText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 18,
        marginLeft: 8,
    },
});
