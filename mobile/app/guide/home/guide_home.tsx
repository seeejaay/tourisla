import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '@/lib/api/auth';

export default function TouristHome() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  
  // Get user name from AsyncStorage
  useEffect(() => {
    const getUserName = async () => {
      try {
        const user = await auth.getCurrentUser();
        if (user && user.name) {
          setUserName(user.name.split(' ')[0]); // Get first name
        }
      } catch (error) {
        console.error('Error getting user name:', error);
      }
    };
    
    getUserName();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome{userName ? `, ${userName}` : ''}!
          </Text>
          <Text style={styles.welcomeSubtext}>
            Discover the beauty of Cebu
          </Text>
        </View>
        
        {/* Content will be added here */}
      </ScrollView>
      
      {/* Weather FAB Button */}
      <TouchableOpacity 
        style={styles.weatherFab}
        onPress={() => router.push('/guide/weather')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80 // Extra padding for FAB
  },
  welcomeSection: {
    marginBottom: 20
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4
  },
  weatherFab: {
    position: 'absolute',
    bottom: 120, // Increased from 20 to 80 to lift it above the bottom navbar
    left: 20,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  }
});
