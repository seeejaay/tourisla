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
    Dimensions,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from '@react-navigation/native';
import { fetchHotlines } from "../../../../../lib/api/hotline";

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

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

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

export default function TouristHotlines() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const [hotlines, setHotlines] = useState<Hotline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isFocused) {
            loadHotlines();
        }
    }, [isFocused]);

    const loadHotlines = async () => {
        try {
            setLoading(true);
            const data = await fetchHotlines();
            console.log("Fetched hotlines:", data);
            setHotlines(data);
            setError("");
        } catch (err) {
            console.error("Error loading hotlines:", err);
            setError("Failed to load emergency contacts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackPress = () => {
        router.back();
    };

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const headerElevation = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 8],
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
            
            {/* Header with gradient background */}
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.header}
            >
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Hotlines</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#0f172a" />
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <Animated.ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                >
                    <Text style={styles.sectionDescription}>
                        Contact these emergency numbers for immediate assistance during your stay in Isla Verde.
                    </Text>
                    
                    {hotlines.map((hotline) => (
                        <HotlineCard
                            key={hotline.id}
                            id={hotline.id}
                            type={hotline.type}
                            municipality={hotline.municipality}
                            contactNumber={hotline.contact_number}
                            onCall={() => handleCall(hotline.contact_number)}
                            onView={() => router.push({
                                pathname: "/guide/profile/about/hotlines/guide_hotline_view",
                                params: { id: hotline.id }
                            })}
                        />
                    ))}
                    
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            In case of emergency, please contact the nearest local authority.
                        </Text>
                    </View>
                </Animated.ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: STATUS_BAR_HEIGHT,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
        lineHeight: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardDetails: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactNumber: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 6,
    },
    municipalityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    municipalityText: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: '500',
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
    footer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    footerText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
});
