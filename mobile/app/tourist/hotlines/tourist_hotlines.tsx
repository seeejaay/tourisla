import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Animated,
  Linking,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { fetchHotlines } from '../../../lib/api/hotline';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Hotline {
    id: number;
    municipality: string;
    type: string;
    contact_number: string;
    address?: string;
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

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    // Get background color based on type
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

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Emergency Contacts</Text>
                </View>

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
                            <Text style={styles.emptySubtext}>Please check back later for emergency contacts</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                            <Text style={styles.sectionSubtitle}>Important contacts for emergency situations</Text>
                            
                            {/* Group hotlines by municipality */}
                            {["BANTAYAN", "SANTA_FE", "MADRIDEJOS"].map(municipality => {
                                const municipalityHotlines = hotlines.filter(h => h.municipality === municipality);
                                if (municipalityHotlines.length === 0) return null;
                                
                                return (
                                    <View key={municipality} style={styles.municipalitySection}>
                                        <Text style={styles.municipalityTitle}>
                                            {formatMunicipality(municipality)}
                                        </Text>
                                        
                                        {municipalityHotlines.map((hotline) => {
                                            const typeColor = getTypeColor(hotline.type);
                                            const iconName = getHotlineIcon(hotline.type);
                                            const formattedType = hotline.type.replace(/_/g, " ");
                                            
                                            return (
                                                <View key={hotline.id} style={styles.card}>
                                                    <View style={styles.cardContent}>
                                                        <View style={[styles.iconContainer, { backgroundColor: `${typeColor}20` }]}>
                                                            <MaterialCommunityIcons name={iconName} size={24} color={typeColor} />
                                                        </View>
                                                        
                                                        <View style={styles.cardDetails}>
                                                            <View style={styles.cardHeader}>
                                                                <Text style={styles.cardTitle}>{formattedType}</Text>
                                                            </View>
                                                            
                                                            <View style={styles.contactRow}>
                                                                <MaterialCommunityIcons name="phone" size={16} color="#64748b" />
                                                                <Text style={styles.contactNumber}>{hotline.contact_number}</Text>
                                                            </View>
                                                            
                                                            {hotline.address && (
                                                                <View style={styles.addressRow}>
                                                                    <MaterialCommunityIcons name="map-marker" size={16} color="#64748b" />
                                                                    <Text style={styles.addressText}>{hotline.address}</Text>
                                                                </View>
                                                            )}
                                                            
                                                            <TouchableOpacity 
                                                                style={[styles.callButton, { backgroundColor: typeColor }]}
                                                                onPress={() => handleCall(hotline.contact_number)}
                                                            >
                                                                <MaterialCommunityIcons name="phone" size={16} color="#FFFFFF" />
                                                                <Text style={styles.callButtonText}>Call Now</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
                            })}
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
        backgroundColor: '#007dab',
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
    municipalitySection: {
        marginBottom: 20,
    },
    municipalityTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#334155',
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
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactNumber: {
        fontSize: 15,
        color: "#334155",
        marginLeft: 8,
        fontWeight: '500',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    addressText: {
        fontSize: 14,
        color: "#64748b",
        marginLeft: 8,
        flex: 1,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 4,
    },
    callButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 6,
    },
});
