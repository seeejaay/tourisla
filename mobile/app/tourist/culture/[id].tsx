import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Article } from "@/static/article/useArticleSchema";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from 'react-native-webview';
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

interface TourPackageDetailsScreenProps {
  headerHeight: number;
}

const { width } = Dimensions.get("window");

export default function ArticleDetailMobile({
  headerHeight,
}: TourPackageDetailsScreenProps) {
  function capitalizeWords(str: string): string {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  function formatDate(dateStr: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  }
  
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}articles/${id}`);
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError("Error Occurred: " + err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" color="#1d4ed8" />;
  }

  if (error || !article) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{error || "Article not found."}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      {article.thumbnail_url && (
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: article.thumbnail_url }} style={styles.thumbnail} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          />
          <View style={styles.titleOverlay}>
            <Text style={styles.titleInImage}>{capitalizeWords(article.title)}</Text>
          </View>
        </View>
      )}
  
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.author}>Posted By {capitalizeWords(article.author)}</Text>
          <Text style={styles.date}>• {formatDate(article.created_at)}</Text>
        </View>

        {article.tags && (
          <View style={styles.tagWrapper}>
            <View style={styles.tags}>
              {article.tags.split(",").map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
  
        <View>
            <Text style={styles.body}>
            {article.body
              .toLowerCase()
              .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())}
            </Text>
        </View>

        {article.video_url && (
          <View style={styles.videoWrapper}>
            {article.video_url.includes("youtube.com") || article.video_url.includes("youtu.be") ? (
              <View style={styles.videoContainer}>
                <WebView
                  source={{ uri: `https://www.youtube.com/embed/${extractYouTubeId(article.video_url)}` }}
                  style={styles.video}
                />
              </View>
            ) : (
              <TouchableOpacity onPress={() => Linking.openURL(article.video_url)}>
                <Text style={styles.link}>Watch Video</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingBottom: 40,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 6,
    fontWeight: "900",
  },
  date: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "700",
  },
  thumbnailContainer: {
    position: 'relative',
    width: width,
    height: 300,
    marginBottom: 16,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  videoContainer: {
    height: 200,
    width: "100%",
    backgroundColor: "#000",
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
    border: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  link: {
    color: "#2563eb",
    fontWeight: "500",
    textDecorationLine: "underline",
    marginTop: 4,
  },
  tagWrapper: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  tag: {
    backgroundColor: "#0c5e58",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  body: {
    fontSize: 14,
    color: "#1f2937",
    lineHeight: 15,
    marginTop: 4,
    paddingHorizontal: 16,
    fontWeight: "600",
    marginBottom  : 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  videoContainer: {
    height: 200,
    width: "100%",
    backgroundColor: "#000",
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  video: {
    height: "100%",
    width: "100%",
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  titleInImage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
