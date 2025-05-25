import { View, Text } from 'react-native';

export default function UsersHomeScreen() {
  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      <Text className="text-2xl font-bold text-gray-800 mb-4"></Text>
      <Text className="text-base text-gray-600">
        This is your home screen. You can show app summaries, stats, or recent activity here.
      </Text>
    </View>
  );
}
