import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1/';

interface TourGuideApplication {
  id: number;
  tourguide_id: number;
  touroperator_id: number;
  reason_for_applying: string;
  application_status: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
}

export default function OperatorHomeScreen({ headerHeight }: { headerHeight: number }) {
  const [applications, setApplications] = useState<TourGuideApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [operatorId, setOperatorId] = useState<string | null>(null);

  useEffect(() => {
    // Get operator ID from auth or storage
    const fetchOperatorId = async () => {
      try {
        // This is a placeholder - you should get the actual operator ID from your auth system
        setOperatorId('1'); // Replace with actual ID retrieval
      } catch (err) {
        console.error('Error fetching operator ID:', err);
        setError('Failed to authenticate. Please log in again.');
      }
    };

    fetchOperatorId();
  }, []);

  useEffect(() => {
    if (operatorId) {
      fetchApplications();
    }
  }, [operatorId]);

  const fetchApplications = async () => {
    if (!operatorId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}applications/${operatorId}`, {
        withCredentials: true
      });
      
      setApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load tour guide applications. Please try again.');
      // Use mock data for development
      setApplications([
        {
          id: 1,
          tourguide_id: 101,
          touroperator_id: 1,
          reason_for_applying: "I have extensive knowledge of local attractions",
          application_status: "PENDING",
          created_at: "2023-06-15T10:30:00Z",
          updated_at: "2023-06-15T10:30:00Z",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          mobile_number: "+639123456789"
        },
        {
          id: 2,
          tourguide_id: 102,
          touroperator_id: 1,
          reason_for_applying: "I speak multiple languages and have 5 years experience",
          application_status: "APPROVED",
          created_at: "2023-06-10T14:20:00Z",
          updated_at: "2023-06-12T09:15:00Z",
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
          mobile_number: "+639187654321"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const handleApprove = async (applicationId: number) => {
    try {
      await axios.put(`${API_URL}applications/${applicationId}/approve`, {}, {
        withCredentials: true
      });
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId 
            ? { ...app, application_status: 'APPROVED' } 
            : app
        )
      );
    } catch (err) {
      console.error('Error approving application:', err);
      setError('Failed to approve application. Please try again.');
    }
  };

  const handleReject = async (applicationId: number) => {
    try {
      await axios.put(`${API_URL}applications/${applicationId}/reject`, {}, {
        withCredentials: true
      });
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId 
            ? { ...app, application_status: 'REJECTED' } 
            : app
        )
      );
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError('Failed to reject application. Please try again.');
    }
  };

  const renderApplicationItem = ({ item }: { item: TourGuideApplication }) => {
    const isPending = item.application_status === 'PENDING';
    const isApproved = item.application_status === 'APPROVED';
    const isRejected = item.application_status === 'REJECTED';
    
    return (
      <View style={styles.applicationCard}>
        <View style={styles.applicationHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.first_name.charAt(0)}{item.last_name.charAt(0)}
            </Text>
          </View>
          <View style={styles.applicationHeaderText}>
            <Text style={styles.applicantName}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.applicationDate}>
              Applied on {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            isPending ? styles.pendingBadge : 
            isApproved ? styles.approvedBadge : 
            styles.rejectedBadge
          ]}>
            <Text style={styles.statusText}>{item.application_status}</Text>
          </View>
        </View>
        
        <View style={styles.applicationDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.mobile_number}</Text>
          </View>
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>Reason for applying:</Text>
            <Text style={styles.reasonText}>{item.reason_for_applying}</Text>
          </View>
        </View>
        
        {isPending && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(item.id)}
            >
              <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
              <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(item.id)}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#10b981" />
              <Text style={[styles.actionButtonText, styles.approveButtonText]}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Tour Operator Dashboard</Text>
          <Text style={styles.subHeaderText}>Manage your tours and guides</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tour Guide Applications</Text>
            <TouchableOpacity onPress={fetchApplications}>
              <Ionicons name="refresh-outline" size={20} color="#0ea5e9" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text style={styles.loadingText}>Loading applications...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchApplications}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : applications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={40} color="#94a3b8" />
              <Text style={styles.emptyText}>No tour guide applications yet</Text>
            </View>
          ) : (
            <FlatList
              data={applications}
              renderItem={renderApplicationItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
                <Ionicons name="map-outline" size={24} color="#0ea5e9" />
              </View>
              <Text style={styles.quickActionText}>Create Tour</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Ionicons name="calendar-outline" size={24} color="#10b981" />
              </View>
              <Text style={styles.quickActionText}>View Bookings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                <Ionicons name="people-outline" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.quickActionText}>Manage Guides</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
                <Ionicons name="stats-chart-outline" size={24} color="#f97316" />
              </View>
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  applicationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  applicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applicationHeaderText: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  applicationDate: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  approvedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  rejectedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0f172a',
  },
  applicationDetails: {
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 8,
  },
  reasonContainer: {
    marginTop: 8,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  rejectButton: {
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  approveButton: {},
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  rejectButtonText: {
    color: '#ef4444',
  },
  approveButtonText: {
    color: '#10b981',
  },
  separator: {
    height: 12,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginHorizontal: -6,
  },
  quickActionCard: {
    width: '50%',
    padding: 6,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
});

