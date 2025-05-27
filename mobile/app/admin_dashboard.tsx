import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHomeScreen from './admin_home';
import AdminProfileScreen from './admin_profile';
import AdminAnnouncementsScreen from './admin_announcements';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function GradientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={['#f1f1f1', '#bedcfe']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

export default function AdminDashboard() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007dab',
        tabBarInactiveTintColor: '#6e7d90',
        sceneContainerStyle: {
          backgroundColor: 'transparent', // 🔥 prevent white background behind screens
        },
        tabBarStyle: {
          backgroundColor: '#1d2937',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          position: 'absolute', // makes sure it's overlayed
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof FontAwesome.glyphMap;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Announcements') {
            iconName = 'bullhorn';
          } else {
            iconName = 'user';
          }

          return (
            <FontAwesome
              name={iconName}
              size={focused ? size + 4 : size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home">
        {() => (
          <GradientWrapper>
            <AdminHomeScreen />
          </GradientWrapper>
        )}
      </Tab.Screen>
      <Tab.Screen name="Announcements">
        {() => (
          <GradientWrapper>
            <AdminAnnouncementsScreen />
          </GradientWrapper>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => (
          <GradientWrapper>
            <AdminProfileScreen />
          </GradientWrapper>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingBottom: 40, // Add padding to avoid content being cut off
  },
  safeArea: {
    flex: 1,
  },
});