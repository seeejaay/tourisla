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
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTouristSpotManager } from '../../../hooks/useTouristSpotManager';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

export default function AdminTouristSpotsScreen({ headerHeight }) {
  const router = useRouter();
  const { touristSpots, loading, error, getAllTouristSpots, deleteTouristSpot } = useTouristSpotManager();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);

  // Fetch tourist spots when screen is focused
  useFocusEffect(
    useCallback(() => {
      getAllTouristSpots();
    }, [getAllTouristSpots])
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
              getAllTouristSpots(); // Refresh the list
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

  // Render tourist spot card
  const renderTouristSpotCard = ({ item }) => {
    const typeColor = getTypeColor(item.type);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardImageContainer}>
          {item.images && item.images.length > 0 ? (
            <Image
              source={{ uri: item.images[0].image_url }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.noImagePlaceholder, { backgroundColor: `${typeColor}20` }]}>
              <Ionicons name="image-outline" size={40} color={typeColor} />
              <Text style={{ color: typeColor, marginTop: 8 }}>No Image</Text>
            </View>
          )}
          <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.9}
          onPress={() => router.push(`/admin/tourist_spots/admin_tourist_spot_view?id=${item.id}`)}
        >
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#64748b" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.barangay}, {item.municipality}
            </Text>
          </View>
          
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.cardFooter}>
            {item.entrance_fee ? (
              <View style={styles.feeContainer}>
                <Ionicons name="cash-outline" size={14} color="#64748b" />
                <Text style={styles.feeText}>
                  {typeof item.entrance_fee === 'number' 
                    ? `₱${item.entrance_fee.toFixed(2)}` 
                    : item.entrance_fee}
                </Text>
              </View>
            ) : null}
            
            <View style={styles.hoursContainer}>
              <Ionicons name="time-outline" size={14} color="#64748b" />
              <Text style={styles.hoursText}>
                {item.opening_time && item.closing_time 
                  ? `${item.opening_time} - ${item.closing_time}` 
                  : 'Hours not specified'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Admin Action Buttons */}
        <View style={styles.adminActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push(`/admin/tourist_spots/admin_tourist_spot_edit?id=${item.id}`)}
          >
            <Ionicons name="create-outline" size={18} color="#ffffff" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={18} color="#ffffff" />
            <Text style={styles.actionButtonText}>Delete</Text>
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
            <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tourist spots..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#64748b" />
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
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => getAllTouristSpots()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredTouristSpots.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>
              {touristSpots.length === 0
                ? "No tourist spots found. Add one to get started."
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
        
        {/* Add FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/admin/tourist_spots/admin_tourist_spot_add')}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
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
    paddingBottom: 80, // Extra padding for FAB
  },
  card: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    position: 'relative',
    height: 180,
  },
  cardImage: {
    width: '100%',
    height: '100%',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    marginLeft: 4,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#0ea5e9',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});