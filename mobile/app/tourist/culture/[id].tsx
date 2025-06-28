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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Article } from "@/static/article/useArticleSchema";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get("window");

export default function ArticleDetailMobile() {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#1d4ed8" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.author}>By {article.author}</Text>

      {article.thumbnail_url && (
        <Image source={{ uri: article.thumbnail_url }} style={styles.thumbnail} resizeMode="contain" />
      )}

      {article.video_url && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>Video</Text>
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

      {article.tags && (
        <View style={styles.tagWrapper}>
          <Text style={styles.label}>Tags</Text>
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
        <Text style={styles.label}>Content</Text>
        <Text style={styles.body}>{article.body}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1d4ed8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#e2e8f0",
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
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: "#1e3a8a",
    fontSize: 12,
    fontWeight: "500",
  },
  body: {
    fontSize: 15,
    color: "#1f2937",
    lineHeight: 22,
    marginTop: 4,
    whiteSpace: "pre-line",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
