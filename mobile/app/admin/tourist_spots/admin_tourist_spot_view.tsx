import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Share,
  FlatList,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTouristSpotManager } from '../../../hooks/useTouristSpotManager';
import { useAuth } from '../../../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2);

// Enhanced helper function to convert text from ALL CAPS to Sentence case
// and replace underscores with spaces
const toSentenceCase = (text: string) => {
  if (!text) return '';
  // Replace underscores with spaces
  const withSpaces = text.replace(/_/g, ' ');
  // Convert to lowercase
  const lowercase = withSpaces.toLowerCase();
  // Capitalize the first letter of each sentence
  return lowercase.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
};

export default function AdminTouristSpotViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getTouristSpotById, loading, error } = useTouristSpotManager();
  const { token } = useAuth();
  const [touristSpot, setTouristSpot] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchTouristSpot = async () => {
      if (id) {
        try {
          const data = await getTouristSpotById(id);
          if (data) {
            setTouristSpot(data);
          } else {
            Alert.alert('Error', 'Tourist spot not found');
            router.back();
          }
        } catch (error) {
          console.error('Error fetching tourist spot:', error);
          Alert.alert('Error', 'Failed to load tourist spot details');
          router.back();
        }
      }
    };

    fetchTouristSpot();
  }, [id, getTouristSpotById, router]);

  // First, let's add more detailed logging to understand the image data structure
  useEffect(() => {
    if (touristSpot && touristSpot.images) {
      console.log('Tourist spot images data type:', typeof touristSpot.images);
      console.log('Tourist spot images:', JSON.stringify(touristSpot.images));
      
      // Check if images is an array of strings or objects
      if (Array.isArray(touristSpot.images) && touristSpot.images.length > 0) {
        console.log('First image type:', typeof touristSpot.images[0]);
        console.log('First image value:', touristSpot.images[0]);
      }
    }
  }, [touristSpot]);

  const handleOpenMap = () => {
    if (!touristSpot?.latitude || !touristSpot?.longitude) {
      Alert.alert('Error', 'Location coordinates not available');
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${touristSpot.latitude},${touristSpot.longitude}`;
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Could not open map application');
    });
  };

  const handleCall = () => {
    if (!touristSpot?.contact_number) {
      Alert.alert('Error', 'Contact number not available');
      return;
    }

    const phoneNumber = touristSpot.contact_number.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      Alert.alert('Error', 'Could not open phone application');
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${touristSpot.name} in ${touristSpot.municipality}, ${touristSpot.barangay}! ${touristSpot.description}`,
        title: touristSpot.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderImageItem = ({ item, index }) => {
    console.log(`Rendering image ${index}, item type:`, typeof item);
    
    // Handle different possible data structures
    let imageUrl;
    
    if (typeof item === 'string') {
      imageUrl = item.trim();
    } else if (item && typeof item === 'object') {
      // Try to extract URL from object (could be image_url, url, uri, etc.)
      imageUrl = item.image_url || item.url || item.uri || '';
      if (imageUrl) imageUrl = imageUrl.trim();
    }
    
    console.log(`Image ${index} URL:`, imageUrl);
    
    return (
      <View style={styles.carouselItem}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.carouselImage}
            resizeMode="cover"
            onError={(e) => {
              console.error(`Error loading image ${index}:`, e.nativeEvent.error);
              console.log(`Failed URL: ${imageUrl}`);
            }}
          />
        ) : (
          <View style={[styles.noImagePlaceholder, { backgroundColor: `${typeColor}20` }]}>
            <FontAwesome5 name="image" size={40} color="#fff" />
            <Text style={styles.noImageText}>Image not available</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDayBadge = (day) => {
    const isOpen = touristSpot.days_open && touristSpot.days_open.includes(day);
    return (
      <View key={day} style={[styles.dayBadge, isOpen ? styles.openDay : styles.closedDay]}>
        <Text style={[styles.dayText, isOpen ? styles.openDayText : styles.closedDayText]}>
          {day.substring(0, 3)}
        </Text>
      </View>
    );
  };

  // Get a color based on the tourist spot type
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
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

  // Return loading, error, and not found states similar to announcement view
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Loading tourist spot...</Text>
        </View>
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
      
      {/* Top Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleShare}
        >
          <FontAwesome5 name="share-alt" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        {touristSpot.images && Array.isArray(touristSpot.images) && touristSpot.images.length > 0 ? (
          <View style={styles.imageContainer}>
            <FlatList
              ref={carouselRef}
              data={touristSpot.images}
              renderItem={renderImageItem}
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
          
          {/* Open Days */}
          <View style={styles.daysContainer}>
            <Text style={styles.daysLabel}>Open Days</Text>
            <View style={styles.daysRow}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(renderDayBadge)}
            </View>
          </View>
          
          {/* Contact Information */}
          {(touristSpot.contact_number || touristSpot.email || touristSpot.facebook_page) && (
            <View style={styles.contactContainer}>
              <Text style={styles.contactLabel}>Contact Information</Text>
              
              {touristSpot.contact_number && (
                <TouchableOpacity 
                  style={styles.contactRow}
                  onPress={() => Linking.openURL(`tel:${touristSpot.contact_number}`)}
                >
                  <FontAwesome5 name="phone-alt" solid size={14} color={typeColor} />
                  <Text style={styles.contactText}>{touristSpot.contact_number}</Text>
                </TouchableOpacity>
              )}
              
              {touristSpot.email && (
                <TouchableOpacity 
                  style={styles.contactRow}
                  onPress={() => Linking.openURL(`mailto:${touristSpot.email}`)}
                >
                  <FontAwesome5 name="envelope" solid size={14} color={typeColor} />
                  <Text style={styles.contactText}>{touristSpot.email}</Text>
                </TouchableOpacity>
              )}
              
              {touristSpot.facebook_page && (
                <TouchableOpacity 
                  style={styles.contactRow}
                  onPress={() => Linking.openURL(touristSpot.facebook_page)}
                >
                  <FontAwesome5 name="facebook" brands size={14} color={typeColor} />
                  <Text style={styles.contactText}>{touristSpot.facebook_page}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Amenities */}
          {touristSpot.amenities && touristSpot.amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesLabel}>Amenities</Text>
              <View style={styles.amenitiesList}>
                {touristSpot.amenities.map((amenity, index) => (
                  <View key={`amenity-${index}`} style={styles.amenityBadge}>
                    <Text style={styles.amenityText}>{toSentenceCase(amenity)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Rules */}
          {touristSpot.rules && (
            <View style={styles.rulesContainer}>
              <Text style={styles.rulesLabel}>Rules & Guidelines</Text>
              <Text style={styles.rulesText}>
                {toSentenceCase(touristSpot.rules)}
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
    backgroundColor: '#0f172a',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#cbd5e1',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  backToListButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToListButtonText: {
    color: '#fff',
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
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 32,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginLeft: 8,
  },
  descriptionContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#cbd5e1',
  },
  feeContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  feeLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  feeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginLeft: 8,
    fontWeight: '600',
  },
  otherFeesText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    marginLeft: 22,
  },
  daysContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  daysLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  openDay: {
    backgroundColor: '#10b981',
  },
  closedDay: {
    backgroundColor: '#ef4444',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  contactContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  contactLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginLeft: 12,
  },
  amenitiesContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  amenitiesLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  rulesContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  rulesLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  rulesText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#cbd5e1',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5, // Ensure dots are above images
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
  noImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
  },
  noImageText: {
    marginTop: 8,
    fontSize: 16,
    color: '#94a3b8',
  },
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  
  // Redesigned cards
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0284c7',
    marginLeft: 8,
  },
  typeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 15,
    color: '#64748b',
    marginLeft: 6,
  },
  
  // Action buttons inside the card
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Common card style
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hoursText: {
    fontSize: 16,
    color: '#64748b',
  },
  daysTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  openDay: {
    backgroundColor: '#10b981',
  },
  closedDay: {
    backgroundColor: '#ef4444',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  openDayText: {
    color: '#ffffff',
  },
  closedDayText: {
    color: '#ffffff',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 6,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  feeText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 6,
  },
  otherFeesContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  otherFeesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  otherFeesText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityBadge: {
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#0f172a',
  },
  linkText: {
    color: '#38bdf8',
    textDecorationLine: 'underline',
  },
  mapButtonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  mapButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginLeft: 8,
    flex: 1,
  },
  linkText: {
    color: '#38bdf8',
    textDecorationLine: 'underline',
  },
});

















