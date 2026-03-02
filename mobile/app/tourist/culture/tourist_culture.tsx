import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useArticleManager } from "@/hooks/useArticleManager";
import { Article } from "@/static/article/useArticleSchema";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { toTitleCase } from "@/lib/utils/textFormat";
toTitleCase

const ARTICLES_PER_PAGE = 6;

export default function PublicArticlesScreen() {
  const router = useRouter();
  const { articles, fetchArticles } = useArticleManager();
  const [featured, setFeatured] = useState<Article[]>([]);
  const [regular, setRegular] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const published = articles.filter((a) => a.is_published);
    setFeatured(published.filter((a) => a.is_featured));
    setRegular(published.filter((a) => !a.is_featured));
  }, [articles]);

  const getArticleImage = (article: Article) => {
    if (article.images?.length > 0) {
      return article.images[0].image_url;
    }
    return article.thumbnail_url || require("@/assets/images/article_image.webp");
  };

  const paginatedRegular = regular.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  );

  const hasMore = page * ARTICLES_PER_PAGE < regular.length;

  const goToArticle = (id: number) => {
    router.push(`/tourist/culture/${id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }} // adjust padding as needed
    >
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/article_image.webp")}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Kakyop, Sara Kag Bwas</Text>
          <Text style={styles.headerSubtitle}>Yesterday, Today, and Tomorrow</Text>
        </View>
      </View>

      {/* Featured Carousel */}
      {featured.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Featured</Text>
          <Carousel
            loop
            mode="parallax"
            width={screenWidth}
            height={250}
            data={featured}
            scrollAnimationDuration={1000}
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 40,
              parallaxAdjacentItemScale: 0.85,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => goToArticle(item.id)}
                style={{
                  width: screenWidth,
                  borderRadius: 16,
                  overflow: "hidden",
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                <Image
                  source={{ uri: getArticleImage(item) }}
                  style={styles.carouselImage}
                />
                <View style={styles.carouselOverlay} />
                <View style={styles.carouselText}>
                  <Text style={styles.carouselTitle}>{toTitleCase(item.title)}</Text>
                  <Text style={styles.carouselAuthor}>By {toTitleCase(item.author)}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Regular Articles */}
      <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>
        Local Culture and History
      </Text>
      <FlatList
        data={paginatedRegular}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => goToArticle(item.id)}
          >
            <Image
              source={{ uri: getArticleImage(item) }}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{toTitleCase(item.title)}</Text>
              <Text style={styles.cardAuthor}>By {toTitleCase(item.author)}</Text>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {page > 1 && (
          <TouchableOpacity
            onPress={() => setPage((p) => p - 1)}
            style={styles.paginationButton}
          >
            <Ionicons name="chevron-back" size={20} color="#1c5461" />
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
        )}
        {hasMore && (
          <TouchableOpacity
            onPress={() => setPage((p) => p + 1)}
            style={[styles.paginationButton, styles.paginationNext]}
          >
            <Text style={[styles.paginationText, { color: "white" }]}>
              Load More
            </Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1" },
  header: { position: "relative", height: 200 },
  headerImage: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerTextContainer: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    color: "white",
    fontWeight: "900",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e6f7fa",
    marginTop: 5,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1c5461",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  carouselCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
    height: "100%",
    justifyContent: "flex-end",
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  carouselText: {
    padding: 16,
    zIndex: 10,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "white",
  },
  carouselAuthor: {
    fontSize: 12,
    color: "#e6f7fa",
    fontWeight: "600",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e6f7fa",
  },
  cardImage: {
    width: "100%",
    height: 160,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardContent: {
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1c5461",
  },
  cardAuthor: {
    color: "#51702c",
    fontSize: 11,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginVertical: 8,
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3e979f",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  paginationNext: {
    backgroundColor: "#3e979f",
    borderColor: "transparent",
  },
  paginationText: {
    color: "#1c5461",
    fontWeight: "600",
    marginHorizontal: 4,
  },
});
