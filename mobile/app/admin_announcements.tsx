import { View, Text, ScrollView, Pressable, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { fetchAnnouncements} from '../lib/api/announcement';

interface Announcement {
    _id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    date_posted: string; // Assuming this is a string in ISO format
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

export default function AdminAnnouncementsScreen() {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAnnouncements();
                setAnnouncements(data);
            } catch (err) {
                console.error('Failed to fetch announcements', err);
            }
        };
        loadData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Announcements</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
            >
                {announcements.map((item) => (
                    <View key={item._id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Pressable
                                onPress={() => router.push(`/admin_announcement_edit?id=${item._id}`)}
                                style={styles.editButton}
                            >
                                <Icon name="edit-3" size={18} color="#ffffff" />
                            </Pressable>
                        </View>

                        <Text style={styles.cardDescription}>{item.description}</Text>

                        <Text style={styles.cardFooter}>
                            {item.location} | {item.category}
                        </Text>
                    </View>
                ))}

            </ScrollView>

            <Pressable
                style={styles.fab}
                onPress={() => router.push('/admin_announcement_create')}
            >
                <Icon name="plus" size={24} color="#007dab" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 50 + STATUS_BAR_HEIGHT,
        backgroundColor: '#007dab',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: STATUS_BAR_HEIGHT,
        paddingHorizontal: 20,
        zIndex: 50,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#ecf0f1',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    scrollView: {
        flex: 1,
        marginTop: 60 + STATUS_BAR_HEIGHT, // Adjust for header height
    },
    contentContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    editButton: {
        backgroundColor: '#3b82f6',
        padding: 6,
        borderRadius: 6,
    },
    cardDescription: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 4,
    },
    cardFooter: {
        fontSize: 12,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#1c2b38',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});
