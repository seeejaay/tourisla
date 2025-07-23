import DashboardHeader from "@/components/DashboardHeader/tourist";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TouristHomeScreen from "./home/tourist_home";
import PublicArticlesScreen from "./culture/tourist_culture";
import TouristRegistrationScreen from "./regis/tourist_regis";
import TouristHotlines from "./profile/about/hotlines/tourist_hotlines";
import TouristPackagesScreen from "./packages/tourist_packages";
import MoreScreen from "./more/MoreScreen";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.customTabBar}>
      <View style={styles.tabBarBackground}>
        <LinearGradient
          colors={["#e6f7fa", "#e4f2f4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 2 }}
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

          switch (route.name) {
            case "Home":
              iconName = isFocused ? "home" : "home-outline";
              break;
            case "Culture":
              iconName = "theater-masks";
              IconComponent = FontAwesome5;
              break;
            case "Registration":
              iconName = isFocused ? "clipboard" : "clipboard-outline";
              IconComponent = Ionicons;
              break;
            case "Packages":
              iconName = isFocused ? "calendar-clear" : "calendar-clear-outline";
              break;
            case "Hotlines":
              iconName = isFocused ? "call" : "call-outline";
              IconComponent = Ionicons;
              break;
            case "More":
              iconName = isFocused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline";
              break;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
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
                    colors={["#f9fbf2", "#afeed5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 2, y: 0 }}
                    style={styles.activeTabGradient}
                  />
                </View>
              )}

              <Animated.View
                style={[
                  styles.tabIconContainer,
                  isFocused && styles.activeTabIconContainer,
                ]}
              >
                <IconComponent
                  name={iconName}
                  size={22}
                  color={isFocused ? "#469ba2" : "rgba(148, 163, 184, 0.8)"}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TouristDashboard() {
  const { tab } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.tabNavigatorContainer}>
        <Tab.Navigator
          initialRouteName={(tab as string) || "Home"}
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Home" options={{ tabBarLabel: "Home" }}>
            {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <TouristHomeScreen />
              </View>
            )}
          </Tab.Screen>

          <Tab.Screen name="Culture" options={{ tabBarLabel: "Culture" }}>
            {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <PublicArticlesScreen />
              </View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Registration" options={{ tabBarLabel: "Registration" }}>
            {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <TouristRegistrationScreen />
              </View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Packages">
            {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <TouristPackagesScreen />
              </View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Hotlines">
            {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <TouristHotlines />
              </View>
            )}
          </Tab.Screen>
          <Tab.Screen name="More" options={{ tabBarLabel: "More" }}>
            {() => (
              <View style={{ flex: 1 }}>
                <DashboardHeader />
                <MoreScreen />
              </View>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>

      <LinearGradient
        colors={["transparent", "#fff"]}
        style={styles.bottomFade}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  customTabBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 40,
    left: 8,
    right: 8,
    height: 60,
    zIndex: 100,
  },
  tabBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 20,
  },
  tabBarGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarInnerShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  tabButtonsContainer: {
    flexDirection: "row",
    height: "100%",
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTabIndicator: {
    position: "absolute",
    top: 8,
    width: 30,
    height: 3,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  activeTabGradient: {
    width: "100%",
    height: "100%",
  },
  tabIconContainer: {
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  activeTabIconContainer: {
    backgroundColor: "rgba(62, 152, 158, 0.15)",
  },
  tabNavigatorContainer: {
    flex: 1,
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === "ios" ? 0 : 0,
    height: 80,
    zIndex: 10,
  },
});
