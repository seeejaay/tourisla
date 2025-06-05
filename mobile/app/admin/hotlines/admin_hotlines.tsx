import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator,
    Platform,
    SafeAreaView,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { fetchHotlines, deleteHotline } from "../../../lib/api/hotline";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Hotline {
    id: number;
    municipality: string;
    type: string;
    contact_number: string;
    address?: string;
}

interface HotlineCardProps {
    id: number; 
    type: string;
    municipality: string;
    contactNumber: string;
    onDelete: () => void;
    onView: () => void;
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

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

// Helper function to format municipality name
const formatMunicipality = (municipality: string) => {
    return municipality.replace(/_/g, " ");
};

export default function AdminHotlinesScreen() {
    const router = useRouter();
    const [hotlines, setHotlines] = useState<Hotline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadHotlines();
    }, []);

    const loadHotlines = async () => {
        try {
            setLoading(true);
            const data = await fetchHotlines();
            setHotlines(data);
            setError("");
        } catch (err) {
            setError("Failed to load emergency contacts. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            "Confirm Removal",
            "Are you sure you want to remove this emergency contact?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await deleteHotline(id);
                            setHotlines(hotlines.filter((h) => h.id !== id));
                            Alert.alert("Success", "Emergency contact removed successfully");
                        } catch (err) {
                            Alert.alert("Error", "Failed to remove emergency contact");
                            console.error(err);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const headerElevation = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [2, 8],
        extrapolate: 'clamp',
    });

    const HotlineCard = ({
        id,
        type,
        municipality,
        contactNumber,
        onDelete,
        onView,
    }: HotlineCardProps) => {
        const iconName = getHotlineIcon(type);
        const formattedType = type.replace(/_/g, " ");
        const formattedMunicipality = formatMunicipality(municipality);
        
        // Get background color based on type
        const getTypeColor = () => {
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
        
        const typeColor = getTypeColor();
        
        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={onView}
                activeOpacity={0.9}
            >
                <View style={styles.cardContent}>
                    <View style={[styles.iconContainer, { backgroundColor: `${typeColor}20` }]}>
                        <MaterialCommunityIcons name={iconName} size={24} color={typeColor} />
                    </View>
                    
                    <View style={styles.cardDetails}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{formattedType}</Text>
                            <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
                                <Text style={styles.typeBadgeText}>{formattedMunicipality}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.contactRow}>
                            <MaterialCommunityIcons name="phone" size={16} color="#64748b" />
                            <Text style={styles.contactNumber}>{contactNumber}</Text>
                        </View>
                        
                        <View style={styles.cardActions}>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={onView}
                            >
                                <MaterialCommunityIcons name="eye-outline" size={16} color="#0f172a" />
                                <Text style={styles.actionButtonText}>Details</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={onDelete}
                            >
                                <MaterialCommunityIcons name="delete-outline" size={16} color="#ef4444" />
                                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}><Text style={styles.headerTitle}>Hotlines Directory</Text></View>

                {/* Content */}
                <Animated.ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                >
                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#0f172a" style={styles.loadingIndicator} />
                            <Text style={styles.loadingText}>Loading emergency contacts...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.centerContainer}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#ef4444" />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity style={styles.retryButton} onPress={loadHotlines}>
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : hotlines.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <MaterialCommunityIcons name="phone-off" size={64} color="#94a3b8" />
                            <Text style={styles.emptyText}>No emergency contacts available</Text>
                            <Text style={styles.emptySubtext}>Add contacts to help tourists during emergencies</Text>
                            <TouchableOpacity 
                                style={styles.addHotlineButton}
                                onPress={() => router.push("/admin/hotlines/admin_hotline_add")}
                            >
                                <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                                <Text style={styles.addHotlineButtonText}>Add Emergency Contact</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>All Emergency Contacts</Text>
                            <Text style={styles.sectionSubtitle}>Manage contacts for tourists in case of emergencies</Text>
                            
                            {hotlines.map((hotline) => (
                                <HotlineCard
                                    key={hotline.id}
                                    id={hotline.id}
                                    type={hotline.type}
                                    municipality={hotline.municipality}
                                    contactNumber={hotline.contact_number}
                                    onDelete={() => handleDelete(hotline.id)}
                                    onView={() => router.push({ 
                                        pathname: "/admin/hotlines/admin_hotline_view", 
                                        params: { id: hotline.id } 
                                    })}
                                />
                            ))}
                        </>
                    )}
                </Animated.ScrollView>
                
                {/* Floating Action Button */}
                {!loading && hotlines.length > 0 && (
                    <TouchableOpacity 
                        style={styles.fab}
                        onPress={() => router.push("/admin/hotlines/admin_hotline_add")}
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                )}
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
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        marginTop: 50 + STATUS_BAR_HEIGHT,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        marginTop: 40,
    },
    loadingIndicator: {
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
    },
    errorText: {
        fontSize: 16,
        color: "#ef4444",
        textAlign: "center",
        marginTop: 16,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#0f172a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: "#334155",
        textAlign: "center",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#64748b",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 24,
    },
    addHotlineButton: {
        backgroundColor: '#0f172a',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addHotlineButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardDetails: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactNumber: {
        fontSize: 15,
        color: "#334155",
        marginLeft: 8,
        fontWeight: '500',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0f172a',
        marginLeft: 4,
    },
    deleteButton: {
        marginLeft: 8,
    },
    deleteButtonText: {
        color: '#ef4444',
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
});
