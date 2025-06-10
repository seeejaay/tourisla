import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useTouristSpotManager } from '../../../hooks/useTouristSpotManager';
import { useAuth } from '../../../hooks/useAuth';

export default function AdminTouristSpotsScreen({ headerHeight }) {
  const router = useRouter();
  const { touristSpots, loading, error, getAllTouristSpots, deleteTouristSpot } = useTouristSpotManager();
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const cardWidth = Dimensions.get('window').width - 32; 

  useFocusEffect(
    useCallback(() => {
      loadTouristSpots();
    }, [])
  );

  const loadTouristSpots = async () => {
    try {
      await getAllTouristSpots();
    } catch (err) {
      console.error('Failed to load tourist spots:', err);
      Alert.alert(
        'Error',
        'Failed to load tourist spots. Please check your internet connection and try again.'
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTouristSpots();
    setRefreshing(false);
  };

  const handleDeleteTouristSpot = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this tourist spot? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteTouristSpot(id, token);
              if (success) {
                Alert.alert('Success', 'Tourist spot deleted successfully');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to delete tourist spot');
            }
          }
        }
      ]
    );
  };

  // Filter tourist spots based on search query
  const filteredTouristSpots = touristSpots.filter(spot => 
    spot.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.municipality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.barangay?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTouristSpotItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/admin/tourist_spots/admin_tourist_spot_view?id=${item.id}`)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.type} • {item.municipality}, {item.barangay}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push(`/admin/tourist_spots/admin_tourist_spot_edit?id=${item.id}`)}
        >
          <Ionicons name="create-outline" size={18} color="#ffffff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteTouristSpot(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#ffffff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        {/* Header with Add Button */}
        <View style={[styles.header, { marginTop: headerHeight }]}>
          <Text style={styles.headerTitle}>Tourist Spots</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/admin/tourist_spots/admin_tourist_spot_add')}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
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
        </View>
        
        {/* Loading Indicator */}
        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingText}>Loading tourist spots...</Text>
          </View>
        )}
        
        {/* Error Message */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadTouristSpots}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Tourist Spots List */}
        {!loading && !error && (
          <>
            {filteredTouristSpots.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="information-circle" size={48} color="#94a3b8" />
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No tourist spots match your search.' : 'No tourist spots found.'}
                </Text>
                {searchQuery && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={styles.clearSearchText}>Clear search</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <FlatList
                data={filteredTouristSpots}
                renderItem={renderTouristSpotItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#0284c7']}
                  />
                }
              />
            )}
          </>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  listContainer: {
    padding: 16,
    paddingTop: 8,
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
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#0ea5e9',
  },
  editButton: {
    backgroundColor: '#f59e0b',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 10
  },
  clearSearchText: {
    color: '#0284c7',
    fontWeight: '600',
    fontSize: 16
  }
});


