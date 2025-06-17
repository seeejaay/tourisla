import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { API_URL } from '@/lib/config';

export default function OperatorApplicationScreen({ headerHeight }: { headerHeight: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('NOT_APPLIED');
  const [operatorId, setOperatorId] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [userData, setUserData] = useState(null);
  
  // Form fields matching the database columns
  const [operatorName, setOperatorName] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  useEffect(() => {
    const init = async () => {
      // Check API connectivity first
      await checkApiConnectivity();
      checkApplicationStatus();
    };
    
    init();
  }, []);

  const checkApplicationStatus = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        setLoading(false);
        return;
      }
      
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
      
      // Fix the URL - remove the duplicate api/v1/
      const url = `${API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL}/operatorRegis/status/${parsedUserData.id}`;
      console.log('Corrected API URL:', url);
      
      const response = await axios.get(
        url,
        {
          headers: {
            'Authorization': `Bearer ${parsedUserData.token}`
          }
        }
      );
      
      if (response.data) {
        setApplicationStatus(response.data.application_status || 'NOT_APPLIED');
        
        if (response.data.id) {
          setOperatorId(response.data.id);
          setOperatorName(response.data.operator_name || '');
          setRepresentativeName(response.data.representative_name || '');
          setEmail(response.data.email || '');
          setMobileNumber(response.data.mobile_number || '');
          setOfficeAddress(response.data.office_address || '');
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
      // If 404, assume the user hasn't applied yet
      if (error.response && error.response.status === 404) {
        setApplicationStatus('NOT_APPLIED');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (id, token) => {
    try {
      // Fix the URL - remove the duplicate api/v1/
      const url = `${API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL}/operatorDocuments/${id}`;
      
      const response = await axios.get(
        url,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.documents) {
        setUploadedDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const submitApplication = async () => {
    if (!operatorName || !representativeName || !email || !mobileNumber || !officeAddress) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const requestData = {
        operator_name: operatorName.toUpperCase(),
        representative_name: representativeName.toUpperCase(),
        email: email.toLowerCase(),
        mobile_number: mobileNumber,
        office_address: officeAddress.toUpperCase(),
        application_status: 'PENDING',
        user_id: userData.id
      };
      
      // Fix the URL - remove the duplicate api/v1/
      const url = `${API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL}/operatorRegis`;
      console.log('Corrected submission URL:', url);
      console.log('Submitting application with data:', requestData);
      
      const response = await axios.post(
        url,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response:', response.data);
      
      if (response.data && response.data.id) {
        setOperatorId(response.data.id);
        setApplicationStatus('PENDING');
        Alert.alert(
          'Application Submitted', 
          'Your application has been submitted. Please wait for approval from the admin.'
        );
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      
      // More detailed error logging
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        
        if (error.response.data && error.response.data.message) {
          Alert.alert('Error', error.response.data.message);
        } else {
          Alert.alert('Error', `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        console.log('Error request:', error.request);
        Alert.alert('Error', 'No response received from server. Please check your connection.');
      } else {
        Alert.alert('Error', 'There was a problem submitting your application. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Add a function to check API connectivity
  const checkApiConnectivity = async () => {
    try {
      // Remove any potential duplicate api/v1/
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      console.log('Checking API connectivity to:', baseUrl);
      
      const response = await axios.get(baseUrl);
      console.log('API connectivity check response:', response.status);
      return true;
    } catch (error) {
      console.error('API connectivity check failed:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Tour Operator Application</Text>
          
          {applicationStatus === 'APPROVED' ? (
            <View style={styles.statusCard}>
              <View style={[styles.statusIndicator, styles.statusApproved]}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <Text style={styles.statusTitle}>Application Approved</Text>
              <Text style={styles.statusDescription}>
                Your application has been approved. You can now create and manage tour packages.
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/operator/tours/create')}
              >
                <Text style={styles.actionButtonText}>Create Tour Package</Text>
              </TouchableOpacity>
            </View>
          ) : applicationStatus === 'REJECTED' ? (
            <View style={styles.statusCard}>
              <View style={[styles.statusIndicator, styles.statusRejected]}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </View>
              <Text style={styles.statusTitle}>Application Rejected</Text>
              <Text style={styles.statusDescription}>
                Unfortunately, your application has been rejected. Please contact our support team for more information.
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/support')}
              >
                <Text style={styles.actionButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          ) : applicationStatus === 'PENDING' ? (
            <View style={styles.statusCard}>
              <View style={[styles.statusIndicator, styles.statusPending]}>
                <Ionicons name="time" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statusTitle}>Application Pending</Text>
              <Text style={styles.statusDescription}>
                Your application is currently under review. We'll notify you once it's approved.
              </Text>
            </View>
          ) : (
            <View style={styles.applicationForm}>
              <Text style={styles.formTitle}>Business Information</Text>
              <Text style={styles.formDescription}>
                Please provide your business details to apply as a tour operator.
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Operator Name *</Text>
                <TextInput
                  style={styles.input}
                  value={operatorName}
                  onChangeText={setOperatorName}
                  placeholder="Enter your business/operator name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Representative Name *</Text>
                <TextInput
                  style={styles.input}
                  value={representativeName}
                  onChangeText={setRepresentativeName}
                  placeholder="Enter representative's full name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number *</Text>
                <TextInput
                  style={styles.input}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="+639XXXXXXXXX"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Office Address *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={officeAddress}
                  onChangeText={setOfficeAddress}
                  placeholder="Enter your office address"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitApplication}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
              </TouchableOpacity>
            </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusApproved: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusRejected: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  applicationForm: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  }
});

