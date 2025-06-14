import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, StatusBar, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { router } from 'expo-router';
import * as auth from '@/lib/api/auth.js';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TouristProfileScreen() {
  const [user, setUser] = useState<{
    avatar?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    role: string;
    phone_number?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        setLoading(true);
        const response = await auth.currentUser();
        console.log("User data response:", JSON.stringify(response));
        
        // Handle different response formats
        let userData = null;
        
        if (response.data && response.data.user) {
          // Format: { data: { user: {...} } }
          userData = response.data.user;
        } else if (response.user) {
          // Format: { user: {...} }
          userData = response.user;
        } else if (response.data) {
          // Format: { data: {...} }
          userData = response.data;
        } else if (typeof response === 'object' && response !== null) {
          // Format: {...} (user object directly)
          userData = response;
        }
        
        if (userData) {
          console.log("Extracted user data:", userData);
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
      }
    };
    fetchUser();
  }, []);

  const handleMenuToggle = () => setShowMenu(prev => !prev);

  const handleLogout = async () => {
    try {
      const response = await auth.logout();
      console.log("Logout response:", response);
      alert("Logged out successfully");
      setShowMenu(false);
      router.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out");
    }
  };

  const handleEditProfile = () => {
    alert("Navigate to Edit Profile");
    setShowMenu(false);
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
      {/* Animated Header with menu */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            opacity: headerOpacity,
            elevation: headerElevation,
            shadowOpacity: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [0.08, 0.16],
              extrapolate: 'clamp',
            })
          }
        ]}
      >
        <Text style={[styles.headerTitle]}>My Profile</Text>
        <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
          <FontAwesome name="bars" size={28} color="#ecf0f1" />
        </TouchableOpacity>
      </Animated.View>

      {showMenu && (
        <View style={[styles.dropdownMenu]}>
          <TouchableOpacity style={[styles.menuItem]} onPress={handleEditProfile}>
            <FontAwesome name="cog" size={20} color="#555" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={[styles.menuItem]} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={20} color="#d9534f" />
            <Text style={[styles.menuText, { color: '#d9534f' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Profile Card */}
        {user && (
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['rgba(0, 125, 171, 0.25)', 'rgba(15, 23, 42, 0.15)']}
              style={styles.cardGradient}
            />
            
            {/* Profile Image */}
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <LinearGradient
                  colors={['#38bdf8', '#005d7f']}
                  style={styles.avatarGradient}
                >
                  <FontAwesome name="user" size={70} color="#fff" />
                </LinearGradient>
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <FontAwesome name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Name & Email */}
            <Text style={styles.name}>
              {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>

            {/* Role Badge */}
            <View style={[styles.roleBadge, user?.role === 'tourist' ? styles.touristBadge : styles.userBadge]}>
              <Text style={[styles.roleText, user?.role !== 'tourist' && styles.userRoleText]}>
                {user?.role?.toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        {/* User Info Section */}
        {user && (
          <>
            <View style={styles.infoSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>User Information</Text>
                <TouchableOpacity style={[styles.editProfileButton]} onPress={handleEditProfile}>
                  <MaterialIcons name="edit" size={24} color="#38bdf8" />
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="phone" size={24} color="#38bdf8" />
                </View>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoValue}>{user?.phone_number || "N/A"}</Text>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call-outline" size={20} color="#38bdf8" />
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="security" size={24} color="#38bdf8" />
                </View>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoValue}>{user?.role}</Text>
                  <Text style={styles.infoLabel}>Role</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="email" size={24} color="#38bdf8" />
                </View>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                  <Text style={styles.infoLabel}>Email Address</Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="content-copy" size={20} color="#38bdf8" />
                </TouchableOpacity>
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
    paddingTop: 20,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },

  errorText: {
    color: '#e03e3e',
    fontSize: 16,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50 + STATUS_BAR_HEIGHT,
    backgroundColor: '#0f172a',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 20,
    zIndex: 50,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ecf0f1',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  menuButton: {
    padding: 8,
  },

  dropdownMenu: {
    position: 'absolute',
    top: 60 + STATUS_BAR_HEIGHT,
    right: 20,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 7,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    paddingVertical: 10,
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
    color: '#34495e',
  },

  menuDivider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 14,
    opacity: 0.8,
  },

  profileCard: {
    marginTop: 16 + STATUS_BAR_HEIGHT, // Adjust for header height
    marginHorizontal: 16,
    backgroundColor: '#ffffff', 
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
    overflow: 'hidden',
  },

  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 20,
    // Make gradient more prominent with stronger colors
    colors: ['rgba(56, 189, 248, 0.25)', 'rgba(15, 23, 42, 0.15)'],
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'visible', 
    marginBottom: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    resizeMode: 'cover',
  },
  
  avatarGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
  },
  

  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#38bdf8',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
    elevation: 5, // For Android
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },

  email: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },

  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },

  userBadge: {
    borderColor: '#38bdf8',
    borderWidth: 2,
    borderRadius: 9999,
    backgroundColor: 'transparent',
  },
  adminBadge: {
    backgroundColor: '#38bdf8',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  userRoleText: {
    color: '#38bdf8',
  },
  infoSection: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  editProfileButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2c3e50',
    letterSpacing: 0,
  },
  
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fefefe',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  infoTextGroup: {
    marginLeft: 12,
    flex: 1,
  },
  
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
    letterSpacing: 0.4,
  },
  
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
