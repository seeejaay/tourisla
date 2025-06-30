import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '@/lib/api/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { useArticleManager } from "@/hooks/useArticleManager";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const { width } = Dimensions.get('window');

const touristSpots = [
  require('@/assets/images/nature/sea.jpg'),
  require('@/assets/images/nature/sun.jpg'),
  require('@/assets/images/nature/sand.jpg'),
  require('@/assets/images/camp_sawi.webp'),
];

export default function TouristHome() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const { articles, loading: loadingArticles } = useArticleManager();

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require('@/assets/images/bg_hero.webp')}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['rgb(230, 247, 250)', 'transparent']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Discover <Text style={{ color: '#f0be2a' }}>Bantayan</Text> Island</Text>
            <Text style={styles.heroSubtitle}>
              Where emerald jungles meet turquoise waters in perfect harmony
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => router.push('/listings')}
              >
                <FontAwesome5 name="users" size={16} color="#fff" />
                <Text style={styles.exploreBtnText}> Explore Accommodation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Introduction Section */}
        <LinearGradient
          colors={['rgb(230, 247, 250)', '#fffff1']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 5}}
          style={styles.introSection}
        >
          <Text style={styles.sectionTitle}>Your Island Escape Awaits</Text>
          <View style={styles.sectionUnderline} />
          <Text style={styles.sectionText}>
            Immerse yourself in the breathtaking beauty of Bantayan Island—where crystal-clear waters, lush jungles, and vibrant local culture create the perfect getaway. Whether you seek adventure, relaxation, or a taste of authentic island life, Bantayan offers something for every traveler.
          </Text>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <FontAwesome5 name="leaf" size={24} color="#019375" />
              <Text style={styles.cardTitle}>Eco-Friendly Adventures</Text>
              <Text style={styles.cardText}>Explore pristine beaches, hidden lagoons, and scenic trails while supporting sustainable tourism and local communities.</Text>
            </View>
            <View style={styles.card}>
              <Feather name="map-pin" size={24} color="#3e979f" />
              <Text style={styles.cardTitle}>Rich Culture & Heritage</Text>
              <Text style={styles.cardText}>Experience the warmth of Bantayan’s people, savor local delicacies, and discover the island’s unique traditions and history.</Text>
            </View>
            <View style={styles.card}>
              <Feather name="umbrella" size={24} color="#f8d56b" />
              <Text style={styles.cardTitle}>Unwind & Reconnect</Text>
              <Text style={styles.cardText}>Find your sanctuary in tranquil resorts, enjoy breathtaking sunsets, and reconnect with nature and yourself.</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Must-See Tourist Spots */}
        <View style={styles.touristSpotSection}>
          <Text style={styles.sectionTitle}>Must-See Tourist Spots</Text>
          <View style={styles.sectionUnderline} />
          <Text style={styles.sectionText}>Discover the natural wonders and iconic destinations of Bantayan Island.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {touristSpots.map((spot, idx) => (
              <Image
                key={idx}
                source={spot}
                style={styles.spotImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Articles */}
        <View style={styles.articlesSection}>
          <Text style={styles.sectionTitle}>Island Heritage</Text>
          <View style={styles.sectionUnderline} />
          <Text style={styles.sectionText}>Read the history, culture, and stories that shape Bantayan Island</Text>
          {loadingArticles ? (
            <Text style={{ color: '#3e979f', textAlign: 'center' }}>Loading articles...</Text>
          ) : (
            articles.slice(0, 3).map((article) => (
            <TouchableOpacity
              key={article.id}
              onPress={() => router.push(`/guide/culture/${article.id}`)}
              style={styles.articleCard}
            >
              <Image
                source={{ uri: article.thumbnail_url }}
                style={styles.articleImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.gradientOverlay}
              />
              <View style={styles.articleOverlayContent}>
              <Text style={styles.articleTitleOverlay}>
                {article.title.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())}
              </Text>
              <Text style={styles.articleBodyOverlay}>
                {article.body.slice(0, 40).replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())}...
              </Text>
                <View style={styles.readMoreBtn}>
                  <Text style={styles.readMoreText}>Read more →</Text>
                </View>
              </View>
            </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Weather FAB Button */}
      <TouchableOpacity
        style={styles.weatherFab}
        onPress={() => router.push('/guide/weather')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff1',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    marginTop: 80,
    height: 370,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity:  0.3,
  },
  heroTextContainer: {
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#019375',
  },
  heroSubtitle: {
    color: '#618186',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  heroButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreBtn: {
    flexDirection: 'row',
    backgroundColor: '#019375',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#019375',
  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 12,
  },
  introSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1c5461',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionUnderline: {
    width: 96,
    height: 4,
    backgroundColor: '#3e979f',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 14,
    color: '#51702c',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c5461',
    marginTop: 8,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 12,
    color: '#51702c',
    textAlign: 'center',
    marginTop: 4,
  },
  touristSpotSection: {
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  spotImage: {
    width: width * 0.7,
    height: 200,
    borderRadius: 16,
    marginRight: 16,
    marginBottom: 8,
  },
  weatherFab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 108,
    left: 8,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#24b4ab',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  articlesSection: {
    marginTop: 20,
    paddingBottom: 60,
    backgroundColor: '#fffff1',
  },
  articleCard: {
    width: width * 0.89,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    alignSelf: 'center',
    elevation: 5,
    backgroundColor: '#000', // fallback color
  },
  
  articleImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  
  articleOverlayContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  
  articleTitleOverlay: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    marginBottom: 4,
  },
  
  articleBodyOverlay: {
    fontSize: 14,
    color: '#f1f1f1',
  },
  
  readMoreBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#24b4ab',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  
  readMoreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
