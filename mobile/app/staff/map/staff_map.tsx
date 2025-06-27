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
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Use the exact path you specified
const mapImage = require("../../../assets/maps/cebu_tourist_map.webp");

export default function TouristMapScreen({ headerHeight }) {
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // For ImageViewer component with local image
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

      // Request permissions first (for Android)
      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Please grant media library permissions to save the image"
          );
          setDownloadLoading(false);
          return;
        }
      }

      // Get the URI of the image asset
      const assetUri = Image.resolveAssetSource(mapImage).uri;
      console.log("Asset URI:", assetUri);

      // Create a destination file path
      const fileUri = `${FileSystem.cacheDirectory}cebu_tourist_map.webp`;

      // Download the file from the asset URI to the destination
      const downloadResult = await FileSystem.downloadAsync(assetUri, fileUri);
      console.log("Download result:", downloadResult);

      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }

      if (Platform.OS === "android") {
        // Save to media library on Android
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("Bantayan Island", asset, false);
        Alert.alert(
          "Success",
          "Map saved to your gallery in Bantayan Island album"
        );
      } else {
        // Share on iOS
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

      <View style={[styles.content, { marginTop: headerHeight }]}>
        <Text style={styles.headerTitle}>Map of Bantayan</Text>

        <ScrollView style={styles.scrollView}>
          {/* Touchable wrapper for the image */}
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => toggleFullscreen(true)}
            style={styles.mapImageWrapper}
          >
            <Image
              source={mapImage}
              style={styles.mapImage}
              resizeMode="contain"
            />

            {/* Fullscreen icon */}
            <View style={styles.fullscreenIconContainer}>
              <MaterialIcons name="fullscreen" size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.tapInstructionText}>
            Tap on the map to view in full screen
          </Text>

          {/* Download button */}
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadImage}
            disabled={downloadLoading}
          >
            {downloadLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons
                  name="download-outline"
                  size={20}
                  color="#ffffff"
                  style={styles.downloadIcon}
                />
                <Text style={styles.downloadText}>Save Map to Gallery</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Fullscreen Modal with ImageViewer */}
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
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => toggleFullscreen(false)}
                >
                  <MaterialIcons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.downloadButtonModal}
                  onPress={downloadImage}
                  disabled={downloadLoading}
                >
                  {downloadLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Ionicons
                      name="download-outline"
                      size={24}
                      color="#ffffff"
                    />
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
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerTitle: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "900",
    color: "#1c5461",
    marginVertical: 16,
  },
  scrollView: {
    flex: 1,
  },
  mapImageWrapper: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  mapImage: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: 8,
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
    color: "#64748b",
    marginTop: 8,
    marginBottom: 16,
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
    padding: 8,
  },
  downloadButtonModal: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  downloadButton: {
    backgroundColor: "#24b4ab",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  downloadIcon: {
    marginRight: 8,
  },
  downloadText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
