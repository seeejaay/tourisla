import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { Stack } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const mapImage = require("../../../assets/maps/cebu_tourist_map.webp");
const headerImage = require("../../../assets/maps/mapheader.jpg");

export default function TouristMapScreen({ headerHeight }) {
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const images = [
    {
      url: "",
      props: {
        source: mapImage,
      },
    },
  ];

  const toggleFullscreen = (visible) => {
    setFullscreenVisible(visible);
    StatusBar.setHidden(visible);
  };

  const downloadImage = async () => {
    try {
      setDownloadLoading(true);

      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Please grant media library permissions to save the image");
          setDownloadLoading(false);
          return;
        }
      }

      const assetUri = Image.resolveAssetSource(mapImage).uri;
      const fileUri = `${FileSystem.cacheDirectory}cebu_tourist_map.webp`;
      const downloadResult = await FileSystem.downloadAsync(assetUri, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }

      if (Platform.OS === "android") {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("Bantayan Island", asset, false);
        Alert.alert("Success", "Map saved to your gallery in Bantayan Island album");
      } else {
        await Sharing.shareAsync(fileUri);
      }

      setDownloadLoading(false);
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Error", "Failed to download the map. Please try again.");
      setDownloadLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#000" />
        </TouchableOpacity>
        </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerImageWrapper}>
          <Image source={headerImage} style={styles.headerImage} resizeMode="cover" />
          <LinearGradient colors={["transparent", "#f9fafb"]} style={styles.gradientOverlay}>
            <Text style={styles.headerTitle}>Map of Bantayan</Text>
            <Text style={styles.headerSubtitle}>
              Explore key tourist destinations, landmarks, and scenic routes.
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.mapSection}>
          <TouchableOpacity activeOpacity={0.95} onPress={() => toggleFullscreen(true)} style={styles.mapImageWrapper}>
            <Image source={mapImage} style={styles.mapImage} resizeMode="cover" />
            <View style={styles.fullscreenIconContainer}>
              <MaterialIcons name="fullscreen" size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.tapInstructionText}>Tap on the map to view in full screen</Text>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.downloadButton} onPress={downloadImage} disabled={downloadLoading}>
            {downloadLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#ffffff" style={styles.downloadIcon} />
                <Text style={styles.downloadText}>Download Map to Gallery</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={fullscreenVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => toggleFullscreen(false)}
      >
        <View style={styles.modalContainer}>
          <ImageViewer
            imageUrls={images}
            enableSwipeDown={true}
            onSwipeDown={() => toggleFullscreen(false)}
            backgroundColor="#000000"
            renderHeader={() => (
              <View style={styles.modalHeaderContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={() => toggleFullscreen(false)}>
                  <MaterialIcons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.downloadButtonModal} onPress={downloadImage} disabled={downloadLoading}>
                  {downloadLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Ionicons name="download-outline" size={24} color="#ffffff" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  headerImageWrapper: {
    width: "100%",
    height: 300,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  headerTitle: {
    color: "#03312e",
    fontSize: 32,
    fontWeight: "900",
    alignSelf: "flex-start",
    marginHorizontal: 16,
    lineHeight: 38,
    overflow: "hidden",
  },
  headerSubtitle: {
    color: "#374151", // soft gray
    fontSize: 16,
    fontWeight: "700",
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginTop: 4,
    lineHeight: 22,
  },
  mapSection: {
    paddingHorizontal: 16,
  },
  mapImageWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mapImage: {
    width: "100%",
    height: SCREEN_WIDTH * 0.6,
    borderRadius: 16,
  },
  fullscreenIconContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  tapInstructionText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 24,
  },
  divider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  downloadButton: {
    backgroundColor: "#24b4ab",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#24b4ab",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  downloadIcon: {
    marginRight: 10,
  },
  downloadText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalHeaderContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    left: 20,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 10,
  },
  downloadButtonModal: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 10,
  },
});
