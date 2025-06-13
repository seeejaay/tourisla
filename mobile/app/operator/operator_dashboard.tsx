import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OperatorHomeScreen from './home/operator_home';
import OperatorToursScreen from './tours/operator_tours';
import OperatorBookingsScreen from './bookings/operator_bookings';
import OperatorProfileScreen from './profile/operator_profile';

const Tab = createBottomTabNavigator();

export default function OperatorTabs() {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 10;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tours') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom + 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home">
        {() => <OperatorHomeScreen headerHeight={headerHeight} />}
      </Tab.Screen>
      <Tab.Screen name="Tours">
        {() => <OperatorToursScreen headerHeight={headerHeight} />}
      </Tab.Screen>
      <Tab.Screen name="Bookings">
        {() => <OperatorBookingsScreen headerHeight={headerHeight} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <OperatorProfileScreen headerHeight={headerHeight} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

