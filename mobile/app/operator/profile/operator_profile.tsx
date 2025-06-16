import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, 
  ScrollView, RefreshControl, ActivityIndicator, 
  Platform, Animated, Alert, Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as auth from '@/lib/api/auth';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Add this helper function at the top of your component
const formatNameWords = (name) => {
  if (!name) return '';
  // Split the name by spaces and capitalize each word
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

  // Add this effect to force refresh when the screen is focused
  useEffect(() => {
    if (isFocused) {
      console.log("Screen is focused, refreshing data...");
      fetchUser();
    }
  }, [isFocused, fetchUser]);

  // Update the fetchUser function to clear any cached images
  const fetchUser = useCallback(async () => {
    try {
      console.log("Fetching user data...");
      setLoading(true);
      
      // Clear image cache by setting user to null first
      setUser(null);
      
      // First try to get from AsyncStorage for immediate display
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        console.log("User data from AsyncStorage:", parsedData);
        
        // Force a small delay to ensure UI updates
        setTimeout(() => {
          setUser(parsedData);
        }, 100);
      }
      
      // Then fetch from API to ensure data is up-to-date
      const response = await auth.currentUser();
      console.log("User data response from API:", JSON.stringify(response));
      
      // Handle different response formats
      let userData = null;
      
      if (response.data && response.data.user) {
        userData = response.data.user;
      } else if (response.user) {
        userData = response.user;
      } else if (response.data) {
        userData = response.data;
      } else if (typeof response === 'object' && response !== null) {
        userData = response;
      }
      
      if (userData) {
        console.log("Extracted user data:", userData);
        
        // Ensure we have the profile_image from AsyncStorage if it's not in the API response
        if (storedUserData) {
          const parsedStored = JSON.parse(storedUserData);
          // Always prefer the stored profile image if it exists
          if (parsedStored.profile_image) {
            userData.profile_image = parsedStored.profile_image;
          }
          if (parsedStored.avatar) {
            userData.avatar = parsedStored.avatar;
          }
          
          // Also ensure we have the latest name, phone, nationality from AsyncStorage
          if (parsedStored.first_name) userData.first_name = parsedStored.first_name;
          if (parsedStored.last_name) userData.last_name = parsedStored.last_name;
          if (parsedStored.phone_number) userData.phone_number = parsedStored.phone_number;
          if (parsedStored.nationality) userData.nationality = parsedStored.nationality;
        }
        
        // Update AsyncStorage with the latest data
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
      } else {
        console.error("Could not extract user data from response:", response);
        setError("Invalid user data format received from server.");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to fetch user data. " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Add this effect to check if profile was updated when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Profile screen focused, checking for updates...");
      const checkProfileUpdate = async () => {
        try {
          const wasUpdated = await AsyncStorage.getItem('profileUpdated');
          console.log("Profile updated flag:", wasUpdated);
          if (wasUpdated === 'true') {
            // Profile was updated, refresh data
            console.log("Profile was updated, refreshing data...");
            fetchUser();
            // Clear the flag
            await AsyncStorage.setItem('profileUpdated', 'false');
          }
        } catch (error) {
          console.error("Error checking profile update status:", error);
        }
      };
      
      checkProfileUpdate();
      return () => {
        // Cleanup if needed
      };
    }, [fetchUser])
  );

  // Refresh when screen loads or refresh param changes
  useEffect(() => {
    fetchUser();
  }, [params.refresh, fetchUser]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUser();
  }, [fetchUser]);

  const handleSettings = () => {
    router.push('/operator/profile/settings');
  };

  const handleLogout = async () => {
    try {
      const response = await auth.logout();
      console.log("Logout response:", response);
      alert("Logged out successfully");
      router.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out");
    }
  };

  const handleEditProfile = () => {
    router.push({
      pathname: '/operator/profile/edit_profile',
      params: {
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: user?.phone_number || '',
        nationality: user?.nationality || '',
        email: user?.email || ''
      }
    });
  };

  if (loading) {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 8],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#23a9f2', '#0f172a']}
        start={{ x: 1, y: 2 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Animated.View 
          style={[
            styles.header, 
            { 
              opacity: headerOpacity,
              shadowOpacity: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0.08, 0.16],
                extrapolate: 'clamp',
              })
            }
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {user?.role?.toUpperCase() || 'TOURIST'}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconButton}>
              <Feather name="bell" size={22} color="#fff" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSettings} style={styles.menuButton}>
              <Feather name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Scrollable Content with RefreshControl */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {user && (
          <>
            {/* Profile header */}
            <View style={styles.profileHeader}>
              {/* Profile image with story ring */}
              <View style={styles.profileImageContainer}>
                <View style={styles.storyRing}>
                  {user?.profile_image ? (
                    <Image 
                      source={{ uri: user.profile_image }} 
                      style={styles.profileImage}
                      key={`profile-${new Date().getTime()}`}
                    />
                  ) : user?.avatar ? (
                    <Image 
                      source={{ uri: user.avatar }} 
                      style={styles.profileImage}
                      key={`avatar-${new Date().getTime()}`}
                    />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Text style={styles.profileImageInitials}>
                        {user?.first_name?.charAt(0) || ''}{user?.last_name?.charAt(0) || ''}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              {/* Profile stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Trips</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Bookmarks</Text>
                </View>
              </View>
            </View>
            
            {/* Profile info */}
            <View style={styles.profileInfo}>
              <Text style={styles.displayName}>
                {user?.first_name && user?.last_name ? 
                  `${formatNameWords(user.first_name)} ${formatNameWords(user.last_name)}` 
                  : 'Admin'}
              </Text>
            </View>
            
            {/* Edit profile button */}
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
            
            {/* Divider */}
            <View style={styles.divider} />
            
            {/* User information cards */}
            <View style={styles.infoCardsContainer}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              {/* Email card */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Feather name="mail" size={20} color="#38bdf8" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user?.email?.toLowerCase() || 'Not provided'}</Text>
                </View>
                <TouchableOpacity style={styles.infoAction}>
                  <Feather name="copy" size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
              
              {/* Phone card */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Feather name="phone" size={20} color="#38bdf8" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{user?.phone_number || 'Not provided'}</Text>
                </View>
                <TouchableOpacity style={styles.infoAction}>
                  <Feather name="phone-outgoing" size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
              
              {/* Nationality card */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Feather name="flag" size={20} color="#38bdf8" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nationality</Text>
                  <Text style={styles.infoValue}>{user?.nationality || 'Not provided'}</Text>
                </View>
              </View>
              
              {/* Account type card */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Feather name="user" size={20} color="#38bdf8" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Account Type</Text>
                  <Text style={styles.infoValue}>
                    {user?.role ? formatNameWords(user.role) : 'Tourist'}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Activity section */}
            <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.emptyActivity}>
                <Feather name="calendar" size={40} color="#cbd5e1" />
                <Text style={styles.emptyActivityText}>No recent activity</Text>
                <Text style={styles.emptyActivitySubtext}>Your trips and bookings will appear here</Text>
              </View>
            </View>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60 + STATUS_BAR_HEIGHT,
    zIndex: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginRight: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60 + STATUS_BAR_HEIGHT,
    right: 20,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    paddingVertical: 8,
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  scrollContent: {
    paddingTop: 65 + STATUS_BAR_HEIGHT,
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: 30,
  },
  storyRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageInitials: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  profileInfo: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  username: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  editProfileButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  divider: {
    height: 8,
    backgroundColor: '#f1f5f9',
    marginVertical: 15,
  },
  infoCardsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0f172a',
  },
  infoAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitySection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  emptyActivity: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  emptyActivityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyActivitySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#e03e3e',
    fontSize: 16,
  },
});
