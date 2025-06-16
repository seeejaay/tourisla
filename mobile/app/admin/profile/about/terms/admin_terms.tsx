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
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTermsManager } from '../../../../../lib/hooks/useTermsManager';

export default function AdminTerms() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { terms, loading, error, getTerms } = useTermsManager();

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      console.log("Loading terms...");
      setRefreshing(true);
      await getTerms();
    } catch (err) {
      console.error('Error loading terms:', err);
      
      // Show a user-friendly error message
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
    router.push('/admin/profile/about/terms/admin_term_add');
  };

  const handleViewTerm = (id) => {
    router.push(`/admin/profile/about/terms/admin_term_view?id=${id}`);
  };

  const formatPolicyType = (type) => {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.termCard}
      onPress={() => handleViewTerm(item.id)}
    >
      <View style={styles.termHeader}>
        <Text style={styles.termTitle}>{formatPolicyType(item.type || item.title)}</Text>
        <View style={[styles.badge, item.is_active ? styles.activeBadge : styles.inactiveBadge]}>
          <Text style={styles.badgeText}>{item.is_active ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      
      <View style={styles.termMeta}>
        <View style={styles.metaItem}>
          <Feather name="tag" size={14} color="#64748b" />
          <Text style={styles.metaText}>v{item.version}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="clock" size={14} color="#64748b" />
          <Text style={styles.metaText}>
            {new Date(item.updated_at || item.last_updated).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.termPreview} numberOfLines={2}>
        {item.content}
      </Text>
      
      <View style={styles.viewMore}>
        <Text style={styles.viewMoreText}>View Details</Text>
        <Feather name="chevron-right" size={16} color="#3498db" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTerm}
        >
          <Feather name="plus" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading terms...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
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
              colors={['#3498db']}
              tintColor="#3498db"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={64} color="#94a3b8" />
              <Text style={styles.emptyText}>No terms & conditions found</Text>
              <TouchableOpacity 
                style={styles.addFirstButton}
                onPress={handleAddTerm}
              >
                <Text style={styles.addFirstButtonText}>Add First Policy</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  termCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
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
    color: '#1e293b',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  inactiveBadge: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16a34a',
  },
  termMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  termPreview: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 12,
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3498db',
    marginRight: 4,
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
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  addFirstButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});



