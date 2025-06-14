import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Fix the API URL for mobile devices
const API_URL = Platform.OS === 'web' 
  ? process.env.NEXT_PUBLIC_API_URL 
  : process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3000/api/v1/';

// Helper function to shade colors
const shadeColor = (color: string, percent: number) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor(R * (100 + percent) / 100);
  G = Math.floor(G * (100 + percent) / 100);
  B = Math.floor(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
};

const toSentenceCase = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export default function ApplicationDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get application data from params
  const applicationId = params.id as string;
  const firstName = params.firstName as string;
  const lastName = params.lastName as string;
  const email = params.email as string;
  const mobileNumber = params.mobileNumber as string;
  const reason = params.reason as string;
  const status = params.status as string;
  const createdAt = params.createdAt as string;

  const isPending = status === 'PENDING';
  const isApproved = status === 'APPROVED';
  const isRejected = status === 'REJECTED';

  const getStatusColor = () => {
    if (isPending) return '#f59e0b';
    if (isApproved) return '#10b981';
    return '#ef4444';
  };

  const handleApprove = async () => {
    setLoading(true);
    
    try {
      await axios.put(`${API_URL}applications/${applicationId}/approve`, {}, {
        withCredentials: true,
        timeout: 10000
      });
      
      Alert.alert(
        "Success", 
        "Application approved successfully",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err) {
      console.error('Error approving application:', err);
      Alert.alert("Error", "Failed to approve application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    
    try {
      await axios.put(`${API_URL}applications/${applicationId}/reject`, {}, {
        withCredentials: true,
        timeout: 10000
      });
      
      Alert.alert(
        "Success", 
        "Application rejected successfully",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err) {
      console.error('Error rejecting application:', err);
      Alert.alert("Error", "Failed to reject application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Application Details",
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
        }} 
      />
      
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with status */}
          <View style={styles.header}>
            <LinearGradient
              colors={[getStatusColor(), shadeColor(getStatusColor(), -20)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.statusContainer}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {firstName?.charAt(0)}{lastName?.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.nameText}>{firstName} {lastName}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {isPending ? 'Pending Review' : isApproved ? 'Approved' : 'Rejected'}
                  </Text>
                </View>
                <Text style={styles.dateText}>
                  Applied on {new Date(createdAt).toLocaleDateString()}
                </Text>
              </View>
            </LinearGradient>
          </View>
          
          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#3b82f6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{email}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="call-outline" size={20} color="#10b981" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mobile Number</Text>
                  <Text style={styles.infoValue}>{mobileNumber}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Application Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Application Details</Text>
            <View style={styles.card}>
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Reason for Applying</Text>
                <Text style={styles.reasonText}>{toSentenceCase(reason)}</Text>
              </View>
              
              {/* Additional details would go here */}
              <View style={styles.divider} />
              
              <View style={styles.applicationMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Application ID</Text>
                  <Text style={styles.metaValue}>{applicationId}</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Status</Text>
                  <View style={[
                    styles.metaStatusBadge,
                    { backgroundColor: `${getStatusColor()}20`, borderColor: getStatusColor() }
                  ]}>
                    <Text style={[styles.metaStatusText, { color: getStatusColor() }]}>
                      {isPending ? 'PENDING' : isApproved ? 'APPROVED' : 'REJECTED'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Submission Date</Text>
                  <Text style={styles.metaValue}>
                    {new Date(createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          {isPending && (
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-outline" size={20} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Approve Application</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleReject}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="close-outline" size={20} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Reject Application</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusContainer: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  reasonContainer: {
    paddingVertical: 12,
  },
  reasonLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 17,
    fontWeight: '700',
  },
  applicationMeta: {
    paddingVertical: 12,
  },
  metaItem: {
    marginBottom: 12,
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  metaStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  metaStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  }
});
