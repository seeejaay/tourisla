export default {
  name: "YourAppName",
  slug: "your-app-slug",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    apiUrl: "http://192.168.0.135:3005"
  },
  plugins: [
    "expo-router"
  ],
  // Add environment variables
  env: {
    EXPO_PUBLIC_API_URL: "http://192.168.0.135:3005"
  }
};
