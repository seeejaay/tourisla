import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TouristHomeScreen from './home/tourist_home';
import TouristAnnouncementsScreen from './announcements/tourist_announcements';
import TouristHotlinesScreen from './hotlines/tourist_hotlines';
import TouristProfileScreen from './profile/tourist_profile';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, View, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const Tab = createBottomTabNavigator();

export default function TouristDashboard() {
  const { tab } = useLocalSearchParams();

  return (
    <Tab.Navigator
      initialRouteName={tab as string}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: 'rgba(148, 163, 184, 0.9)',
        sceneContainerStyle: {
          backgroundColor: '#f8fafc',
        },
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopWidth: 0,
          height: 100,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Announcements') {
            iconName = 'bullhorn';
          } else if (route.name === 'Hotlines') {
            iconName = 'phone-alt';
          } else {
            iconName = 'user';
          }

          return (
            <View style={styles.iconWrapper}>
              {focused && (
                <>
                  <View style={[styles.activeIndicator, { backgroundColor: '#38bdf8' }]} />
                  <View style={styles.activeIconBackground} />
                </>
              )}
              <FontAwesome5
                name={iconName}
                size={focused ? size + 4 : size}
                color={color}
                style={[
                  focused ? styles.activeIcon : styles.icon,
                  { transform: [{ translateY: focused ? -3 : 0 }] }
                ]}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home"
        options={{
          tabBarLabel: 'Dashboard'
        }}
      >
        {() => <TouristHomeScreen />}
      </Tab.Screen>
      <Tab.Screen name="Announcements">
        {() => <TouristAnnouncementsScreen />}
      </Tab.Screen>
      <Tab.Screen name="Hotlines">
        {() => <TouristHotlinesScreen />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <TouristProfileScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    position: 'relative',
    marginTop: 10,
  },
  activeIndicator: {
    position: 'absolute',
    top: -15,
    width: 25,
    height: 3,
    borderRadius: 1.5,
  },
  activeIconBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    top: -8,
  },
  icon: {
    opacity: 0.9,
  },
  activeIcon: {
    opacity: 1,
    textShadowColor: 'rgba(56, 189, 248, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
