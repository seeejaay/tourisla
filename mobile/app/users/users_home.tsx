import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { currentUser } from '@/lib/api'; // adjust if your path is different

export default function UsersHomeScreen() {
  const [user, setUser] = useState(null); // user data
  const [loading, setLoading] = useState(true); // loading indicator
  const [error, setError] = useState(""); // error handling

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await currentUser();
        const user = res.data.user; // adjust based on your API response structure
        setUser(user);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00ADEF" />
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
    <View className="flex-1 bg-red-500">
      {user && (
        <View className="flex-1 items-center p-6">
          {/* Profile Picture */}
          <View className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
            {/* Placeholder for profile picture */}
            <Text className="text-center text-gray-500 text-lg leading-24">P</Text>
          </View>

          {/* Welcome Message */}
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {user.first_name || user.email}
          </Text>
          <Text className="text-gray-500 mb-6">Welcome to your profile</Text>

          {/* User Details */}
          <View className="w-full bg-gray-100 rounded-lg p-4 shadow-md">
            <Text className="text-lg font-semibold text-gray-700 mb-4">User Details</Text>
            <View className="mb-3">
              <Text className="text-gray-600">
                <Text className="font-medium">Email:</Text> {user.email}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-gray-600">
                <Text className="font-medium">User ID:</Text> {user.id}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-gray-600">
                <Text className="font-medium">Phone Number:</Text> {user.phone_number || "N/A"}
              </Text>
            </View>
            <View>
              <Text className="text-gray-600">
                <Text className="font-medium">Role:</Text> {user.role}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
