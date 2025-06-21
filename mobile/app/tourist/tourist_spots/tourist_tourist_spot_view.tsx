import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Linking,
  FlatList,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTouristSpotManager } from '../../../hooks/useTouristSpotManager';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

export default function TouristTouristSpotView() {
  const { id } = useLocalSearchParams();
  const numericId = id ? Number(id) : null;
  const router = useRouter();
  const { fetchTouristSpots, loading, error } = useTouristSpotManager();
  interface TouristSpot {
    name: string;
    type: string;
    barangay: string;
    municipality: string;
    description: string;
    entrance_fee?: number;
    other_fees?: string;
    amenities?: string[];
    contact_number?: string;
    email?: string;
    additional_info?: string;
    latitude?: number;
    longitude?: number;
    images?: { image_url?: string; url?: string; uri?: string }[];
    opening_time?: string;
    closing_time?: string;
  }

  const [touristSpot, setTouristSpot] = useState<TouristSpot | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!numericId) return;
    const loadTouristSpot = async () => {
      try {
        const spot = await fetchTouristSpots(numericId);
        setTouristSpot(spot);
        console.log('Loaded tourist spot:', spot);
      } catch (err) {
        console.error('Error loading tourist spot:', err);
      }
    };

    loadTouristSpot();
  }, [numericId, fetchTouristSpots]);

  // Helper function to convert string to sentence case
  const toSentenceCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Get color based on tourist spot type
  const getTypeColor = (type) => {
    const colors = {
      'ADVENTURE': '#f97316',
      'BEACH': '#0ea5e9',
      'CAMPING': '#84cc16',
      'CULTURAL': '#8b5cf6',
      'HISTORICAL': '#f59e0b',
      'NATURAL': '#10b981',
      'RECREATIONAL': '#ec4899',
      'RELIGIOUS': '#6366f1',
      'OTHERS': '#64748b'
    };
    return colors[type] || '#64748b';
  };

  // Open Google Maps with the tourist spot location
  const handleOpenMap = () => {
    if (touristSpot && touristSpot.latitude && touristSpot.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${touristSpot.latitude},${touristSpot.longitude}`;
      Linking.openURL(url);
    } else {
      // If coordinates are not available, search by name
      const query = `${touristSpot.name}, ${touristSpot.barangay}, ${touristSpot.municipality}, Cebu`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      Linking.openURL(url);
    }
  };

  // Helper function to get image URL from different possible formats
  const getImageUrl = (image) => {
    if (!image) return null;
    
    // If it's a string, use it directly
    if (typeof image === 'string') {
      return image;
    }
    
    // If it's an object with image_url property
    if (typeof image === 'object' && image !== null) {
      return image.image_url || image.url || image.uri || null;
    }
    
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading tourist spot details...</Text>
      </View>
    );
  }

  if (error || !touristSpot) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <FontAwesome5 name="exclamation-triangle" size={50} color="#fbbf24" />
        <Text style={styles.errorTitle}>Tourist Spot Not Found</Text>
        <Text style={styles.errorText}>
          {error || "We couldn't find the tourist spot you're looking for."}
        </Text>
        <TouchableOpacity
          style={styles.backToListButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backToListButtonText}>Return to List</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const typeColor = getTypeColor(touristSpot.type);
  const formattedType = toSentenceCase(touristSpot.type);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Back Button */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        {touristSpot.images && Array.isArray(touristSpot.images) && touristSpot.images.length > 0 ? (
          <View style={styles.imageContainer}>
            <FlatList
              data={touristSpot.images}
              keyExtractor={(_, index) => `image-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={SCREEN_WIDTH}
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const slideIndex = Math.floor(
                  event.nativeEvent.contentOffset.x / 
                  event.nativeEvent.layoutMeasurement.width
                );
                setActiveImageIndex(slideIndex);
              }}
            />
            
            {/* Pagination dots - make them more visible */}
            {touristSpot.images.length > 1 && (
              <View style={styles.paginationContainer}>
                {touristSpot.images.map((_, index) => (
                  <View 
                    key={`dot-${index}`}
                    style={[
                      styles.paginationDot,
                      index === activeImageIndex ? styles.paginationDotActive : {}
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <LinearGradient
              colors={[typeColor, '#0f172a']}
              style={styles.noImageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="image" size={40} color="#fff" />
              <Text style={styles.noImageText}>No image available</Text>
            </LinearGradient>
          </View>
        )}
        
        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Type and Operating Hours */}
          <View style={styles.metaContainer}>
            <View style={[styles.typeTag, { backgroundColor: typeColor }]}>
              <Text style={styles.typeTagText}>{formattedType}</Text>
            </View>
            
            <View style={styles.hoursContainer}>
              <FontAwesome5 name="clock" solid size={14} color="#94a3b8" />
              <Text style={styles.hoursText}>
                {touristSpot.opening_time || 'N/A'} - {touristSpot.closing_time || 'N/A'}
              </Text>
            </View>
          </View>
          
          {/* Title */}
          <Text style={styles.title}>{toSentenceCase(touristSpot.name)}</Text>
          
          {/* Location */}
          <View style={styles.locationContainer}>
            <FontAwesome5 name="map-marker-alt" solid size={14} color={typeColor} />
            <Text style={styles.locationText}>
              {toSentenceCase(touristSpot.barangay)}, {toSentenceCase(touristSpot.municipality)}
            </Text>
          </View>
          
          {/* Map Button */}
          <View style={styles.mapButtonContainer}>
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={handleOpenMap}
            >
              <FontAwesome5 name="map" size={18} color="#ffffff" />
              <Text style={styles.mapButtonText}>View on Google Maps</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>About this place</Text>
            <Text style={styles.descriptionText}>
              {toSentenceCase(touristSpot.description)}
            </Text>
          </View>
          
          {/* Entrance Fee */}
          <View style={styles.feeContainer}>
            <Text style={styles.feeLabel}>Entrance Fee</Text>
            <View style={styles.feeContent}>
              <FontAwesome5 name="ticket-alt" solid size={14} color={typeColor} />
              <Text style={styles.feeText}>
                {touristSpot.entrance_fee ? `₱${touristSpot.entrance_fee}` : 'Free Entry'}
              </Text>
            </View>
            
            {touristSpot.other_fees && (
              <Text style={styles.otherFeesText}>
                {toSentenceCase(touristSpot.other_fees)}
              </Text>
            )}
          </View>
          
          {/* Amenities */}
          {touristSpot.amenities && touristSpot.amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesLabel}>Amenities</Text>
              <View style={styles.amenitiesBadgesContainer}>
                {touristSpot.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityBadge}>
                    <Text style={styles.amenityText}>{toSentenceCase(amenity)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Contact Information */}
          {(touristSpot.contact_number || touristSpot.email) && (
            <View style={styles.contactContainer}>
              <Text style={styles.contactLabel}>Contact Information</Text>
              
              {touristSpot.contact_number && (
                <View style={styles.contactItem}>
                  <FontAwesome5 name="phone" solid size={14} color={typeColor} />
                  <Text style={styles.contactText}>{touristSpot.contact_number}</Text>
                </View>
              )}
              
              {touristSpot.email && (
                <View style={styles.contactItem}>
                  <FontAwesome5 name="envelope" solid size={14} color={typeColor} />
                  <Text style={styles.contactText}>{touristSpot.email}</Text>
                </View>
              )}
            </View>
          )}
          
          {/* Additional Information */}
          {touristSpot.additional_info && (
            <View style={styles.additionalInfoContainer}>
              <Text style={styles.additionalInfoLabel}>Additional Information</Text>
              <Text style={styles.additionalInfoText}>
                {toSentenceCase(touristSpot.additional_info)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
  },
  errorTitle: {
    color: '#fbbf24',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  backToListButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToListButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
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
  scrollView: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    position: 'relative',
    backgroundColor: '#1e293b',
    marginBottom: 24, // Add space below the image container
  },
  carouselItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
  },
  noImageGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
    opacity: 0.8,
  },
  contentContainer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    zIndex: 1, // Ensure content is above the image
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeTagText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    color: '#94a3b8',
    marginLeft: 6,
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    color: '#94a3b8',
    marginLeft: 8,
    fontSize: 16,
  },
  mapButtonContainer: {
    marginBottom: 24,
  },
  mapButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#94a3b8',
  },
  feeContainer: {
    marginBottom: 24,
  },
  feeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  feeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeText: {
    color: '#94a3b8',
    marginLeft: 8,
    fontSize: 16,
  },
  otherFeesText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  amenitiesContainer: {
    marginBottom: 24,
  },
  amenitiesLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  amenitiesBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  contactContainer: {
    marginBottom: 24,
  },
  contactLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    color: '#94a3b8',
    marginLeft: 8,
    fontSize: 16,
  },
  additionalInfoContainer: {
    marginBottom: 24,
  },
  additionalInfoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  additionalInfoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#94a3b8',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
});


