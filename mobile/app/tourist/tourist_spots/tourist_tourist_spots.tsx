import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/Feather";
import { useTouristSpotManager } from '../../../hooks/useTouristSpotManager';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

export default function TouristTouristSpotsScreen({ headerHeight }) {
  const router = useRouter();
  const { touristSpots, loading, error, fetchTouristSpots, deleteTouristSpot } = useTouristSpotManager();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);

  // Fetch tourist spots when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchTouristSpots();
    }, [fetchTouristSpots])
  );

  // Filter tourist spots based on search query and selected type
  const filteredTouristSpots = touristSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || spot.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get unique types from tourist spots
  const spotTypes = [...new Set(touristSpots.map(spot => spot.type))];

  // Handle delete tourist spot
  const handleDelete = (id, name) => {
    Alert.alert(
      "Delete Tourist Spot",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTouristSpot(id);
              fetchTouristSpots(); // Refresh the list
            } catch (error) {
              Alert.alert("Error", "Failed to delete tourist spot. Please try again.");
            }
          }
        }
      ]
    );
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

  // Helper function to get image URL from different possible formats
  const getImageUrl = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return null;
    }
    
    const firstImage = images[0];
    
    // If it's a string, use it directly
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    
    // If it's an object with image_url property
    if (typeof firstImage === 'object' && firstImage !== null) {
      return firstImage.image_url || firstImage.url || firstImage.uri || null;
    }
    
    return null;
  };

  // Render tourist spot card
  const renderTouristSpotCard = ({ item }) => {
    const typeColor = getTypeColor(item.type);
    const imageUrl = getImageUrl(item.images);
    
    return (
      <View style={styles.card}>
        {/* Image Section with Gradient Overlay */}
        <View style={styles.cardImageContainer}>
          {imageUrl ? (
            <>
              <Image
                source={{ uri: imageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
                onError={(e) => {
                  console.error('Error loading image:', e.nativeEvent.error);
                  console.log('Failed image URL:', imageUrl);
                }}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.imageGradient}
              />
            </>
          ) : (
            <View style={[styles.noImagePlaceholder, { backgroundColor: `${typeColor}20` }]}>
              <Icon name="image" size={40} color={typeColor} />
            </View>
          )}
          
          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          
          {/* Title overlay on image */}
          <View style={styles.titleOverlay}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={14} color="#ffffff" />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.barangay}, {item.municipality}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => router.push(`/tourist/tourist_spots/tourist_tourist_spot_view?id=${item.id}`)}
          >
            <Icon name="eye" size={18} color="#ffffff" />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        {/* Search and Filter Section */}
        <View style={[styles.searchContainer, { marginTop: headerHeight + 10 }]}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tourist spots..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="x-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          {/* Type Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedType && styles.activeFilterChip
              ]}
              onPress={() => setSelectedType(null)}
            >
              <Text style={[
                styles.filterChipText,
                !selectedType && styles.activeFilterChipText
              ]}>All</Text>
            </TouchableOpacity>
            
            {spotTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  selectedType === type && styles.activeFilterChip,
                  selectedType === type && { backgroundColor: `${getTypeColor(type)}20` }
                ]}
                onPress={() => setSelectedType(type === selectedType ? null : type)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedType === type && styles.activeFilterChipText,
                  selectedType === type && { color: getTypeColor(type) }
                ]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Tourist Spots List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={styles.loadingText}>Loading tourist spots...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchTouristSpots()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredTouristSpots.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="search" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>
              {touristSpots.length === 0
                ? "No tourist spots found. Using mock data for demonstration."
                : "No tourist spots match your search criteria."}
            </Text>
            {touristSpots.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedType(null);
                }}
              >
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredTouristSpots}
            renderItem={renderTouristSpotCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f8fafc',
    zIndex: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },
  filterChipsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  activeFilterChip: {
    backgroundColor: '#0ea5e920',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeFilterChipText: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 120, // Increased padding for FAB and bottom navigation
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImageContainer: {
    position: 'relative',
    height: 180,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#0ea5e9',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
});










