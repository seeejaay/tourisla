import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTermsManager } from '../../../../../hooks/useTermsManager';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

export default function AdminTerms() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { terms, loading, error, getTerms, removeTerm } = useTermsManager();

  // Initial load
  useEffect(() => {
    loadTerms();
  }, []);

  // This effect will run every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("Terms screen focused, checking for updates...");
      const checkForUpdates = async () => {
        try {
          const termsUpdated = await AsyncStorage.getItem('termsUpdated');
          if (termsUpdated === 'true') {
            console.log("Terms were updated, refreshing list...");
            loadTerms();
            // Reset the flag
            await AsyncStorage.setItem('termsUpdated', 'false');
          }
        } catch (error) {
          console.error("Error checking for terms updates:", error);
        }
      };
      
      // Always refresh when screen comes into focus
      loadTerms();
      checkForUpdates();
      
      return () => {};
    }, [])
  );

  const loadTerms = async () => {
    try {
      console.log("Loading terms...");
      setRefreshing(true);
      await getTerms();
    } catch (err) {
      console.error('Error loading terms:', err);
      Alert.alert(
        'Connection Error',
        'Could not connect to the server. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await loadTerms();
  };

  const handleAddTerm = () => {
    router.push('/guide/profile/about/terms/guide_term_add');
  };

  const handleViewTerm = (id) => {
    router.push(`/guide/profile/about/terms/guide_term_view?id=${id}`);
  };

  const formatPolicyType = (type) => {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderItem = ({ item }) => {
    // Check if is_active exists and is a boolean, otherwise default to true
    const isActive = typeof item.is_active === 'boolean' ? item.is_active : true;
    
    return (
      <View style={styles.termCard}>
        <View style={styles.termHeader}>
          <Text style={styles.termTitle}>{formatPolicyType(item.type || item.title)}</Text>
          <View style={[
            styles.statusBadge, 
            isActive ? styles.activeBadge : styles.inactiveBadge
          ]}>
            <Text style={styles.statusText}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.termCategory}>Version: {item.version || '1.0'}</Text>
        <Text style={styles.termDescription} numberOfLines={2}>
          {item.content || 'No content available'}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => handleViewTerm(item.id)}
          >
            <Feather name="eye" size={16} color="#fff" />
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" backgroundColor="#0f172a" />
      
      {/* Header */}
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTerms}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={terms}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#0f172a']}
              tintColor="#0f172a"
            />
          }
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0f172a" />
                <Text style={styles.loadingText}>Loading terms & policies...</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Feather name="file-text" size={64} color="#cbd5e1" />
                <Text style={styles.emptyText}>No terms & policies found</Text>
                <TouchableOpacity style={styles.addFirstButton} onPress={handleAddTerm}>
                  <Text style={styles.addFirstButtonText}>Add First Document</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40, // Same width as the back button area
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  termCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  termTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#27c93f',
  },
  inactiveBadge: {
    backgroundColor: '#ff5f56',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  termCategory: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  termDescription: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  viewButton: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});





























