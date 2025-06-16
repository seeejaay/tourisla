import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Pressable,
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
import { fetchHotlines, deleteHotline } from "../../../../../lib/api/hotline";
import Icon from "react-native-vector-icons/Feather";
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

export default function AdminHotlinesScreen({ headerHeight }) {
    const router = useRouter();
    const isFocused = useIsFocused();
    const [hotlines, setHotlines] = useState<Hotline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollY = useRef(new Animated.Value(0)).current;

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
            setHotlines(data);
            setError(null);
        } catch (err) {
            console.error("Error loading hotlines:", err);
            setError("Failed to load emergency contacts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            "Delete Hotline",
            "Are you sure you want to delete this hotline?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteHotline(id);
                            await loadHotlines();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete hotline");
                        }
                    }
                }
            ]
        );
    };

    const handleBackPress = () => {
        router.back();
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
            <View style={styles.card}>
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
                    
                    {/* Right side with action buttons */}
                    <View style={styles.cardActions}>
                        <TouchableOpacity 
                            style={[styles.iconButton, styles.viewButton]}
                            onPress={onView}
                        >
                            <MaterialCommunityIcons name="eye" size={18} color="#ffffff" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.iconButton, styles.editButton]}
                            onPress={() => router.push({ 
                                pathname: "/admin/profile/about/hotlines/admin_hotline_edit", 
                                params: { id: id } 
                            })}
                        >
                            <MaterialCommunityIcons name="pencil" size={18} color="#ffffff" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.iconButton, styles.deleteButton]}
                            onPress={onDelete}
                        >
                            <MaterialCommunityIcons name="delete" size={18} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
            
            {/* Header with gradient background */}
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.header}
            >
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Hotlines</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            <View style={styles.container}>
                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#0f172a" />
                    </View>
                ) : error ? (
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <>
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
                                Manage emergency hotlines for tourists and staff.
                            </Text>
                            
                            {hotlines.map((hotline) => (
                                <HotlineCard
                                    key={hotline.id}
                                    id={hotline.id}
                                    type={hotline.type}
                                    municipality={hotline.municipality}
                                    contactNumber={hotline.contact_number}
                                    onDelete={() => handleDelete(hotline.id)}
                                    onView={() => router.push({ 
                                        pathname: "/admin/profile/about/hotlines/admin_hotline_view", 
                                        params: { id: hotline.id } 
                                    })}
                                />
                            ))}
                        </Animated.ScrollView>
                        
                        {/* Add hotline FAB */}
                        <Pressable
                            style={styles.fab}
                            onPress={() => router.push("/admin/profile/about/hotlines/admin_hotline_add")}
                        >
                            <Icon name="plus" size={24} color="#ffffff" />
                        </Pressable>
                    </>
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
        marginBottom: STATUS_BAR_HEIGHT, // Adjust for status bar height and header padding
    },
    scrollContent: {
        padding: 16,
        paddingBottom: STATUS_BAR_HEIGHT + 40, // Extra padding for FAB
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    municipalityText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    cardActions: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginLeft: 12,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewButton: {
        backgroundColor: '#0f172a',
    },
    editButton: {
        backgroundColor: '#3b82f6',
    },
    deleteButton: {
        backgroundColor: '#ef4444',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 56,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
