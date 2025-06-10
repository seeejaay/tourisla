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
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTouristSpotManager } from '../../../hooks/useTouristSpotManager';
import { useAuth } from '../../../hooks/useAuth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2);

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

  const handleOpenMap = () => {
    if (!touristSpot?.latitude || !touristSpot?.longitude) {
      Alert.alert('Error', 'Location coordinates not available');
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${touristSpot.latitude},${touristSpot.longitude}`;
    Linking.openURL(url).catch(err => {
      console.error('Error opening map:', err);
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
      console.error('Error making call:', err);
      Alert.alert('Error', 'Could not open phone application');
    });
  };

  const handleOpenFacebook = () => {
    if (!touristSpot?.facebook_page) {
      Alert.alert('Error', 'Facebook page not available');
      return;
    }

    let url = touristSpot.facebook_page;
    // Ensure URL has proper protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    Linking.openURL(url).catch(err => {
      console.error('Error opening Facebook page:', err);
      Alert.alert('Error', 'Could not open browser');
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

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={styles.carouselItem}
      onPress={() => {
        // Handle image press (e.g., open fullscreen gallery)
      }}
    >
      <Image 
        source={{ uri: item.image_url }} 
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.loadingText}>Loading tourist spot details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!touristSpot) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="help-circle" size={48} color="#94a3b8" />
        <Text style={styles.errorText}>Tourist spot not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0284c7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {touristSpot.name}
        </Text>
        <TouchableOpacity 
          style={styles.shareBtn}
          onPress={handleShare}
        >
          <Ionicons name="share-social-outline" size={24} color="#0284c7" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        {touristSpot.images && touristSpot.images.length > 0 ? (
          <View style={styles.carouselContainer}>
            <FlatList
              ref={carouselRef}
              data={touristSpot.images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => `image-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const slideIndex = Math.floor(
                  event.nativeEvent.contentOffset.x / 
                  event.nativeEvent.layoutMeasurement.width
                );
                setActiveImageIndex(slideIndex);
              }}
            />
            
            {/* Pagination dots */}
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
            <Ionicons name="image-outline" size={60} color="#94a3b8" />
            <Text style={styles.noImageText}>No images available</Text>
          </View>
        )}

        {/* Tourist Spot Details */}
        <View style={styles.detailsContainer}>
          {/* Name and Type */}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{touristSpot.name}</Text>
            <View style={[styles.typeBadge, getTypeStyle(touristSpot.type).badge]}>
              <Text style={styles.typeText}>{touristSpot.type}</Text>
            </View>
          </View>
          
          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#64748b" />
            <Text style={styles.locationText}>
              {touristSpot.barangay}, {touristSpot.municipality}
            </Text>
          </View>
          
          {/* Description */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{touristSpot.description}</Text>
          </View>
          
          {/* Rules */}
          {touristSpot.rules && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Rules & Guidelines</Text>
              <View style={styles.rulesContainer}>
                <Text style={styles.rulesText}>{touristSpot.rules}</Text>
              </View>
            </View>
          )}
          
          {/* Opening Hours */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={18} color="#64748b" />
              <Text style={styles.timeText}>
                {touristSpot.opening_time || 'Not specified'} - {touristSpot.closing_time || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.daysContainer}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                renderDayBadge(day)
              ))}
            </View>
          </View>
          
          {/* Contact Information */}
          {(touristSpot.contact_number || touristSpot.facebook_page) && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              {touristSpot.contact_number && (
                <View style={styles.contactContainer}>
                  <Ionicons name="call-outline" size={18} color="#64748b" />
                  <Text style={styles.contactText}>{touristSpot.contact_number}</Text>
                </View>
              )}
              
              {touristSpot.facebook_page && (
                <TouchableOpacity 
                  style={styles.contactContainer}
                  onPress={handleOpenFacebook}
                >
                  <Ionicons name="logo-facebook" size={18} color="#1877f2" />
                  <Text style={[styles.contactText, styles.linkText]}>
                    {touristSpot.facebook_page}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Fees */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Fees</Text>
            <View style={styles.feeContainer}>
              <Ionicons name="cash-outline" size={18} color="#64748b" />
              <Text style={styles.feeText}>
                Entrance: {touristSpot.entrance_fee ? `₱${touristSpot.entrance_fee}` : 'Free Entry'}
              </Text>
            </View>
            
            {touristSpot.other_fees && (
              <View style={styles.otherFeesContainer}>
                <Text style={styles.otherFeesTitle}>Additional Fees:</Text>
                <Text style={styles.otherFeesText}>{touristSpot.other_fees}</Text>
              </View>
            )}
          </View>
          
          {/* Coordinates */}
          {(touristSpot.latitude && touristSpot.longitude) && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Coordinates</Text>
              <View style={styles.coordinatesContainer}>
                <Ionicons name="navigate-outline" size={18} color="#64748b" />
                <Text style={styles.coordinatesText}>
                  {touristSpot.latitude}, {touristSpot.longitude}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.mapButton]}
          onPress={handleOpenMap}
          disabled={!touristSpot.latitude || !touristSpot.longitude}
        >
          <Ionicons name="map-outline" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>View on Map</Text>
        </TouchableOpacity>
        
        {touristSpot.contact_number && (
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={handleCall}
          >
            <Ionicons name="call-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
        )}
        
      </View>
    </SafeAreaView>
  );
}

// Helper function to get style based on tourist spot type
const getTypeStyle = (type) => {
  switch (type) {
    case 'NATURAL':
      return {
        badge: { backgroundColor: '#10b981' },
        text: { color: '#ffffff' }
      };
    case 'HISTORICAL':
      return {
        badge: { backgroundColor: '#8b5cf6' },
        text: { color: '#ffffff' }
      };
    case 'CULTURAL':
      return {
        badge: { backgroundColor: '#f59e0b' },
        text: { color: '#ffffff' }
      };
    case 'BEACH':
      return {
        badge: { backgroundColor: '#0ea5e9' },
        text: { color: '#ffffff' }
      };
    case 'RELIGIOUS':
      return {
        badge: { backgroundColor: '#6366f1' },
        text: { color: '#ffffff' }
      };
    default:
      return {
        badge: { backgroundColor: '#64748b' },
        text: { color: '#ffffff' }
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    zIndex: 10,
    elevation: 2,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  shareBtn: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Extra padding for action buttons
  },
  carouselContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: '#e2e8f0',
  },
  carouselItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 8,
    fontSize: 16,
    color: '#94a3b8',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: CARD_MARGIN,
    width: CARD_WIDTH,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  typeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 6,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
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
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    marginRight: 16,
  },
  timeText: {
    fontSize: 16,
    color: '#64748b',
  },
  daysContainer: {
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
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 6,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  feeText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 6,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  coordinatesText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 6,
  },
  adminActionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  adminActionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#10b981',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  adminActionButtonText: {
    color: '#ffffff',
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  mapButton: {
    backgroundColor: '#0284c7',
  },
  callButton: {
    backgroundColor: '#10b981',
  },
  facebookButton: {
    backgroundColor: '#1877f2',
  },
  actionButtonText: {
    color: '#ffffff',
    marginLeft: 8,
  },
  rulesContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  rulesText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
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
    color: '#334155',
    lineHeight: 24,
  },
  linkText: {
    color: '#1877f2',
    textDecorationLine: 'underline',
  },
});



