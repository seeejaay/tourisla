import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHomeScreen from './admin_home';
import AdminProfileScreen from './admin_profile';
import AdminAnnouncementsScreen from './admin_announcements';
import { FontAwesome } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function AdminDashboard() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007dab',
      }}
    >
      <Tab.Screen
        name="Home"
        component={AdminHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Announcements"
        component={AdminAnnouncementsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bullhorn" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AdminProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
