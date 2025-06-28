import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar
} from "react-native";
import { useRouter } from "expo-router";
import { useArticleManager } from "@/hooks/useArticleManager";
import { Article } from "@/static/article/useArticleSchema";
import { FontAwesome5 } from "@expo/vector-icons";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
const { width, height } = Dimensions.get('window');

interface TourPackageDetailsScreenProps {
    headerHeight: number;
}

const ARTICLES_PER_PAGE = 6;

export default function CultureScreen({ headerHeight }: TourPackageDetailsScreenProps) {
  const router = useRouter();
  const { articles, fetchArticles } = useArticleManager();
  const [featured, setFeatured] = useState<Article[]>([]);
  const [regular, setRegular] = useState<Article[]>([]);
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
  const paginatedRegular = regular.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  const hasMore = startIndex + ARTICLES_PER_PAGE < regular.length;

  useEffect(() => {
    const load = async () => {
      await fetchArticles();
      const published = articles.filter((a) => a.status === "PUBLISHED");
      setFeatured(published.filter((a) => a.is_featured));
      setRegular(published.filter((a) => !a.is_featured));
    };
    load();
  }, [articles, fetchArticles]);

  return (
    <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
    <View style={styles.navbar}>
    <TouchableOpacity 
      style={styles.navButton}
      onPress={() => router.back()}
    >
      <FontAwesome5 name="arrow-left" size={18} color="#fff" />
    </TouchableOpacity>
    </View>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Featured Section */}
      {featured.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Featured Articles</Text>
          {featured.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.card}
              onPress={() => router.push(`/articles/${article.id}`)}
            >
              {article.thumbnail_url && (
                <Image source={{ uri: article.thumbnail_url }} style={styles.thumbnail} />
              )}
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.author}>By {article.author}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Regular Articles Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Articles</Text>
        {paginatedRegular.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.card}
            onPress={() => router.push(`/articles/${article.id}`)}
          >
            {article.thumbnail_url && (
              <Image source={{ uri: article.thumbnail_url }} style={styles.thumbnail} />
            )}
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.author}>By {article.author}</Text>
          </TouchableOpacity>
        ))}

        {/* Pagination Controls */}
        <View style={styles.pagination}>
          {page > 1 && (
            <TouchableOpacity onPress={() => setPage((p) => p - 1)} style={styles.button}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
          )}
          {hasMore && (
            <TouchableOpacity onPress={() => setPage((p) => p + 1)} style={styles.button}>
              <Text style={styles.buttonText}>Load More</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
    </View>
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
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
},
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#f9fafb",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: "#6b7280",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#1d4ed8",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
