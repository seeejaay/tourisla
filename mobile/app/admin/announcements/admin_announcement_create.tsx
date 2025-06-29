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
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
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

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

export default function AdminAnnouncementCreateScreen() {
  const router = useRouter();
  const { createAnnouncement } = useAnnouncementManager();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: ANNOUNCEMENT_CATEGORIES[0], // Default to first category
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location || !form.category) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      // Create FormData object for multipart/form-data submission
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('location', form.location.trim());
      formData.append('category', form.category);
      formData.append('date_posted', new Date().toISOString().slice(0, 10));
      
      // Append image if selected
      if (image) {
        const imageUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
        const filename = image.uri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }
  
      const result = await createAnnouncement(formData);
      if (result) {
        Alert.alert('Success', 'Announcement created!');
        router.replace("/admin/admin_dashboard");
      } else {
        Alert.alert('Error', 'Failed to create announcement.');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      Alert.alert('Error', 'Failed to create announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Create Announcement</Text>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="Enter title"
              style={styles.input}
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Enter description"
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              placeholder="Enter location"
              style={styles.input}
              value={form.location}
              onChangeText={(text) => handleChange('location', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.category}
                onValueChange={(value) => handleChange('category', value)}
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
                {image ? 'Change Image' : 'Select Image'}
              </Text>
            </Pressable>
            
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
          </View>

          <Pressable
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Creating...' : 'Create Announcement'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
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
    fontWeight: '500',
    marginBottom: 6,
    color: '#4b5563',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
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
    backgroundColor: '#38bdf8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0d3e8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
