import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Article } from "@/static/article/useArticleSchema";
import { WebView } from "react-native-webview";
import HeaderWithBack from "@/components/HeaderWithBack";

export default function MobileArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;

  function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.substring(1).toLowerCase());
  }

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

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error || !article)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error || "Article not found."}</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <HeaderWithBack
      title="Article Details"
      onBackPress={() => router.back()}
    />
    <ScrollView style={styles.container}>
      {/* Header Image with Title */}
      {article.images?.length > 0 && article.images[0].image_url ? (
        <View style={styles.headerImageContainer}>
          <Image
            source={{ uri: article.images[0].image_url }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>{article.title}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.headerTitlePlain}>{article.title}</Text>
      )}

      {/* Author and Date */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>
          Posted By: <Text style={styles.metaBold}>{toTitleCase(article.author)}</Text>
        </Text>
        <Text style={styles.metaDate}>
          {new Date(article.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {article.tags?.split(",").map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag.trim()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Gallery */}
      {article.images?.length > 1 && (
        <View style={styles.gallery}>
          {article.images.slice(1).map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img.image_url }}
              style={styles.galleryImage}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {/* Content */}
      <Text style={styles.content}>{toTitleCase(article.content)}</Text>

      {/* YouTube Video */}
      {article.video_url && (
        <View style={styles.videoContainer}>
          <Text style={styles.videoLabel}>Watch Video</Text>
          <View style={styles.videoWrapper}>
            <WebView
              source={{ uri: `https://www.youtube.com/embed/${extractYouTubeId(article.video_url)}` }}
              style={{ width: "100%", height: 200 }}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
            />
          </View>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1", paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerImageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerTitlePlain: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c5461",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  metaContainer: {
    padding: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#1c5461",
  },
  metaBold: {
    fontWeight: "bold",
  },
  metaDate: {
    color: "gray",
    fontSize: 12,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    marginTop: 4,
  },
  tag: {
    backgroundColor: "#1c5461",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 4,
    marginBottom: 2,
  },
  tagText: {
    color: "#e6f7fa",
    fontSize: 12,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    gap: 10,
  },
  galleryImage: {
    width: Dimensions.get("window").width / 2 - 20,
    height: 120,
    borderRadius: 8,
  },
  content: {
    paddingHorizontal: 16,
    fontSize: 12,
    color: "#333",
    textAlign: "justify",
    lineHeight: 15,
    marginBottom: 20,
  },
  videoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  videoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1c5461",
  },
  videoWrapper: {
    borderRadius: 8,
    overflow: "hidden",
  },
});
