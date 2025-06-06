import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { Ionicons } from '@expo/vector-icons'; // Importing icons from expo/vector-icons
import { Picker } from '@react-native-picker/picker'; // Import Picker

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

export default function AdminAnnouncementCreateScreen() {
  const router = useRouter();
  const { createAnnouncement } = useAnnouncementManager(); // Use the hook
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: ANNOUNCEMENT_CATEGORIES[0], // Default to first category
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location || !form.category) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
  
    try {
      const announcementData = {
        title: form.title,
        description: form.description,
        location: form.location,
        category: form.category,
        date_posted: new Date().toISOString().slice(0, 10),
      };
  
      const result = await createAnnouncement(announcementData);
      if (result) {
        Alert.alert('Success', 'Announcement created!');
        router.replace({
          pathname: "/admin/admin_dashboard",
          params: { tab: "Announcements" }, // Make sure this matches your tab logic
        });
      } else {
        Alert.alert('Error', 'Failed to create announcement.');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      Alert.alert('Error', 'Failed to create announcement.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 16 }}>
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            zIndex: 10,
            backgroundColor: '#0f172a',
            borderRadius: 50,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, padding: 16, width: '100%', maxWidth: 400 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#1f2937', marginBottom: 24, textAlign: 'center' }}>Create Announcement</Text>

            <TextInput
              placeholder="Title"
              style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, marginBottom: 10, borderRadius: 10, color: '#374151' }}
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
            <TextInput
              placeholder="Description"
              style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, marginBottom: 10, borderRadius: 10, color: '#374151', height: 120, textAlignVertical: 'top' }}
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
              multiline
              numberOfLines={4}
            />
            <TextInput
              placeholder="Location"
              style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, marginBottom: 10, borderRadius: 10, color: '#374151' }}
              value={form.location}
              onChangeText={(text) => handleChange('location', text)}
            />
            
            {/* Category Dropdown */}
            <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
              <Picker
                selectedValue={form.category}
                onValueChange={(value) => handleChange('category', value)}
                style={{ color: '#374151' }}
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

            <Pressable
              style={{ backgroundColor: '#38bdf8', padding: 16, borderRadius: 10 }}
              onPress={handleSubmit}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
