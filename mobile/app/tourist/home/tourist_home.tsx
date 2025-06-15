import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { fetchPopularTouristSpots } from '@/lib/api/dashboard';
import { searchLocations, getNearbyAttractions } from '@/lib/api/tripAdvisor';
import { getCurrentWeather, getWeatherIconUrl } from '@/lib/api/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '@/lib/api/auth';

export default function TouristHomeScreen({ headerHeight }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popularSpots, setPopularSpots] = useState([]);
  const [tripAdvisorAttractions, setTripAdvisorAttractions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [locationError, setLocationError] = useState('');
  const router = useRouter();
  
  // Add weather state
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [showWeatherPreview, setShowWeatherPreview] = useState(false);

  // Force a default user to prevent loading issues
  useEffect(() => {
    if (!user) {
      setUser({
        first_name: "Guest",
        last_name: "User",
      });
    }
  }, []);

  // Get user location
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission not granted');
        return null;
      }

      // First try to get a quick location
      const quickLocation = await Location.getLastKnownPositionAsync();
      
      // Then get a more accurate location
      const preciseLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation, // Highest possible accuracy
        timeInterval: 1000,
        distanceInterval: 10,
      });
      
      return {
        latitude: preciseLocation.coords.latitude,
        longitude: preciseLocation.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Could not get your location');
      return null;
    }
  };

  // Add function to fetch weather data
  const fetchWeatherData = async () => {
    try {
      setWeatherLoading(true);
      setWeatherError('');
      
      const coords = await getUserLocation();
      if (!coords) {
        setWeatherError('Location unavailable');
        setWeatherLoading(false);
        return;
      }
      
      const data = await getCurrentWeather(coords.latitude, coords.longitude);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeatherError('Failed to load weather data');
    } finally {
      setWeatherLoading(false);
    }
  };

  // Toggle weather preview
  const toggleWeatherPreview = () => {
    if (!showWeatherPreview && !weatherData && !weatherLoading) {
      fetchWeatherData();
    }
    setShowWeatherPreview(!showWeatherPreview);
  };

  // Navigate to full weather page
  const navigateToWeather = () => {
    router.push('/tourist/weather');
  };

  // Open TripAdvisor link
  const openTripAdvisorLink = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => 
        Alert.alert('Error', 'Could not open the link')
      );
    }
  };

  // Load data function - add weather data loading
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load popular spots
      try {
        const spotsData = await fetchPopularTouristSpots(5);
        if (spotsData && spotsData.length > 0) {
          setPopularSpots(spotsData);
        } else {
          // Use mock data if API fails
          setPopularSpots([
            { id: 1, name: "Chocolate Hills", image_url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500" },
            { id: 2, name: "Panglao Beach", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500" },
            { id: 3, name: "Tarsier Sanctuary", image_url: "https://images.unsplash.com/photo-1544979590-37e9b4a31c41?w=500" },
          ]);
        }
      } catch (error) {
        console.error("Error loading popular spots:", error);
        // Use mock data
        setPopularSpots([
          { id: 1, name: "Chocolate Hills", image_url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500" },
          { id: 2, name: "Panglao Beach", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500" },
          { id: 3, name: "Tarsier Sanctuary", image_url: "https://images.unsplash.com/photo-1544979590-37e9b4a31c41?w=500" },
        ]);
      }
      
      // Load TripAdvisor data
      try {
        const coords = await getUserLocation();
        if (coords) {
          // Also fetch weather data while we have coordinates
          fetchWeatherData();
          
          // Continue with TripAdvisor data
          const attractions = await getNearbyAttractions(
            coords.latitude,
            coords.longitude,
            10,
            5
          );
          
          if (attractions && attractions.length > 0) {
            setTripAdvisorAttractions(attractions);
          } else {
            // Use mock data if API returns empty
            setTripAdvisorAttractions([
              {
                location_id: "mock1",
                name: "Local Historical Museum",
                description: "A fascinating museum showcasing local history",
                web_url: "https://www.tripadvisor.com",
                rating: 4.5,
                num_reviews: 128,
                photo: { images: { medium: { url: "https://images.unsplash.com/photo-1582034986517-30d163aa1da9?w=500" } } },
                category: { name: "Museum" }
              },
              {
                location_id: "mock2",
                name: "Beachside Restaurant",
                description: "Delicious seafood with ocean views",
                web_url: "https://www.tripadvisor.com",
                rating: 4.2,
                num_reviews: 85,
                photo: { images: { medium: { url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500" } } },
                category: { name: "Restaurant" }
              },
            ]);
          }
        } else {
          // Use mock data if location not available
          setTripAdvisorAttractions([
            {
              location_id: "mock1",
              name: "Local Historical Museum",
              description: "A fascinating museum showcasing local history",
              web_url: "https://www.tripadvisor.com",
              rating: 4.5,
              num_reviews: 128,
              photo: { images: { medium: { url: "https://images.unsplash.com/photo-1582034986517-30d163aa1da9?w=500" } } },
              category: { name: "Museum" }
            },
            {
              location_id: "mock2",
              name: "Beachside Restaurant",
              description: "Delicious seafood with ocean views",
              web_url: "https://www.tripadvisor.com",
              rating: 4.2,
              num_reviews: 85,
              photo: { images: { medium: { url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500" } } },
              category: { name: "Restaurant" }
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading TripAdvisor data:", error);
        // Use mock data
        setTripAdvisorAttractions([
          {
            location_id: "mock1",
            name: "Local Historical Museum",
            description: "A fascinating museum showcasing local history",
            web_url: "https://www.tripadvisor.com",
            rating: 4.5,
            num_reviews: 128,
            photo: { images: { medium: { url: "https://images.unsplash.com/photo-1582034986517-30d163aa1da9?w=500" } } },
            category: { name: "Museum" }
          },
          {
            location_id: "mock2",
            name: "Beachside Restaurant",
            description: "Delicious seafood with ocean views",
            web_url: "https://www.tripadvisor.com",
            rating: 4.2,
            num_reviews: 85,
            photo: { images: { medium: { url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500" } } },
            category: { name: "Restaurant" }
          },
        ]);
      }
    } catch (error) {
      console.error('Error in loadData:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
    
    // Try to get the real user in the background
    const fetchUser = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUser(JSON.parse(storedUserData));
        }
        
        const response = await auth.currentUser();
        if (response?.data?.user) {
          setUser(response.data.user);
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        // Already have a default user, so no need to handle error
      }
    };
    
    fetchUser();
  }, []);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  // Replace the existing loading check with this more forgiving version
  if (loading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading user...</Text>
      </View>
    );
  }

  // Use a default name if user is not available
  const userName = user ? user.first_name : "Tourist";

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome, {user?.first_name || 'Tourist'}!</Text>
        </View>
        
        {/* Popular Tourist Spots Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Tourist Spots</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#38bdf8" style={styles.loader} />
          ) : popularSpots && popularSpots.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {popularSpots.map((spot) => (
                <TouchableOpacity 
                  key={spot.id}
                  style={styles.spotCard}
                  onPress={() => router.push(`/tourist/spot/${spot.id}`)}
                >
                  <Image 
                    source={{ uri: spot.image_url || 'https://via.placeholder.com/150' }}
                    style={styles.spotImage}
                  />
                  <View style={styles.spotContent}>
                    <Text style={styles.spotName} numberOfLines={2}>
                      {spot.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No popular spots available</Text>
            </View>
          )}
        </View>
        
        {/* TripAdvisor Recommendations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TripAdvisor Recommendations</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#38bdf8" style={styles.loader} />
          ) : tripAdvisorAttractions && tripAdvisorAttractions.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {tripAdvisorAttractions.map((attraction, index) => (
                <TouchableOpacity 
                  key={attraction.location_id || `attraction-${index}`}
                  style={styles.tripAdvisorCard}
                  onPress={() => openTripAdvisorLink(attraction.web_url)}
                >
                  <Image 
                    source={{ 
                      uri: attraction.photo?.images?.medium?.url || 
                           'https://via.placeholder.com/150'
                    }}
                    style={styles.tripAdvisorImage}
                  />
                  <View style={styles.tripAdvisorBadge}>
                    <FontAwesome name="tripadvisor" size={16} color="#00aa6c" />
                  </View>
                  <View style={styles.tripAdvisorContent}>
                    <Text style={styles.tripAdvisorName} numberOfLines={1}>
                      {attraction.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>
                        {attraction.rating || 'N/A'}
                      </Text>
                      <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <FontAwesome 
                            key={star}
                            name={star <= Math.round(attraction.rating || 0) ? "star" : "star-o"} 
                            size={12} 
                            color="#f59e0b" 
                            style={styles.starIcon}
                          />
                        ))}
                      </View>
                      <Text style={styles.reviewCount}>
                        ({attraction.num_reviews || 0})
                      </Text>
                    </View>
                    <Text style={styles.tripAdvisorCategory} numberOfLines={1}>
                      {attraction.category?.name || 'Attraction'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                {locationError || 'No TripAdvisor recommendations available'}
              </Text>
            </View>
          )}
        </View>
        
        {/* Other sections of your home screen */}
      </ScrollView>
      
      {/* Weather FAB Button */}
      <TouchableOpacity 
        style={styles.weatherFab}
        onPress={() => router.push('/tourist/weather')}
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
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
  // TripAdvisor styles
  tripAdvisorCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  tripAdvisorImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  tripAdvisorBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripAdvisorContent: {
    padding: 12,
  },
  tripAdvisorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
    marginRight: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  starIcon: {
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 12,
    color: '#64748b',
  },
  tripAdvisorCategory: {
    fontSize: 12,
    color: '#64748b',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    color: '#64748b',
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#38bdf8',
    fontSize: 16,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  weatherFab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 140 : 130, 
    left: 16,
    backgroundColor: '#38bdf8',
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  weatherPreview: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  weatherPreviewContent: {
    width: '100%',
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherLocation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDesc: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  weatherError: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
  },
  weatherLoading: {
    textAlign: 'center',
    padding: 10,
    color: '#666',
  },
  weatherViewMore: {
    textAlign: 'right',
    color: '#38bdf8',
    fontSize: 12,
    marginTop: 5,
  },
});
