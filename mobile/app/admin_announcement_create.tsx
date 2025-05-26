// app/admin_announcement_create.tsx
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { createAnnouncement } from '../lib/api';

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
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Create Announcement</Text>

      <TextInput
        placeholder="Title"
        className="border p-2 mb-3 rounded"
        value={form.title}
        onChangeText={(text) => handleChange('title', text)}
      />
      <TextInput
        placeholder="Description"
        className="border p-2 mb-3 rounded"
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
        multiline
      />
      <TextInput
        placeholder="Location"
        className="border p-2 mb-3 rounded"
        value={form.location}
        onChangeText={(text) => handleChange('location', text)}
      />
      <TextInput
        placeholder="Category"
        className="border p-2 mb-3 rounded"
        value={form.category}
        onChangeText={(text) => handleChange('category', text)}
      />

      <Pressable
        className="bg-blue-600 p-3 rounded"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-bold">Submit</Text>
      </Pressable>
    </ScrollView>
  );
}
