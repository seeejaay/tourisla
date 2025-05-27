// app/admin_announcement_edit.tsx
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
}

export default function AdminAnnouncementEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Use this if you're not using dynamic routing
  const { id } = params;

  const {
    viewAnnouncement,
    updateAnnouncement,
    loading,
    error,
    setError,
  } = useAnnouncementManager();

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
        _id: data._id || "",
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
        id: announcement._id,
        title: announcement.title,
        description: announcement.description,
        location: announcement.location,
        category: announcement.category,
        date_posted: new Date().toISOString(),
      });

      if (updated) {
        alert("Announcement updated successfully!");
        router.push("/admin_announcements");
      }
    } catch (err) {
      setError("Failed to update announcement.");
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
        <Pressable onPress={loadAnnouncement} className="bg-blue-500 p-3 rounded mt-4">
          <Text className="text-white text-center font-bold">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {announcement && (
        <>
          <Text className="text-2xl font-bold mb-4">Edit Announcement</Text>

          <Text className="font-bold mb-2">Title</Text>
          <TextInput
            value={announcement.title}
            onChangeText={(text) =>
              setAnnouncement((prev) => (prev ? { ...prev, title: text } : null))
            }
            editable={!loading}
            className="border border-gray-300 rounded p-2 mb-4"
          />

          <Text className="font-bold mb-2">Description</Text>
          <TextInput
            value={announcement.description}
            onChangeText={(text) =>
              setAnnouncement((prev) => (prev ? { ...prev, description: text } : null))
            }
            editable={!loading}
            className="border border-gray-300 rounded p-2 mb-4"
            multiline
          />

          <Text className="font-bold mb-2">Location</Text>
          <TextInput
            value={announcement.location}
            onChangeText={(text) =>
              setAnnouncement((prev) => (prev ? { ...prev, location: text } : null))
            }
            editable={!loading}
            className="border border-gray-300 rounded p-2 mb-4"
          />

          <Text className="font-bold mb-2">Category</Text>
          <TextInput
            value={announcement.category}
            onChangeText={(text) =>
              setAnnouncement((prev) => (prev ? { ...prev, category: text } : null))
            }
            editable={!loading}
            className="border border-gray-300 rounded p-2 mb-4"
          />

          <Pressable onPress={handleUpdate} className="bg-blue-500 p-3 rounded">
            <Text className="text-white text-center font-bold">Save Changes</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/admin_announcements")}
            className="bg-gray-500 p-3 rounded mt-4"
          >
            <Text className="text-white text-center font-bold">Cancel</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
