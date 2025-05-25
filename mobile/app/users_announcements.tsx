import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { getAnnouncements } from '@/lib/api';

export default function UsersAnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAnnouncements();
      setAnnouncements(data);
    };

    fetchAnnouncements();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-blue-700 mb-4">📢 Announcements</Text>
      {announcements.length === 0 ? (
        <Text className="text-gray-500">No announcements available.</Text>
      ) : (
        announcements.map((a) => (
          <View key={a._id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
            <Text className="font-semibold text-lg">{a.title || 'Untitled'}</Text>
            <Text className="text-gray-700 mt-1">{a.message}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
