import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { currentUser } from '@/lib/api'; // adjust if your path is different
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '@react-navigation/elements';
import { logoutUser as logout } from '@/lib/api';


export default function UsersHomeScreen() {
  const [user, setUser] = useState(null); // user data
  const [loading, setLoading] = useState(true); // loading indicator
  const [error, setError] = useState(""); // error handling

  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully");
      setShowMenu(false);
  
      // Navigate to login screen
      router.replace('/login'); // or your login route
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to log out");
    }
  };

  const handleEditProfile = () => {
    alert("Navigate to Edit Profile");
    setShowMenu(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await currentUser();
        const user = res.data.user; // adjust based on your API response structure
        console.log("Fetched user:", res.data.user);
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
    <View className="flex-1 bg-white relative">
      {/* Top Right Burger Menu */}
      <View className="bg-white px-4 pt-6 pb-2 border-b border-gray-300 relative z-10">
        {/* Burger Menu Button */}
        <View className="flex-row justify-between items-center">
          <Text className="text-black text-xl font-semibold">My Profile</Text>
          <TouchableOpacity onPress={handleMenuToggle} className="p-2">
            <FontAwesome name="bars" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu inside yellow area */}
        {showMenu && (
          <View className="absolute top-14 right-4 bg-white rounded-xl shadow-xl border border-gray-100 w-48 z-20">

            <TouchableOpacity
              onPress={handleEditProfile}
              className="flex-row items-center px-4 py-3 gap-x-2 hover:bg-gray-50 active:bg-gray-100 rounded-t-xl"
            >
              <FontAwesome name="cog" size={18} color="#4B5563" />
              <Text className="text-gray-700 text-base font-medium">Settings</Text>
            </TouchableOpacity>

            <View className="border-t border-gray-100" />

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center px-4 py-3 gap-x-2 hover:bg-gray-50 active:bg-gray-100 rounded-b-xl"
            >
              <FontAwesome name="sign-out" size={18} color="#EF4444" />
              <Text className="text-red-500 text-base font-medium">Log Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
  
      {user && (
        <View className="items-center m-6 bg-gray-100 p-4 rounded-2xl border border-gray-300 shadow-xl">
          {/* Profile Picture */}
            <View className="w-32 h-32 rounded-full bg-gray-200 mt-2 mb-4 justify-center items-center border-2 border-gray-300">
            <FontAwesome name="user" size={90} color="#6B7280" />
            </View>
  
          {/* Welcome Message */}
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {user.first_name || user.email}
          </Text>
          <Text className="text-sm text-gray-500 mb-6">
            {user.email}
          </Text>
          {/* Card: User Details */}
        </View>
      )}
      {user && (
        <View className="flex-1 bg-white p-6 shadow-sm shadow-lg border-t border-gray-300">
            <Button
              style={{
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 5,
                boxShadowColor: 'black',
                marginBottom: 10,
                borderWidth: 1,
              }}
            >
            <Text style={{ color: 'black', fontWeight: 'bold' }}>Edit Profile</Text>
            </Button>
            
            <Text className="text-xl font-black text-water mb">
              User Information
            </Text>
            <View className="mb py-3 border-b border-gray-200">
              <Text className="text-black font-bold text-lg">{user.phone_number || "N/A"}</Text>
              <Text className="text-gray-600 text-sm">Phone number</Text>
            </View>
            <View className="mb py-3">
              <Text className="text-black font-bold text-lg">{user.role}</Text>
              <Text className="text-gray-600 text-sm">Role</Text>
            </View>

          </View>
      )}

    </View>
  );
  
  
}
