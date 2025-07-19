import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, 
  ScrollView, RefreshControl, ActivityIndicator, 
  Platform, Animated, Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as auth from '@/lib/api/auth';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import PersonalInfoCard from '@/components/profile/PersonalInfoCard';

const { width } = Dimensions.get('window');

const formatNameWords = (name) => {
  if (!name) return '';
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function TouristProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused, fetchUser]);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setUser(null);
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setTimeout(() => setUser(parsedData), 100);
      }
      const response = await auth.currentUser();
      let userData = null;
      if (response.data?.user) userData = response.data.user;
      else if (response.user) userData = response.user;
      else if (response.data) userData = response.data;
      else if (typeof response === 'object') userData = response;

      if (userData) {
        if (storedUserData) {
          const parsedStored = JSON.parse(storedUserData);
          if (parsedStored.profile_image) userData.profile_image = parsedStored.profile_image;
          if (parsedStored.avatar) userData.avatar = parsedStored.avatar;
          if (parsedStored.first_name) userData.first_name = parsedStored.first_name;
          if (parsedStored.last_name) userData.last_name = parsedStored.last_name;
          if (parsedStored.phone_number) userData.phone_number = parsedStored.phone_number;
          if (parsedStored.nationality) userData.nationality = parsedStored.nationality;
        }
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
      } else {
        setError("Invalid user data format received from server.");
      }
    } catch (err) {
      setError("Failed to fetch user data. " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkProfileUpdate = async () => {
        try {
          const wasUpdated = await AsyncStorage.getItem('profileUpdated');
          if (wasUpdated === 'true') {
            fetchUser();
            await AsyncStorage.setItem('profileUpdated', 'false');
          }
        } catch (error) {
          console.error("Error checking profile update status:", error);
        }
      };
      checkProfileUpdate();
      return () => {};
    }, [fetchUser])
  );

  useEffect(() => {
    fetchUser();
  }, [params.refresh, fetchUser]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUser();
  }, [fetchUser]);

  const handleSettings = () => {
    router.push('/tourist/profile/settings');
  };

  const actions = [
    { icon: 'qrcode', label: 'My QR Code', route: '/tourist/profile/qr', color: ['#fef08a', '#fde68a'], size: 'large' },
    { icon: 'map-pin', label: 'Visit History', route: '/tourist/history/visits', color: ['#bae6fd', '#e0f2fe'], size: 'small' },
    { icon: 'calendar', label: 'Booking History', route: '/tourist/history/bookings', color: ['#fbcfe8', '#fce7f3'], size: 'small' },
    { icon: 'book-open', label: 'Brochure', route: '/tourist/brochure', color: ['#bbf7d0', '#dcfce7'], size: 'medium' },
    { icon: 'users', label: 'Tour Guides', route: '/tourist/guides', color: ['#ddd6fe', '#ede9fe'], size: 'medium' },
    { icon: 'image', label: 'Tourist Spots', route: '/tourist/spots', color: ['#fecaca', '#fee2e2'], size: 'full' },
  ];

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#38bdf8" /></View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f8fafc', '#f8fafc']} //colors={['#44eebb', '#13404d']}  
        start={{ x: 1, y: 2 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Animated.View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleSettings} style={styles.menuButton}>
            <Feather name="menu" size={24} color="#0f172a" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: scrollY } } }
        ], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {user && (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.storyRing}>
                {user.profile_image ? (
                  <Image source={{ uri: user.profile_image }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Text style={styles.profileImageInitials}>
                      {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.displayName}>{formatNameWords(user.first_name)} {formatNameWords(user.last_name)}</Text>
              <Text style={styles.displayRole}>{formatNameWords(user.email)}</Text>
            </View>

            <PersonalInfoCard user={user} />
            <View style={styles.sectionDivider} />
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60 + STATUS_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 20,
    zIndex: 50,
    borderWidth: 1,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60 + STATUS_BAR_HEIGHT,
    zIndex: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(230, 247, 250,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 65 + STATUS_BAR_HEIGHT,
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 15,
  },
  storyRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: '#64c5a5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#64c5a5',
  },
  displayName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  displayRole: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  sectionDivider: {
    height: 10,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});
