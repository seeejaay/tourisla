import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { Ionicons } from "@expo/vector-icons";

interface Announcement {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
}

export default function AdminAnnouncementEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const { viewAnnouncement, updateAnnouncement, loading, error, setError } =
    useAnnouncementManager();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const loadAnnouncement = async () => {
    if (!id || typeof id !== "string") {
      setError("Invalid announcement ID.");
      return;
    }

    try {
      const data = await viewAnnouncement(id);
      if (!data) throw new Error("Invalid data");

      setAnnouncement({
        id: data.id || "",
        title: data.title || "",
        description: data.description || "",
        location: data.location || "",
        category: data.category || "",
      });
    } catch (err) {
      setError("Failed to load announcement.");
    }
  };

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  const handleUpdate = async () => {
    if (!announcement) return;

    try {
      const updated = await updateAnnouncement({
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        location: announcement.location,
        category: announcement.category,
        date_posted: new Date().toISOString(),
      });

      if (updated) {
        Alert.alert("Success", "Announcement updated successfully!");
        router.push("/admin_announcements");
      }
    } catch (err) {
      setError("Failed to update announcement.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007dab" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={loadAnnouncement} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <View style={styles.formContainer}>
          <Text style={styles.heading}>Edit Announcement</Text>

          <TextInput
            placeholder="Title"
            style={styles.input}
            value={announcement?.title}
            onChangeText={(text) =>
              setAnnouncement((prev) =>
                prev ? { ...prev, title: text } : null
              )
            }
          />
          <TextInput
            placeholder="Description"
            style={[styles.input, styles.textArea]}
            value={announcement?.description}
            onChangeText={(text) =>
              setAnnouncement((prev) =>
                prev ? { ...prev, description: text } : null
              )
            }
            multiline
            numberOfLines={4}
          />
          <TextInput
            placeholder="Location"
            style={styles.input}
            value={announcement?.location}
            onChangeText={(text) =>
              setAnnouncement((prev) =>
                prev ? { ...prev, location: text } : null
              )
            }
          />
          <TextInput
            placeholder="Category"
            style={styles.input}
            value={announcement?.category}
            onChangeText={(text) =>
              setAnnouncement((prev) =>
                prev ? { ...prev, category: text } : null
              )
            }
          />

          <Pressable style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#007dab",
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 16,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1f2937",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    color: "#374151",
    fontSize: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007dab",
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#007dab",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007dab",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
});