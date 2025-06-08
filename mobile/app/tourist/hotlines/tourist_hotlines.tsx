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
    Linking,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { fetchHotlines } from "../../../lib/api/hotline";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from '@react-navigation/native';

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
    onCall: () => void;
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

export default function TouristHotlinesScreen() {
    const router = useRouter();
    const [hotlines, setHotlines] = useState<Hotline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const scrollY = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();

    // Load hotlines when screen comes into focus
    useEffect(() => {
        if (isFocused) {
            loadHotlines();
        }
    }, [isFocused]);

    const loadHotlines = async () => {
        try {
            setLoading(true);
            const data = await fetchHotlines();
            console.log("Fetched hotlines:", data); // Add logging to debug
            setHotlines(data);
            setError("");
        } catch (err) {
            console.error("Error loading hotlines:", err);
            setError("Failed to load emergency contacts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
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
        onCall,
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
                activeOpacity={0.7}
            >
                <View style={styles.cardContent}>
                    {/* Left side with icon */}
                    <View style={[styles.iconContainer, { backgroundColor: `${typeColor}20` }]}>
                        <MaterialCommunityIcons name={iconName} size={24} color={typeColor} />
                    </View>
                    
                    {/* Middle content */}
                    <View style={styles.cardDetails}>
                        <Text style={styles.cardTitle}>{formattedType}</Text>
                        
                        <View style={styles.contactRow}>
                            <MaterialCommunityIcons name="phone" size={16} color="#64748b" />
                            <Text style={styles.contactNumber}>{contactNumber}</Text>
                        </View>
                        
                        <View style={[styles.municipalityBadge, { backgroundColor: typeColor }]}>
                            <Text style={styles.municipalityText}>{formattedMunicipality}</Text>
                        </View>
                    </View>
                    
                    {/* Right side with call button */}
                    <View style={styles.cardActions}>
                        <TouchableOpacity 
                            style={[styles.iconButton, styles.callButton]}
                            onPress={onCall}
                        >
                            <MaterialCommunityIcons name="phone" size={18} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Group hotlines by municipality
    const hotlinesByMunicipality: Record<string, Hotline[]> = {};
    hotlines.forEach(hotline => {
        if (!hotlinesByMunicipality[hotline.municipality]) {
            hotlinesByMunicipality[hotline.municipality] = [];
        }
        hotlinesByMunicipality[hotline.municipality].push(hotline);
    });

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
                            <Text style={styles.emptySubtext}>Please check back later</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                            <Text style={styles.sectionSubtitle}>Important contacts in case of emergencies</Text>
                            
                            {Object.entries(hotlinesByMunicipality).map(([municipality, municipalityHotlines]) => (
                                <View key={municipality} style={styles.municipalitySection}>
                                    <Text style={styles.municipalityTitle}>
                                        {formatMunicipality(municipality)}
                                    </Text>
                                    
                                    {municipalityHotlines.map((hotline) => (
                                        <HotlineCard
                                            key={hotline.id}
                                            id={hotline.id}
                                            type={hotline.type}
                                            municipality={hotline.municipality}
                                            contactNumber={hotline.contact_number}
                                            onCall={() => handleCall(hotline.contact_number)}
                                            onView={() => router.push({ 
                                                pathname: "/tourist/hotlines/tourist_hotline_view", 
                                                params: { id: hotline.id } 
                                            })}
                                        />
                                    ))}
                                </View>
                            ))}
                        </>
                    )}
                </Animated.ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },
    header: {
        height: 50 + STATUS_BAR_HEIGHT,
        backgroundColor: "#0f172a",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 10,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
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
        backgroundColor: "#3b82f6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#334155",
        textAlign: "center",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#64748b",
        textAlign: "center",
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 16,
    },
    municipalitySection: {
        marginBottom: 24,
    },
    municipalityTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 12,
        marginTop: 8,
        paddingLeft: 4,
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
        alignItems: 'center',
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
    cardTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 6,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactNumber: {
        fontSize: 14,
        color: "#334155",
        marginLeft: 8,
        fontWeight: '500',
    },
    municipalityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    municipalityText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardActions: {
        marginLeft: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    callButton: {
        backgroundColor: '#22c55e',
    },
});
