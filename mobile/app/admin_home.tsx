import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { currentUser } from '@/lib/api';

export default function AdminHomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await currentUser();
        console.log("Fetched user data:", data); // <--- Add this
        setUser(data);
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <Text>Loading user...</Text>;
  }

  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Welcome, {user.first_name}!
      </Text>
      <Text className="text-base text-gray-600">
        This is your home screen. You can show app summaries, stats, or recent activity here.
      </Text>
    </View>
  );
}
