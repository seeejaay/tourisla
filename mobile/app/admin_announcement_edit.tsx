// app/admin_announcement_edit.tsx
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchAnnouncementById, updateAnnouncement } from '../lib/api';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
}

export default function AdminAnnouncementEditScreen() {
  const router = useRouter();
  const { id } = useSearchParams(); // Get the announcement ID from the route params
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        setLoading(true);
        const data = await fetchAnnouncementById(id as string); // Fetch the announcement by ID
        setAnnouncement(data);
      } catch (err) {
        console.error("Failed to fetch announcement", err);
        setError("Failed to load announcement.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAnnouncement();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!announcement) return;

    try {
      setLoading(true);
      await updateAnnouncement(announcement._id, announcement); // Update the announcement
      alert("Announcement updated successfully!");
      router.push('/admin_announcements'); // Navigate back to the announcements list
    } catch (err) {
      console.error("Failed to update announcement", err);
      setError("Failed to update announcement.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Edit Announcement</Text>

      {announcement && (
        <>
          <Text className="font-bold mb-2">Title</Text>
          <TextInput
            value={announcement.title}
            onChangeText={(text) =>
              setAnnouncement((prev) => prev && { ...prev, title: text })
            }
            className="border border-gray-300 rounded p-2 mb-4"
          />

          <Text className="font-bold mb-2">Description</Text>
          <TextInput
            value={announcement.description}
            onChangeText={(text) =>
              setAnnouncement((prev) => prev && { ...prev, description: text })
            }
            className="border border-gray-300 rounded p-2 mb-4"
            multiline
          />

          <Text className="font-bold mb-2">Location</Text>
          <TextInput
            value={announcement.location}
            onChangeText={(text) =>
              setAnnouncement((prev) => prev && { ...prev, location: text })
            }
            className="border border-gray-300 rounded p-2 mb-4"
          />

          <Text className="font-bold mb-2">Category</Text>
          <TextInput
            value={announcement.category}
            onChangeText={(text) =>
              setAnnouncement((prev) => prev && { ...prev, category: text })
            }
            className="border border-gray-300 rounded p-2 mb-4"
          />

          <Pressable
            onPress={handleUpdate}
            className="bg-blue-500 p-3 rounded"
          >
            <Text className="text-white text-center font-bold">Save Changes</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/admin_announcements')}
            className="bg-gray-500 p-3 rounded mt-4"
          >
            <Text className="text-white text-center font-bold">Cancel</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}