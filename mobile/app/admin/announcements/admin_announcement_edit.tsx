import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';

// Announcement categories from backend
const ANNOUNCEMENT_CATEGORIES = [
  'EVENTS',
  'FIESTA',
  'CULTURAL_TOURISM',
  'ENVIRONMENTAL_COASTAL',
  'HOLIDAY_SEASONAL',
  'GOVERNMENT_PUBLIC_SERVICE',
  'STORM_SURGE',
  'TSUNAMI',
  'GALE_WARNING',
  'MONSOON_LOW_PRESSURE',
  'RED_TIDE',
  'JELLYFISH_BLOOM',
  'FISH_KILL',
  'PROTECTED_WILDLIFE',
  'OIL_SPILL',
  'COASTAL_EROSION',
  'CORAL_BLEACHING',
  'HEAT_WAVE',
  'FLOOD_LANDSLIDE',
  'DENGUE_WATERBORNE',
  'POWER_INTERRUPTION',
];

interface Announcement {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date_posted?: string;
  image_url?: string;
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

export default function AdminAnnouncementEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const { viewAnnouncement, updateAnnouncement, loading, error, setError } =
    useAnnouncementManager();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [image, setImage] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        category: data.category || ANNOUNCEMENT_CATEGORIES[0],
        date_posted: data.date_posted || new Date().toISOString().split('T')[0],
        image_url: data.image_url || "",
      });
    } catch (err) {
      setError("Failed to load announcement.");
    }
  };

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    if (announcement) {
      setAnnouncement({
        ...announcement,
        [field]: value,
      });
    }
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    if (!announcement) return;

    // Validate required fields
    if (!announcement.title || !announcement.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
    
    if (!announcement.description || !announcement.description.trim()) {
      Alert.alert("Error", "Description is required");
      return;
    }
    
    if (!announcement.category || announcement.category.trim() === "") {
      Alert.alert("Error", "Category is required");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Starting update process...");
      
      // Try a simpler approach - use JSON instead of FormData
      const updateData = {
        title: announcement.title.trim(),
        description: announcement.description.trim(),
        location: announcement.location?.trim() || "GENERAL",
        category: announcement.category,
        date_posted: announcement.date_posted || new Date().toISOString().split('T')[0],
        image_url: announcement.image_url
      };
      
      // Only use FormData if we have a new image
      if (image) {
        console.log("Using FormData for image upload");
        const formData = new FormData();
        
        // Add all fields to FormData
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as string);
          }
        });
        
        // Add image to FormData
        try {
          const imageUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
          const filename = image.uri.split('/').pop() || 'image.jpg';
          const match = /\.(\w+)$/.exec(filename || '');
          const type = match ? `image/${match[1]}` : 'image/jpeg';
          
          formData.append('image', {
            uri: imageUri,
            name: filename,
            type,
          } as any);
          
          console.log("Image appended to FormData");
          
          // Use FormData for the update
          console.log("Calling updateAnnouncement with FormData");
          const updated = await updateAnnouncement(announcement.id, formData);
          
          if (updated) {
            handleSuccess(updated);
          } else {
            throw new Error("Update failed - server returned no data");
          }
        } catch (imageError) {
          console.error("Error with image upload:", imageError);
          Alert.alert(
            "Warning", 
            "There was an issue with the image upload. Would you like to continue without updating the image?",
            [
              {
                text: "Yes",
                onPress: async () => {
                  try {
                    // Try without image
                    const updated = await updateAnnouncement(announcement.id, updateData);
                    if (updated) {
                      handleSuccess(updated);
                    } else {
                      throw new Error("Update failed - server returned no data");
                    }
                  } catch (err) {
                    handleError(err);
                  } finally {
                    setIsSubmitting(false);
                  }
                }
              },
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setIsSubmitting(false)
              }
            ]
          );
          return; // Exit early to prevent further execution
        }
      } else {
        // No new image, use regular JSON update
        console.log("Calling updateAnnouncement with JSON data");
        const updated = await updateAnnouncement(announcement.id, updateData);
        
        if (updated) {
          handleSuccess(updated);
        } else {
          throw new Error("Update failed - server returned no data");
        }
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions to keep the main function cleaner
  const handleSuccess = (updated: any) => {
    console.log("Update successful:", updated);
    Alert.alert("Success", "Announcement updated successfully!", [
      {
        text: "OK",
        onPress: () => router.replace({
          pathname: "/admin/admin_dashboard", 
          params: { tab: "Announcements" },
        })
      }
    ]);
  };

  const handleError = (err: any) => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error updating announcement:", errorMessage);
    
    // Provide more helpful error messages based on error type
    let userMessage = "Failed to update announcement.";
    
    if (errorMessage.includes("Network Error")) {
      userMessage = "Network error. Please check your internet connection and try again.";
    } else if (errorMessage.includes("timeout")) {
      userMessage = "Request timed out. The server took too long to respond.";
    } else if (errorMessage.includes("HTTP Error")) {
      userMessage = "Server error. Please try again later.";
    }
    
    setError(userMessage);
    Alert.alert("Error", `${userMessage} ${errorMessage}`);
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
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Announcement</Text>
      </View>

      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Loading announcement...</Text>
        </View>
      ) : error ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadAnnouncement}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : !announcement ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>Announcement not found</Text>
          <Pressable style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                placeholder="Title"
                style={styles.input}
                value={announcement?.title}
                onChangeText={(text) => handleInputChange("title", text)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Description"
                style={[styles.input, styles.textArea]}
                value={announcement?.description}
                onChangeText={(text) => handleInputChange("description", text)}
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                placeholder="Location"
                style={styles.input}
                value={announcement?.location}
                onChangeText={(text) => handleInputChange("location", text)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={announcement?.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {ANNOUNCEMENT_CATEGORIES.map((category) => (
                    <Picker.Item 
                      key={category} 
                      label={category.replace(/_/g, " ")} 
                      value={category} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Image</Text>
              <Pressable style={styles.imagePicker} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color="#666" />
                <Text style={styles.imagePickerText}>
                  {image ? 'Change Image' : 'Select New Image'}
                </Text>
              </Pressable>
              
              {/* Show new selected image */}
              {image && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                  <Pressable 
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="close-circle" size={22} color="#ff4d4f" />
                  </Pressable>
                </View>
              )}
              
              {/* Show existing image if no new image is selected */}
              {!image && announcement?.image_url && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: announcement.image_url }} style={styles.imagePreview} />
                </View>
              )}
            </View>

            <Pressable 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
              onPress={handleUpdate}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#38bdf8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
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
    justifyContent: "flex-start",
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 50 + STATUS_BAR_HEIGHT,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#4b5563",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f9fafb",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    width: '100%',
  },
  picker: {
    width: '100%',
    fontSize: 14,
  },
  pickerItem: {
    fontSize: 14,
    textAlign: 'center',
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#f9fafb',
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  imagePreviewContainer: {
    marginTop: 12,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 2,
  },
  submitButton: {
    backgroundColor: "#38bdf8",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8, // Reduced from any larger value
  },
  submitButtonDisabled: {
    backgroundColor: "#a0d3e8",
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
