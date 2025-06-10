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
  FlatList
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTouristSpotManager } from '../../../hooks/useTouristSpotManager';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TouristSpotView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { loading, error, getTouristSpotById } = useTouristSpotManager();
  const [touristSpot, setTouristSpot] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchTouristSpot = async () => {
      if (id) {
        const data = await getTouristSpotById(id);
        if (data) {
          setTouristSpot(data);
        }
      }
    };

    fetchTouristSpot();
  }, [id, getTouristSpotById]);

  const handleShare = async () => {
    if (!touristSpot) return;

    try {
      await Share.share({
        title: touristSpot.name,
        message: `Check out ${touristSpot.name} in Bohol! ${touristSpot.description}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOpenMap = () => {
    if (!touristSpot || !touristSpot.latitude || !touristSpot.longitude) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${touristSpot.latitude},${touristSpot.longitude}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    if (!touristSpot || !touristSpot.contact_number) return;

    Linking.openURL(`tel:${touristSpot.contact_number}`);
  };

  const handleWebsite = () => {
    if (!touristSpot || !touristSpot.website) return;

    Linking.openURL(touristSpot.website);
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

  const renderCarouselItem = ({ item }) => (
    <Image
      source={{ uri: item.image_url }}
      style={styles.carouselImage}
      resizeMode="cover"
    />
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveImageIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading tourist spot details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => getTouristSpotById(id)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!touristSpot) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="help-circle-outline" size={48} color="#f59e0b" />
        <Text style={styles.errorText}>Tourist spot not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const typeColor = getTypeColor(touristSpot.type);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {touristSpot.name}
        </Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        {touristSpot.images && touristSpot.images.length > 0 ? (
          <View style={styles.carouselContainer}>
            <FlatList
              ref={carouselRef}
              data={touristSpot.images}
              renderItem={renderCarouselItem}
              keyExtractor={(item, index) => `image-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
            />
            
            {/* Pagination Dots */}
            {touristSpot.images.length > 1 && (
              <View style={styles.paginationContainer}>
                {touristSpot.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === activeImageIndex && styles.paginationDotActive
                    ]}
                  />
                ))}
              </View>
            )}
            
            {/* Type Badge */}
            <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
              <Text style={styles.typeText}>{touristSpot.type}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.noImagePlaceholder, { backgroundColor: `${typeColor}20` }]}>
            <Ionicons name="image-outline" size={60} color={typeColor} />
            <Text style={{ color: typeColor, marginTop: 12, fontSize: 16 }}>No Images Available</Text>
            
            {/* Type Badge */}
            <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
              <Text style={styles.typeText}>{touristSpot.type}</Text>
            </View>
          </View>
        )}
        
        {/* Content */}
        <View style={styles.contentSection}>
          {/* Title and Location */}
          <Text style={styles.title}>{touristSpot.name}</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#64748b" />
            <Text style={styles.locationText}>
              {touristSpot.barangay}, {touristSpot.municipality}, Bohol
            </Text>
          </View>
          
          {/* Quick Info */}
          <View style={styles.quickInfoContainer}>
            {touristSpot.entrance_fee ? (
              <View style={styles.quickInfoItem}>
                <Ionicons name="cash-outline" size={18} color="#64748b" />
                <Text style={styles.quickInfoText}>
                  {typeof touristSpot.entrance_fee === 'number' 
                    ? `₱${touristSpot.entrance_fee.toFixed(2)}` 
                    : touristSpot.entrance_fee}
                </Text>
              </View>
            ) : null}
            
            {touristSpot.opening_time && touristSpot.closing_time ? (
              <View style={styles.quickInfoItem}>
                <Ionicons name="time-outline" size={18} color="#64748b" />
                <Text style={styles.quickInfoText}>
                  {touristSpot.opening_time} - {touristSpot.closing_time}
                </Text>
              </View>
            ) : null}
            
            {touristSpot.contact_number ? (
              <TouchableOpacity 
                style={styles.quickInfoItem}
                onPress={handleCall}
              >
                <Ionicons name="call-outline" size={18} color="#64748b" />
                <Text style={[styles.quickInfoText, styles.linkText]}>
                  {touristSpot.contact_number}
                </Text>
              </TouchableOpacity>
            ) : null}
            
            {touristSpot.website ? (
              <TouchableOpacity 
                style={styles.quickInfoItem}
                onPress={handleWebsite}
              >
                <Ionicons name="globe-outline" size={18} color="#64748b" />
                <Text style={[styles.quickInfoText, styles.linkText]} numberOfLines={1}>
                  Website
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          
          {/* Description */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{touristSpot.description}</Text>
          </View>
          
          {/* Amenities */}
          {touristSpot.amenities && touristSpot.amenities.length > 0 ? (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {touristSpot.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          
          {/* Activities */}
          {touristSpot.activities && touristSpot.activities.length > 0 ? (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Activities</Text>
              <View style={styles.activitiesContainer}>
                {touristSpot.activities.map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          
          {/* Additional Information */}
          {touristSpot.additional_info ? (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <Text style={styles.additionalInfoText}>{touristSpot.additional_info}</Text>
            </View>
          ) : null}
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

const styles = StyleSheet.create({
  safeArea: {
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
    paddingHorizontal: 24,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0ea5e9',
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
    backgroundColor: '#0f172a',
  },
  backButtonContainer: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  shareButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingBottom: 80, // Space for action buttons
  },
  carouselContainer: {
    position: 'relative',
    height: 300,
    width: SCREEN_WIDTH,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 300,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  noImagePlaceholder: {
    height: 300,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
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
  quickInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    minWidth: '45%',
  },
  quickInfoText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 6,
  },
  linkText: {
    color: '#0ea5e9',
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
  descriptionText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  amenitiesContainer: {
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 8,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  activityItem: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activityText: {
    fontSize: 14,
    color: '#334155',
  },
  additionalInfoText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
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
    backgroundColor: '#0ea5e9',
  },
  callButton: {
    backgroundColor: '#10b981',
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});


