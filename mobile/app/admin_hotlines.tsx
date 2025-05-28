import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    StatusBar,
    Alert,
} from "react-native";
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchHotlines, deleteHotline } from "../lib/api/hotline";

interface Hotline {
    id: number;
    municipality: string;
    type: string;
    contact_number: string;
    address?: string;
}

const AdminHotlinesScreen = () => {
    const [hotlines, setHotlines] = useState<Hotline[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadHotlines();
    }, []);

    const loadHotlines = async () => {
        setLoading(true);
        try {
            const data = await fetchHotlines();
            setHotlines(data);
        } catch (err: any) {
            setError("Failed to fetch hotlines.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this hotline?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteHotline(id);
                        setHotlines(prev => prev.filter(h => h.id !== id));
                    } catch (err) {
                        Alert.alert("Error", "Failed to delete hotline.");
                    }
                },
            },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.header}>Hotlines Management</Text>

            {loading ? (
                <Text style={styles.message}>Loading...</Text>
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : hotlines.length === 0 ? (
                <Text style={styles.message}>No hotlines found.</Text>
            ) : (
                hotlines.map(hotline => (
                    <View key={hotline.id} style={styles.card}>
                        <Text style={styles.title}>{hotline.type} - {hotline.municipality}</Text>
                        <Text>📞 {hotline.contact_number}</Text>
                        {hotline.address ? <Text>🏠 {hotline.address}</Text> : null}

                        <View style={styles.actions}>
                            <Pressable
                                style={styles.editButton}
                                onPress={() => router.push({ pathname: "/admin_hotline_edit", params: { id: hotline.id.toString() } })}
                            >
                                <Text style={styles.actionText}>Edit</Text>
                            </Pressable>

                            <Pressable
                                style={styles.deleteButton}
                                onPress={() => handleDelete(hotline.id)}
                            >
                                <Text style={styles.actionText}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                ))
            )}

            <Pressable
                style={styles.createButton}
                onPress={() => router.push("/admin_hotline_create")}
            >
                <Text style={styles.createButtonText}>+ Create Hotline</Text>
            </Pressable>
        </ScrollView>
    );
};

export default AdminHotlinesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
    error: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    editButton: {
        backgroundColor: "#007bff",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    actionText: {
        color: "#fff",
        fontWeight: "bold",
    },
    createButton: {
        backgroundColor: "#28a745",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 24,
        marginBottom: 16,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
