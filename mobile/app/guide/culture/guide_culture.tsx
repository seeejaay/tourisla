import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useArticleManager } from "@/hooks/useArticleManager";
import { Article } from "@/static/article/useArticleSchema";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
const { width } = Dimensions.get('window');

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
          <FontAwesome5 name="arrow-left" size={18} color="#000" />
        </TouchableOpacity>
        </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Section - Now with horizontal scroll */}
        {featured.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.mainTitle}>Featured Articles</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featured.map((article) => (
                <TouchableOpacity
                key={article.id}
                style={styles.featuredCard}
                onPress={() => router.push(`/guide/culture/${article.id}`)}
              >
                {article.thumbnail_url && (
                  <View style={styles.featuredImageContainer}>
                    <Image
                      source={{ uri: article.thumbnail_url }}
                      style={styles.featuredThumbnail}
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.7)"]}
                      style={styles.featuredOverlay}
                    />
                    <View style={styles.featuredTextOverlay}>
                      <Text style={styles.featuredTitleOverlay} numberOfLines={2}>
                        {article.title}
                      </Text>
                      <Text style={styles.featuredAuthorOverlay}>By {article.author}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Regular Articles - Vertical List with "View All" button */}
        <View style={styles.section}>
          <View style={styles.moreHeader}>
            <Text style={styles.sectionTitle}>More Articles</Text>
            <TouchableOpacity onPress={() => router.push("/guide/culture")}>
              <Text style={styles.viewAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {paginatedRegular.slice(0, 3).map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCardVertical}
              onPress={() => router.push(`/guide/culture/${article.id}`)}
            >
              {article.thumbnail_url && (
                <Image 
                  source={{ uri: article.thumbnail_url }} 
                  style={styles.articleThumbnailVertical} 
                />
              )}
              <View style={styles.articleTextVertical}>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title.replace(/\b\w/g, char => char.toUpperCase())}
                </Text>
                <Text style={styles.articleAuthor}>By {article.author}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Modern Pagination */}
          <View style={styles.pagination}>
            {page > 1 && (
              <TouchableOpacity 
                onPress={() => setPage((p) => p - 1)} 
                style={[styles.paginationButton, styles.prevButton]}
              >
                <Ionicons name="chevron-back" size={16} color="#1d4ed8" />
                <Text style={styles.paginationButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            {hasMore && (
              <TouchableOpacity 
                onPress={() => setPage((p) => p + 1)} 
                style={[styles.paginationButton, styles.nextButton]}
              >
                <Text style={styles.paginationButtonText}>Load More</Text>
                <Ionicons name="chevron-forward" size={16} color="#1d4ed8" />
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  navButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1c5461',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c5461',
    marginBottom: 16,
    marginTop: 8,
  },
  featuredContainer: {
    paddingBottom: 8,
  },
  featuredCard: {
    width: width * 0.6, // narrower for portrait feel
    height: 240,        // taller card
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  featuredThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // keep it neat and cropped
  },
  featuredTextContainer: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  featuredAuthor: {
    fontSize: 12,
    color: '#64748b',
  },
  articlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  articleCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  articleThumbnail: {
    width: '100%',
    height: 120,
  },
  articleTextContainer: {
    padding: 10,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 4,
  },
  articleAuthor: {
    fontSize: 11,
    color: '#64748b',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 12,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  prevButton: {
    paddingRight: 12,
  },
  nextButton: {
    paddingLeft: 12,
  },
  paginationButtonText: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '500',
  },
  moreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#979a9f',
    fontWeight: '700',
  },
  articleCardVertical: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  articleThumbnailVertical: {
    width: 120,
    height: 100,
  },
  articleTextVertical: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },  
  featuredImageContainer: {
    position: "relative",
    width: "100%",
    height: "100%", // fill full card height
  },
  
  featuredOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    borderRadius: 12,
  },
  
  featuredTextOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  
  featuredTitleOverlay: {
    color: "#fff",
    fontSize: 18, // slightly larger
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  
  featuredAuthorOverlay: {
    color: "#e2e8f0",
    fontSize: 12,
    marginTop: 2,
  },
  
});