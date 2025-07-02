import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from '@expo/vector-icons';

export default function FloatingActionMenu() {
  const router = useRouter();

  return (
    <>
      {/* Weather */}
      <TouchableOpacity
        style={[styles.fabButton, { bottom: Platform.OS === 'ios' ? 140 : 120 }]}
        onPress={() => router.push('/tourist/weather')}
      >
        <MaterialCommunityIcons name="weather-partly-cloudy" size={22} color="white" />
      </TouchableOpacity>

      {/* Announcements */}
      <TouchableOpacity
        style={[styles.fabButton, { bottom: Platform.OS === 'ios' ? 80 : 64 }]}
        onPress={() => router.push('/tourist/announcements/tourist_announcements')}
      >
        <FontAwesome5 name="bullhorn" size={18} color="white" />
      </TouchableOpacity>

      {/* Hotlines */}
      <TouchableOpacity
        style={[styles.fabButton, { bottom: Platform.OS === 'ios' ? 24 : 16 }]}
        onPress={() => router.push('/tourist/profile/about/hotlines/tourist_hotlines')}
      >
        <Feather name="phone-call" size={20} color="white" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#34cfc7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 9999,
  },
});
