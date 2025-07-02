import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

export default function FloatingActionMenu() {
  const router = useRouter();

  return (
    <View style={styles.fabContainer}>
      <View
        style={styles.iconButton}
        onPress={() => router.push('/tourist/weather')}
      >
        <MaterialCommunityIcons name="weather-partly-cloudy" size={20} color="white" />
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push('/tourist/announcements/tourist_announcements')}
      >
        <FontAwesome5 name="bullhorn" size={18} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push('/tourist/profile/about/hotlines/tourist_hotlines')}
      >
        <Feather name="phone-call" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 24,
        left: 16,
        width: 56,
        backgroundColor: '#34cfc7',
        borderRadius: 28,
        alignItems: 'center',
        zIndex: 9999,
        elevation: 6,
      },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34cfc7',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
});
