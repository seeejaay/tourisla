import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { createAnnouncement } from '../lib/api';
import { Ionicons } from '@expo/vector-icons'; // Importing icons from expo/vector-icons

export default function AdminAnnouncementCreateScreen() {
  const router = useRouter();
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
    try {
      await createAnnouncement(form);
      Alert.alert('Success', 'Announcement created!');
      router.push('/admin_announcements');
    } catch (err) {
      console.error('Error creating announcement:', err);
      Alert.alert('Error', 'Failed to create announcement.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-gray-100 p-6">
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

        <View className="flex-1 justify-center items-center">
          <View className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <Text className="text-2xl font-black text-gray-800 mb-6 text-center">Create Announcement</Text>

            <TextInput
              placeholder="Title"
              className="border border-gray-300 p-4 mb-4 rounded-lg text-gray-700"
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
            <TextInput
              placeholder="Description"
              className="border border-gray-300 p-4 mb-4 rounded-lg text-gray-700"
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
              multiline
              numberOfLines={4}
            />
            <TextInput
              placeholder="Location"
              className="border border-gray-300 p-4 mb-4 rounded-lg text-gray-700"
              value={form.location}
              onChangeText={(text) => handleChange('location', text)}
            />
            <TextInput
              placeholder="Category"
              className="border border-gray-300 p-4 mb-4 rounded-lg text-gray-700"
              value={form.category}
              onChangeText={(text) => handleChange('category', text)}
            />

            <Pressable
              style={{ backgroundColor: '#007dab' }}
              className="p-4 rounded-xl"
              onPress={handleSubmit}
            >
              <Text className="text-white text-center font-bold text-lg">Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
