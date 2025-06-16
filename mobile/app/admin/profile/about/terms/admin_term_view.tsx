import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTermsManager } from '@/lib/hooks/useTermsManager';

export default function AdminTermView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getTerm, removeTerm } = useTermsManager();

  useEffect(() => {
    fetchTerm();
  }, [id]);

  const fetchTerm = async () => {
    try {
      setLoading(true);
      
      const response = await getTerm(id);
      
      // Format the response data
      const formattedTerm = {
        id: response.id.toString(),
        title: response.type || response.title,
        content: response.content,
        version: response.version,
        is_active: response.is_active !== undefined ? response.is_active : true,
        created_at: response.created_at || response.last_updated || new Date().toISOString(),
        updated_at: response.last_updated || response.updated_at || new Date().toISOString()
      };
      
      setTerm(formattedTerm);
    } catch (error) {
      console.error('Error fetching term:', error);
      Alert.alert('Error', 'Failed to load term details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Terms & Conditions',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTerm(id);
              Alert.alert('Success', 'Terms & Conditions deleted successfully', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              console.error('Error deleting term:', error);
              Alert.alert('Error', 'Failed to delete terms & conditions');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/admin/profile/about/terms/admin_term_edit?id=${id}`);
  };

  const formatPolicyType = (type) => {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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
        <View style={{ width: 24 }} />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : term ? (
        <ScrollView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{formatPolicyType(term.title)}</Text>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, term.is_active ? styles.activeBadge : styles.inactiveBadge]}>
                  <Text style={styles.badgeText}>{term.is_active ? 'Active' : 'Inactive'}</Text>
                </View>
                <View style={styles.versionBadge}>
                  <Text style={styles.versionText}>v{term.version}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Feather name="calendar" size={16} color="#64748b" />
                <Text style={styles.metaText}>
                  Created: {new Date(term.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={16} color="#64748b" />
                <Text style={styles.metaText}>
                  Updated: {new Date(term.updated_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{term.content}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={handleEdit}
              >
                <Feather name="edit-2" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Feather name="trash-2" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>Term not found</Text>
          <TouchableOpacity 
            style={styles.backToListButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToListButtonText}>Back to List</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
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
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  versionText: {
    fontSize: 12,
    color: '#64748b',
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 24,
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
  contentBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  },
  backToListButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backToListButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
