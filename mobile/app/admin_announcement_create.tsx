import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { Ionicons } from '@expo/vector-icons'; // Importing icons from expo/vector-icons

export default function AdminAnnouncementCreateScreen() {
  const router = useRouter();
  const { createAnnouncement } = useAnnouncementManager(); // Use the hook
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location || !form.category) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
  
    console.log('Form data being submitted:', form);
  
    try {
      const announcementData = {
        ...form,
        date_posted: new Date().toISOString(), // Add the required date_posted field
      };
  
      await createAnnouncement(announcementData); // Use the hook's method
      Alert.alert('Success', 'Announcement created!');
      router.push('/admin_announcements');
    } catch (err) {
      console.error('Error creating announcement:', err);
      Alert.alert('Error', 'Failed to create announcement.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#f3f4f6', padding: 24 }}>
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            zIndex: 10,
            backgroundColor: '#007dab',
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
          <View style={{ backgroundColor: 'white', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, padding: 24, width: '100%', maxWidth: 400 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#1f2937', marginBottom: 24, textAlign: 'center' }}>Create Announcement</Text>

            <TextInput
              placeholder="Title"
              style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 16, marginBottom: 16, borderRadius: 10, color: '#374151' }}
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
            <TextInput
              placeholder="Description"
              style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 16, marginBottom: 16, borderRadius: 10, color: '#374151' }}
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
              multiline
              numberOfLines={4}
            />
            <TextInput
              placeholder="Location"
              style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 16, marginBottom: 16, borderRadius: 10, color: '#374151' }}
              value={form.location}
              onChangeText={(text) => handleChange('location', text)}
            />
            <TextInput
              placeholder="Category"
              style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 16, marginBottom: 16, borderRadius: 10, color: '#374151' }}
              value={form.category}
              onChangeText={(text) => handleChange('category', text)}
            />

            <Pressable
              style={{ backgroundColor: '#007dab', padding: 16, borderRadius: 10 }}
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
