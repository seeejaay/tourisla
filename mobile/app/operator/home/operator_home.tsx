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
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Fix the API URL for mobile devices
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
  const router = useRouter();
  const [applications, setApplications] = useState<TourGuideApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [operatorId, setOperatorId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

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
      
      // Calculate stats
      const pending = response.data.filter(app => app.application_status === 'PENDING').length;
      const approved = response.data.filter(app => app.application_status === 'APPROVED').length;
      const rejected = response.data.filter(app => app.application_status === 'REJECTED').length;
      
      setStats({
        pending,
        approved,
        rejected
      });
      
    } catch (err) {
      console.error('Error fetching applications:', err);
      
      // More detailed error handling
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Response error data:', err.response.data);
          console.error('Response error status:', err.response.status);
          setError(`Server error (${err.response.status}). Please try again.`);
        } else if (err.request) {
          console.error('Request error:', err.request);
          setError(`Network error. Cannot connect to ${API_URL}. Please check your API configuration and network connection.`);
        } else {
          setError('Request configuration error. Please try again.');
        }
      } else {
        setError('Failed to load tour guide applications. Please try again.');
      }
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
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1
      }));
      
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
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1
      }));
      
      Alert.alert("Success", "Application rejected successfully");
    } catch (err) {
      console.error('Error rejecting application:', err);
      Alert.alert("Error", "Failed to reject application. Please try again.");
    }
  };

  const navigateToApplicationDetail = (application: TourGuideApplication) => {
    // Navigate to application detail screen using the new path
    router.push({
      pathname: '/operator/home/operator_home_view',
      params: { 
        id: application.id.toString(),
        firstName: application.first_name,
        lastName: application.last_name,
        email: application.email,
        mobileNumber: application.mobile_number,
        reason: application.reason_for_applying,
        status: application.application_status,
        createdAt: application.created_at
      }
    });
  };

  const renderStatCard = (title: string, count: number, icon: string, color: string) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <View style={styles.statIconContainer}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#ffffff" />
      </View>
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderApplicationItem = ({ item }: { item: TourGuideApplication }) => {
    const isPending = item.application_status === 'PENDING';
    const isApproved = item.application_status === 'APPROVED';
    const isRejected = item.application_status === 'REJECTED';
    
    return (
      <TouchableOpacity 
        style={styles.applicationCard}
        onPress={() => navigateToApplicationDetail(item)}
        activeOpacity={0.7}
      >
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
            <Ionicons name="mail" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.email}</Text>
          </View>
        </View>
        
        {isPending && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleApprove(item.id);
              }}
            >
              <Ionicons name="checkmark-outline" size={18} color="#ffffff" />
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleReject(item.id);
              }}
            >
              <Ionicons name="close-outline" size={18} color="#ffffff" />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.cardFooter}>
          <View style={styles.viewDetailsContainer}>
            <Text style={styles.viewDetailsText}>View complete details</Text>
            <Ionicons name="chevron-forward" size={16} color="#0ea5e9" />
          </View>
        </View>
      </TouchableOpacity>
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
        <LinearGradient
          colors={['#0ea5e9', '#24d5dc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerContainer}
        >
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.headerText}>Tour Guide Applications</Text>
            <Text style={styles.subHeaderText}>Manage applications from tour guides</Text>
          </View>
        </LinearGradient>
        
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {renderStatCard('Pending', stats.pending, 'clock-outline', '#f59e0b')}
          {renderStatCard('Approved', stats.approved, 'check-circle-outline', '#10b981')}
          {renderStatCard('Rejected', stats.rejected, 'close-circle-outline', '#ef4444')}
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Applications</Text>
        </View>
        
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
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6598/6598519.png' }} 
                style={styles.emptyImage} 
              />
              <Text style={styles.emptyTitle}>No Applications Yet</Text>
              <Text style={styles.emptyText}>Tour guide applications will appear here</Text>
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
    paddingBottom: 100,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 3,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  applicationsContainer: {
    marginHorizontal: 8,
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
    marginBottom: 16,
  },
  applicationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    marginHorizontal: 8,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  applicationHeader: {
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.9)',
  },
  approvedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
  },
  rejectedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  dateText: {
    fontSize: 12,
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
  cardFooter: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewDetailsText: {
    fontSize: 11,
    color: '#0ea5e9',
    fontWeight: '700',
    marginRight: 4,
  },
});
