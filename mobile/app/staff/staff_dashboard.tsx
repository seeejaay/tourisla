import DashboardHeader from "@/components/DashboardHeader/tourist";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StaffHomeScreen from './home/staff_home';
import StaffCheckInScreen from "./visitor/StaffCheckInScreen";
import IncidentReportScreen from '../staff/profile/about/incident-report';
import MoreScreen from './more/MoreScreen';
import StaffQRScan from './visitor/staff_qr_scan';

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, View, Platform, TouchableOpacity, Image, Text, StatusBar, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import * as auth from '@/lib/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.customTabBar]}>
      <View style={styles.tabBarBackground}>
        <LinearGradient
          colors={['#014b55', '#014e65']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tabBarGradient}
        />
        <View style={styles.tabBarInnerShadow} />
      </View>
      
      <View style={styles.tabButtonsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          
          let iconName;
          let IconComponent = Ionicons;
          
          if (route.name === 'Home') {
            iconName = isFocused ? "home" : "home-outline";
          } else if (route.name === 'Map') {
            iconName = isFocused ? "map" : "map-outline";
          } else if (route.name === 'Announcements') {
            iconName = isFocused ? "megaphone" : "megaphone-outline";
          } else if (route.name === 'QRScan') {
            iconName = isFocused ? "qrcode" : "qrcode";
            IconComponent = FontAwesome5; // Use FontAwesome5 for QR code
          } else if (route.name === 'Island Entry Check-In') {
            iconName = isFocused ? "checkmark-circle" : "checkmark-circle-outline";
            IconComponent = Ionicons; // Use Ionicons for check-in
          } else if (route.name === 'More') {
            iconName = isFocused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline";
          } else if (route.name === 'Incident Report') {
            iconName = isFocused ? "flag" : "flag-outline";
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
                    colors={['#f9fbf2', '#afeed5']}
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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function StaffDashboard() {
  const { tab } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Calculate header height including safe area
  const headerHeight = 70 + insets.top;
  
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.tabNavigatorContainer}>
      <Tab.Navigator
        initialRouteName={tab as string || 'Home'}
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" options={{ tabBarLabel: 'Home' }}>
          {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <StaffHomeScreen />
              </View>
            )}
        </Tab.Screen>
        <Tab.Screen name="Island Entry Check-In" options={{ tabBarLabel: 'Entry Check-In' }} >
          {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <StaffCheckInScreen />
              </View>
            )}
        </Tab.Screen>
        <Tab.Screen name="Incident Report" options={{ tabBarLabel: 'QR Incident Report' }}>
          {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <IncidentReportScreen />
              </View>
            )}
        </Tab.Screen>
        <Tab.Screen name="QRScan" options={{ tabBarLabel: 'QR Scan' }}>
          {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <StaffQRScan />
              </View>
            )}
        </Tab.Screen>
        <Tab.Screen name="More" options={{ tabBarLabel: 'More' }}>
          {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <MoreScreen />
              </View>
            )}
        </Tab.Screen>
      </Tab.Navigator>
      </View>
      {/* Bottom fade effect */}
        <LinearGradient
          colors={['transparent', '#fff']} // Fade into dark background
          style={styles.bottomFade}
          pointerEvents="none"
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  statusBarPlaceholder: {
    width: '100%',
    backgroundColor: '#0f172a',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
    height: 70 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    backgroundColor: '#d0c7a2',
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
    bottom: Platform.OS === 'ios' ? 40 : 40,
    left: 8,
    right: 8,
    height: 60,
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
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 20,
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
    backgroundColor: 'rgba(27, 229, 188, 0.15)',
  },
  activeTabLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  inactiveTabLabel: {
    color: 'rgba(148, 163, 184, 0.9)',
  },
  tabNavigatorContainer: {
    flex: 1,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 0 : 0,
    height: 80,
    zIndex: 10,
  },
});
