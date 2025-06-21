import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '@/lib/api/auth';
import { fetchGuidePackages } from '@/lib/api/guidePackages';

export default function GuideHome() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedPackages, setAssignedPackages] = useState([]);
  const [userData, setUserData] = useState(null);
  
  // Get user data and assigned packages
  useEffect(() => {
    const getUserDataAndPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user data
        const response = await auth.currentUser();
        
        let userData = null;
        if (response && response.data && response.data.user) {
          userData = response.data.user;
        } else if (response && response.user) {
          userData = response.user;
        } else if (response && response.data) {
          userData = response.data;
        } else if (typeof response === 'object' && response !== null) {
          userData = response;
        }
        
        setUserData(userData);
        
        if (userData && userData.name) {
          setUserName(userData.name.split(' ')[0]);
        } else if (userData && userData.first_name) {
          setUserName(userData.first_name);
        } else if (userData && userData.email) {
          setUserName(userData.email.split('@')[0]);
        }
        
        // Get user ID
        const userId = userData.id || userData.user_id;
        console.log('User ID:', userId);
        
        if (!userId) {
          throw new Error('User ID not found');
        }
        
        // Get packages using the new API function
        const packages = await fetchGuidePackages(userId);
        
        // Ensure packages is an array
        const packagesArray = Array.isArray(packages) ? packages : [packages].filter(Boolean);
        
        setAssignedPackages(packagesArray);
        
        // Save to local storage for offline access
        await AsyncStorage.setItem('guideAssignedPackages', JSON.stringify(packagesArray));
        
      } catch (error) {
        console.error('Error fetching guide data and packages:', error);
        setError('Failed to load your assigned tour packages');
        
        // Try to load from local storage as fallback
        try {
          const storedPackagesStr = await AsyncStorage.getItem('guideAssignedPackages');
          if (storedPackagesStr) {
            const storedPackages = JSON.parse(storedPackagesStr);
            setAssignedPackages(storedPackages);
          }
        } catch (storageError) {
          console.error('Error loading from storage:', storageError);
        }
      } finally {
        setLoading(false);
      }
    };
  
    getUserDataAndPackages();
  }, []);
  
  
  const renderPackageItem = ({ item }) => (
    <TouchableOpacity style={styles.packageCard} onPress={() => router.push(`/guide/packages/${item.id}`)}>
      <Text style={styles.packageName}>{item.package_name}</Text>
      <Text style={styles.packageDetails}>Location: {item.location}</Text>
      <Text style={styles.packageDetails}>Price: ₱{item.price}</Text>
      <Text style={styles.packageDetails}>Duration: {item.duration_days} day(s)</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome{userName ? `, ${userName}` : ""}!</Text>
          <Text style={styles.welcomeSubtext}>Discover the beauty of Cebu</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Assigned Tour Packages</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
  },
  packagesList: {
    paddingVertical: 8,
  },
  packageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  packageName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  packageDetails: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
});

