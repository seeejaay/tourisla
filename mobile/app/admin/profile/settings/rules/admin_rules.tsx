import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  SafeAreaView, StatusBar, Platform, ActivityIndicator, Alert,
  RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRuleManager } from '@/hooks/useRuleManager';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

export default function AdminRulesScreen() {
  const { rules, loading, error, getRules, deleteRule } = useRuleManager();
  const [refreshing, setRefreshing] = useState(false);

  // Load rules when the screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused, loading rules...");
      loadRules();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // Initial load
  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      console.log("Loading rules...");
      setRefreshing(true);
      await getRules();
    } catch (err) {
      console.error('Error loading rules:', err);
      
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
    await loadRules();
  };

  const handleAddRule = () => {
    router.push('/admin/profile/settings/rules/rules_add');
  };

  const handleViewRule = (id: string) => {
    router.push(`/admin/profile/settings/rules/rules_view?id=${id}`);
  };

  const handleEditRule = (id: string) => {
    router.push(`/admin/profile/settings/rules/rules_edit?id=${id}`);
  };

  const handleDeleteRule = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this rule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRule(id);
              Alert.alert('Success', 'Rule deleted successfully');
              // Refresh the list after deletion
              loadRules();
            } catch (err) {
              console.error('Error deleting rule:', err);
              Alert.alert('Error', 'Failed to delete rule');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.ruleCard}>
      <View style={styles.ruleHeader}>
        <Text style={styles.ruleTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge, 
          item.is_active ? styles.activeBadge : styles.inactiveBadge
        ]}>
          <Text style={styles.statusText}>
            {item.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.ruleCategory}>Category: {item.category}</Text>
      <Text style={styles.ruleDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => handleViewRule(item.id)}
        >
          <Feather name="eye" size={16} color="#fff" />
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEditRule(item.id)}
        >
          <Feather name="edit" size={16} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteRule(item.id)}
        >
          <Feather name="trash-2" size={16} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rules & Regulations</Text>
        <TouchableOpacity onPress={handleAddRule} style={styles.addButton}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRules}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rules}
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
                <Text style={styles.loadingText}>Loading rules...</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No rules found</Text>
                <Text style={styles.emptySubText}>Tap the + button to add a new rule</Text>
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
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  ruleCard: {
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
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleTitle: {
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
  ruleCategory: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
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
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
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
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});


