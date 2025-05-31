import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHomeScreen from './home/admin_home';
import AdminAnnouncementsScreen from './announcements/admin_announcements';
import AdminHotlinesScreen from './hotlines/admin_hotlines';
import AdminProfileScreen from './profile/admin_profile';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

const Tab = createBottomTabNavigator();

function GradientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient colors={['#f1f1f1', '#bedcfe']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

export default function AdminDashboard() {
  const { tab } = useLocalSearchParams();

  return (
    <Tab.Navigator
      initialRouteName={tab as string} // Dynamically set the initial tab
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007dab',
        tabBarInactiveTintColor: '#6e7d90',
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          backgroundColor: '#1d2937',
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          position: 'absolute',
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
          } else if (route.name === 'Hotlines') {
            iconName = 'phone';
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
      <Tab.Screen name="Hotlines">
        {() => (
          <GradientWrapper>
            <AdminHotlinesScreen />
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
    paddingBottom: 40,
  },
  safeArea: {
    flex: 1,
  },
});
