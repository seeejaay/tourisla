import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UsersHomeScreen from './users_home';
import UsersProfileScreen from './users_profile';
import UsersAnnouncementsScreen from './users_announcements';
import { FontAwesome } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function UsersDashboard() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007dab',
      }}
    >
      <Tab.Screen
        name="Home"
        component={UsersHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Announcements"
        component={UsersAnnouncementsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bullhorn" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UsersProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
