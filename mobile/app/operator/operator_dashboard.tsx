import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OperatorHomeScreen from './home/operator_home';
import OperatorToursScreen from './tours/operator_tours';
import OperatorBookingsScreen from './bookings/operator_bookings';
import OperatorProfileScreen from './profile/operator_profile';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Platform, TouchableOpacity, Image, Text, StatusBar, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import * as auth from '@/lib/api/auth';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function ProfileHeader() {
  const insets = useSafeAreaInsets();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await auth.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
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
          onPress={() => router.push('/operator/profile/operator_profile')}
          activeOpacity={0.7}
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {currentUser?.avatar ? (
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {currentUser?.first_name?.charAt(0) || currentUser?.email?.charAt(0) || 'O'}
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
                  {currentUser ? formatRole(currentUser.role) : 'Unknown Role'}
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
          } else if (route.name === 'Tours') {
            iconName = isFocused ? "map" : "map-outline";
          } else if (route.name === 'Bookings') {
            iconName = isFocused ? "calendar" : "calendar-outline";
          } else if (route.name === 'Profile') {
            iconName = isFocused ? "person" : "person-outline";
          }
          
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

export default function OperatorDashboard() {
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
          {() => <OperatorHomeScreen headerHeight={headerHeight} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Tours"
          options={{ tabBarLabel: 'Tours' }}
        >
          {() => <OperatorToursScreen headerHeight={headerHeight} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Bookings"
          options={{ tabBarLabel: 'Bookings' }}
        >
          {() => <OperatorBookingsScreen headerHeight={headerHeight} />}
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
  },
  tabBarGradient: {
    flex: 1,
  },
  tabBarInnerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeTabIndicator: {
    position: 'absolute',
    top: -10,
    width: 25,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  activeTabGradient: {
    flex: 1,
  },
  tabIconContainer: {
    width: 50,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeTabIconContainer: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 12,
    width: 50,
    height: 24,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#ffffff',
  },
  inactiveTabLabel: {
    color: 'rgba(148, 163, 184, 0.8)',
  },
});


