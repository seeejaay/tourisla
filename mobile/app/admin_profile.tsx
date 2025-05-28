import { View, Text, ActivityIndicator, TouchableOpacity, Image, ScrollView, Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { currentUser, logoutUser as logout } from '@/lib/api';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function AdminProfileScreen() {
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await currentUser();
        setUser(res.data.user);
      } catch {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleMenuToggle = () => setShowMenu(prev => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully");
      setShowMenu(false);
      router.replace('/login');
    } catch {
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
        <ActivityIndicator size="large" color="#007AFF" />
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

  return (
    <View style={styles.container}>
      {/* Header with menu */}
      <View style={[styles.header]}>
        <Text style={[styles.headerTitle]}>My Profile</Text>
        <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
          <FontAwesome name="bars" size={28} color="#ecf0f1" />
        </TouchableOpacity>
      </View>

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
      <ScrollView
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
      >
      {/* Profile Card */}
      {user && (
        <View style={[styles.profileCard]}>
          {/* Profile Image */}
          <View style={[styles.avatarContainer]}>
            {/* Use user's avatar if available; fallback to icon */}
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <FontAwesome name="user-circle-o" size={100} color="#bbb" />
            )}
          </View>

          {/* Name & Email */}
          <Text style={styles.name}>
            {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>

          {/* Role Badge */}
          <View style={[styles.roleBadge, user?.role === 'admin' ? styles.adminBadge : styles.userBadge]}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>
      )}

      {/* User Info Section */}
{/* User Info Section */}
{user && (
  <>
    <View style={styles.infoSection}>
      <Text style={styles.sectionTitle}>User Information</Text>
      <TouchableOpacity style={[styles.editProfileButton]} onPress={handleEditProfile}>
        <MaterialIcons name="edit" size={24} color="#007dab" />
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <MaterialIcons name="phone" size={24} color="#007dab" />
        <View style={styles.infoTextGroup}>
          <Text style={styles.infoValue}>{user?.phone_number || "N/A"}</Text>
          <Text style={styles.infoLabel}>Phone Number</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="security" size={24} color="#007dab" />
        <View style={styles.infoTextGroup}>
          <Text style={styles.infoValue}>{user?.role}</Text>
          <Text style={styles.infoLabel}>Role</Text>
        </View>
      </View>

      {/* Add other info fields here if needed */}
    </View>
  </>
)}

      </ScrollView>
    </View>
  );
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(180deg, #ffffff, #c4deff)',
    paddingTop: 20,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(180deg, #ffffff, #c4deff)',
  },

  errorText: {
    color: '#e03e3e', // soft red for errors
    fontSize: 16,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50 + STATUS_BAR_HEIGHT,
    backgroundColor: '#007dab', // dark slate blue/navy
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
    borderBottomLeftRadius: 15, // Rounded bottom corners
  borderBottomRightRadius: 15,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ecf0f1',
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Text shadow for better visibility
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
    marginHorizontal: 16,
    marginTop: 56,
    backgroundColor: '#ffffff', // white card background for crispness
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  avatarContainer: {
    marginBottom: 15,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#bdc3c7', // light grey border, subtle
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50', // dark slate for strong but soft heading
  },

  email: {
    fontSize: 14,
    color: '#7f8c8d', // medium grey for secondary text
    marginTop: 4,
  },

  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },

  adminBadge: {
    backgroundColor: '#e67e22', // warm orange for admin — professional and noticeable but not harsh
  },

  userBadge: {
    borderColor: '#007dab', // fixed spelling (capital C)
    borderWidth: 2,         // add border width to make border visible
    borderRadius: 9999,     // make it fully round (circle/ellipse)
  },

  roleText: {
    color: '#007dab', // white text on badges
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },

  infoSection: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#ffffff', // clean white background
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  
  editProfileButton: {
    alignSelf: 'flex-end',
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderColor: '#007dab', // fixed spelling (capital C)
    borderWidth: 2,  
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  
  editProfileButtonText: {
    color: '#007dab', // off-white, easy on the eyes
    fontWeight: '600',
    fontSize: 15,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50', // dark slate gray, less bold but clear
    marginBottom: 16,
    letterSpacing: 0,
    marginTop: 0, // add some space above the section title
    textAlign: 'center',
  },
  
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#fefefe', // very subtle off-white to distinguish rows
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007dab', // subtle light border to separate info rows nicely
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  
  infoTextGroup: {
    marginLeft: 12,
  },
  
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e', // consistent dark blue-gray for text emphasis
  },
  
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d', // soft grey with good readability
    marginTop: 2,
    letterSpacing: 0.4,
  },  
};
