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
import { toTitleCase } from "@/lib/utils/textFormat";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";

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
    address?: string;
    onCall: () => void;
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
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const filteredHotlines = hotlines.filter((hotline) => {
        const matchesSearch =
            hotline.municipality.toLowerCase().includes(search.toLowerCase()) ||
            hotline.type.toLowerCase().includes(search.toLowerCase()) ||
            hotline.contact_number.includes(search);
    
        const matchesFilter = filterType ? hotline.type === filterType : true;
    
        return matchesSearch && matchesFilter;
    });
    const hotlineTypes = [...new Set(hotlines.map(h => h.type))];

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
        type,
        municipality,
        contactNumber,
        address,
        onCall,
    }: HotlineCardProps) => {
        const iconName = getHotlineIcon(type);
        const formattedType = type.replace(/_/g, " ");
        const formattedMunicipality = formatMunicipality(municipality);
    
        const getTypeColor = () => {
            switch (type) {
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
                <View style={styles.iconColumn}>
                    <View style={{justifyContent: 'center'}}>
                            <Text style={styles.cardTitle}>{formattedType}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={[styles.iconContainer, { backgroundColor: `${typeColor}20` }]}>
                            <MaterialCommunityIcons name={iconName} size={22} color={typeColor} />
                        </View>
                        <TouchableOpacity
                            style={[styles.iconButton, styles.callButton]}
                            onPress={onCall}
                        >
                            <MaterialCommunityIcons name="phone" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.iconRow}>
                    <View style={styles.cardContent}>
                        <View style={styles.contactRow}>
                            <MaterialCommunityIcons name="phone" size={14} color="#64748b" />
                            <Text style={styles.contactNumber}>{contactNumber}</Text>
                        </View>
                        {address && (
                            <View style={styles.contactRow}>
                                <MaterialCommunityIcons name="map-marker" size={14} color="#64748b" />
                                <Text style={styles.addressText}>{toTitleCase(address)}</Text>
                            </View>
                        )}
    
                        <View style={[styles.municipalityBadge, { backgroundColor: typeColor }]}>
                            <Text style={styles.municipalityText}>{toTitleCase(formattedMunicipality)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
    
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
                    <View>
                        <Text style={styles.sectionTitle}>Emergency Hotlines</Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#3e979f",
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                marginHorizontal: 16,
                                alignSelf: 'flex-end',
                                borderRadius: 8,
                            }}
                            onPress={() => router.push("/tourist/profile/about/incident-report")}
                        >
                            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
                                Report Incident
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchFilterRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search by type, municipality or number..."
                        />
                    </View>
                    <FilterDropdown
                        options={hotlineTypes}
                        selected={filterType}
                        onSelect={setFilterType}
                    />
                    </View>
    
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
                        {filteredHotlines.length > 0 ? (
                            filteredHotlines.map((hotline) => (
                                <HotlineCard
                                    key={hotline.id}
                                    id={hotline.id}
                                    type={hotline.type}
                                    municipality={hotline.municipality}
                                    contactNumber={hotline.contact_number}
                                    address={hotline.address}
                                    onCall={() => handleCall(hotline.contact_number)}
                                />
                            ))
                        ) : (
                            <Text style={styles.noResultsText}>No matching hotlines found.</Text>
                        )}
                    </Animated.ScrollView>
                </>
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
    placeholder: {
        width: 40,
    },
    sectionTitle: {
        paddingTop: 16,
        fontSize: 22,
        fontWeight: "900",
        color: "#1c5461",
        marginBottom: 6,
        paddingHorizontal: 16,
      },
    searchFilterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#f8fafc',
      },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    addressText: {
        fontSize: 13,
        color: '#475569',
        marginLeft: 5,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    municipalitySection: {
        marginBottom: 24,
    },
    municipalityHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    card: {
        backgroundColor: '#f8fcfd',
        borderRadius: 18,
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 2,
    },
    cardContent: {
        flex: 1,
        paddingRight: 8,
    },
    cardDetails: {
        flex: 1,
        gap: 6,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1c5461',
        marginBottom: 2,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactNumber: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 5,
    },
    municipalityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    municipalityText: {
        fontSize: 11,
        color: '#ffffff',
        fontWeight: '500',
    },
    cardActions: {
        marginLeft: 8,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    callButton: {
        backgroundColor: '#22c55e',
    },
});


