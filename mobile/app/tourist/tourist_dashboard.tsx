import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TouristHomeScreen from './home/tourist_home';
import TouristMapScreen from './map/tourist_map';
import TouristAnnouncementsScreen from './announcements/tourist_announcements';
import TouristPackagesScreen from './packages/tourist_packages';
import TouristProfileScreen from './profile/tourist_profile';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, View, Platform, TouchableOpacity, Image, Text, StatusBar, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import * as auth from '@/lib/api/auth';
import TouristTouristSpotsScreen from './tourist_spots/tourist_tourist_spots';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function ProfileHeader() {
  const insets = useSafeAreaInsets();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        
        // First try to get the role from the API
        const response = await auth.currentUser();
        console.log("API Response:", JSON.stringify(response));
        
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
        
        // If no role in the API response, try to get it from AsyncStorage
        if (userData && !userData.role) {
          try {
            const storedRole = await AsyncStorage.getItem('role');
            if (storedRole) {
              console.log("Using role from AsyncStorage:", storedRole);
              userData.role = storedRole;
            }
          } catch (storageError) {
            console.error("Failed to get role from storage:", storageError);
          }
        }
        
        console.log("Final user data with role:", JSON.stringify(userData));
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  const formatRole = (role) => {
    if (!role) return 'User';
    if (role === 'Admin' || role === 'admin') return 'Administrator';
    if (role === 'Tourist' || role === 'tourist') return 'Tourist';
    if (role === 'tour_guide') return 'Tour Guide';
    if (role === 'tour_operator') return 'Tour Operator';
    
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  return (
    <View style={styles.profileHeader}>
      {/* Status bar placeholder */}
      <View style={[styles.statusBarPlaceholder, { height: insets.top }]} />
      
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 7, y: 0 }}
        style={styles.headerContainer}
      >
        {/* Left side - User profile */}
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => router.push('/tourist/profile/tourist_profile')}
          activeOpacity={0.7}
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {currentUser?.avatar ? (
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {currentUser?.first_name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </View>
          
          {/* User info */}
          <View style={styles.userInfo}>
            {loading ? (
              <Text style={styles.userName}>Loading...</Text>
            ) : (
              <>
                <Text style={styles.userName} numberOfLines={1}>
                  {currentUser ? 
                    `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email 
                    : 'Unknown User'}
                </Text>
                <Text style={styles.userRole}>
                  {currentUser && currentUser.role ? formatRole(currentUser.role) : 'User'}
                </Text>
              </>
            )}
          </View>
          
          <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Bottom shadow effect */}
      <View style={styles.headerBottomShadow} />
    </View>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.customTabBar]}>
      <View style={styles.tabBarBackground}>
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tabBarGradient}
        />
        <View style={styles.tabBarInnerShadow} />
      </View>
      
      <View style={styles.tabButtonsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;
          
          let iconName;
          let IconComponent = Ionicons;
          
          if (route.name === 'Home') {
            iconName = isFocused ? "home" : "home-outline";
          } else if (route.name === 'Map') {
            iconName = isFocused ? "map" : "map-outline";
          } else if (route.name === 'Announcements') {
            iconName = isFocused ? "megaphone" : "megaphone-outline";
          } else if (route.name === 'Tourist Spots') {
            iconName = isFocused ? "location" : "location-outline";
          } else if (route.name === 'Packages') {
            iconName = isFocused ? "calendar-clear" : "calendar-clear-outline";
          }
          // Removed Hotlines case
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              {isFocused && (
                <View style={styles.activeTabIndicator}>
                  <LinearGradient
                    colors={['#38bdf8', '#0ea5e9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.activeTabGradient}
                  />
                </View>
              )}
              
              <Animated.View 
                style={[
                  styles.tabIconContainer,
                  isFocused && styles.activeTabIconContainer
                ]}
              >
                <IconComponent 
                  name={iconName} 
                  size={22} 
                  color={isFocused ? '#ffffff' : 'rgba(148, 163, 184, 0.8)'} 
                />
              </Animated.View>
              
              <Text 
                style={[
                  styles.tabLabel, 
                  isFocused ? styles.activeTabLabel : styles.inactiveTabLabel
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TouristDashboard() {
  const { tab } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Calculate header height including safe area
  const headerHeight = 70 + insets.top;
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ProfileHeader />
      
      <Tab.Navigator
        initialRouteName={tab as string || 'Home'}
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Home"
          options={{ tabBarLabel: 'Home' }}
        >
          {() => <TouristHomeScreen headerHeight={headerHeight} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Map"
          options={{ tabBarLabel: 'Map' }}
        >
          {() => <TouristMapScreen headerHeight={headerHeight} />}
        </Tab.Screen>
        <Tab.Screen name="Announcements">
          {() => <TouristAnnouncementsScreen headerHeight={headerHeight} />}
        </Tab.Screen>
        <Tab.Screen name="Packages">
          {() => <TouristPackagesScreen headerHeight={headerHeight} />}
        </Tab.Screen>
        <Tab.Screen name="Tourist Spots">
          {() => <TouristTouristSpotsScreen headerHeight={headerHeight} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  statusBarPlaceholder: {
    width: '100%',
    backgroundColor: '#0f172a',
  },
  headerContainer: {
    height: 70,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  userRole: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  headerBottomShadow: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  customTabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    left: 8,
    right: 8,
    height: 80,
    zIndex: 100,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarInnerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    height: '100%',
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTabIndicator: {
    position: 'absolute',
    top: 8,
    width: 30,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  activeTabGradient: {
    width: '100%',
    height: '100%',
  },
  tabIconContainer: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTabIconContainer: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  inactiveTabLabel: {
    color: 'rgba(148, 163, 184, 0.8)',
  },
});
