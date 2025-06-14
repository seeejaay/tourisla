import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Fix the API URL for mobile devices
// On mobile, localhost/127.0.0.1 refers to the device itself, not your development machine
const API_URL = Platform.OS === 'web' 
  ? process.env.NEXT_PUBLIC_API_URL 
  : process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3000/api/v1/';

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
      console.log(`Fetching applications from: ${API_URL}applications/${operatorId}`);
      
      const response = await axios.get(`${API_URL}applications/${operatorId}`, {
        withCredentials: true,
        timeout: 15000, // Increased timeout to 15 seconds
      });
      
      console.log('Applications response:', response.data);
      setApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      
      // More detailed error handling
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response error data:', err.response.data);
          console.error('Response error status:', err.response.status);
          setError(`Server error (${err.response.status}). Please try again.`);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('Request error:', err.request);
          setError(`Network error. Cannot connect to ${API_URL}. Please check your API configuration and network connection.`);
        } else {
          // Something happened in setting up the request
          setError('Request configuration error. Please try again.');
        }
      } else {
        setError('Failed to load tour guide applications. Please try again.');
      }
      
      // Use mock data for development
      console.log('Using mock data due to API error');
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
        withCredentials: true,
        timeout: 10000
      });
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId 
            ? { ...app, application_status: 'APPROVED' } 
            : app
        )
      );
      
      Alert.alert("Success", "Application approved successfully");
    } catch (err) {
      console.error('Error approving application:', err);
      Alert.alert("Error", "Failed to approve application. Please try again.");
    }
  };

  const handleReject = async (applicationId: number) => {
    try {
      await axios.put(`${API_URL}applications/${applicationId}/reject`, {}, {
        withCredentials: true,
        timeout: 10000
      });
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId 
            ? { ...app, application_status: 'REJECTED' } 
            : app
        )
      );
      
      Alert.alert("Success", "Application rejected successfully");
    } catch (err) {
      console.error('Error rejecting application:', err);
      Alert.alert("Error", "Failed to reject application. Please try again.");
    }
  };

  const renderApplicationItem = ({ item }: { item: TourGuideApplication }) => {
    const isPending = item.application_status === 'PENDING';
    const isApproved = item.application_status === 'APPROVED';
    const isRejected = item.application_status === 'REJECTED';
    
    return (
      <View style={styles.applicationCard}>
        <View style={styles.applicationHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{item.first_name} {item.last_name}</Text>
            <View style={[
              styles.statusBadge,
              isPending ? styles.pendingBadge : 
              isApproved ? styles.approvedBadge : 
              styles.rejectedBadge
            ]}>
              <Text style={styles.statusText}>
                {isPending ? 'Pending' : isApproved ? 'Approved' : 'Rejected'}
              </Text>
            </View>
          </View>
          <Text style={styles.dateText}>
            Applied on {new Date(item.created_at).toLocaleDateString()}
          </Text>
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
        </View>
        
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>Reason for applying:</Text>
          <Text style={styles.reasonText}>{item.reason_for_applying}</Text>
        </View>
        
        {isPending && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(item.id)}
            >
              <Ionicons name="checkmark-outline" size={18} color="#ffffff" />
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(item.id)}
            >
              <Ionicons name="close-outline" size={18} color="#ffffff" />
              <Text style={styles.rejectButtonText}>Reject</Text>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0ea5e9']}
            tintColor="#0ea5e9"
          />
        }
      >
        <Text style={styles.headerText}>Tour Guide Applications</Text>
        <Text style={styles.subHeaderText}>Manage applications from tour guides</Text>
        
        <View style={styles.applicationsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text style={styles.loadingText}>Loading applications...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
              <View style={styles.errorActions}>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchApplications}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.mockDataButton}
                  onPress={() => {
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
                    setError('');
                  }}
                >
                  <Text style={styles.mockDataButtonText}>Use Mock Data</Text>
                </TouchableOpacity>
              </View>
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
              contentContainerStyle={styles.listContainer}
            />
          )}
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  applicationsContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
  },
  errorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  retryButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  mockDataButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  mockDataButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
  },
  listContainer: {
    gap: 16,
  },
  applicationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  applicationHeader: {
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  approvedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  rejectedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0f172a',
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
  },
  applicationDetails: {
    marginBottom: 12,
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
    marginBottom: 16,
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
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  approveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
  },
  rejectButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
  },
});
