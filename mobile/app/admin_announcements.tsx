// app/admin_announcements.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
}
import { fetchAnnouncements } from '../lib/api';

export default function AdminAnnouncementsScreen() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to fetch announcements', err);
      }
    };
    loadData();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Pressable
        className="bg-green-500 p-3 mb-4 rounded"
        onPress={() => router.push('/admin_announcement_create')}
      >
        <Text className="text-white text-center font-bold">+ Create Announcement</Text>
      </Pressable>

      {announcements.map((item) => (
        <View key={item._id} className="mb-3 p-3 border border-gray-300 rounded">
          <Text className="font-bold">{item.title}</Text>
          <Text>{item.description}</Text>
          <Text className="italic text-sm text-gray-500">{item.location} | {item.category}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
