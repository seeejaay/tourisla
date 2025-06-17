import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Modal, FlatList,
  RefreshControl
} from 'react-native';
import { router, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../../lib/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Document types for upload
const DOCUMENT_TYPES = [
  { id: 1, value: 'BUSINESS_PERMIT', label: 'Business Permit' },
  { id: 2, value: 'DOT_ACCREDITATION', label: 'DOT Accreditation' },
  { id: 3, value: 'MAYORS_PERMIT', label: 'Mayor\'s Permit' },
  { id: 4, value: 'DTI_REGISTRATION', label: 'DTI Registration' },
  { id: 5, value: 'INSURANCE_CERTIFICATE', label: 'Insurance Certificate' },
  { id: 6, value: 'OTHER', label: 'Other Document' }
];

export default function OperatorApplication() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = 60 + insets.top;
  const navigation = useNavigation();
  
  // User data state
  const [userData, setUserData] = useState(null);
  
  // Application form state
  const [operatorName, setOperatorName] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  
  // Application status state
  const [operatorId, setOperatorId] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('NOT_APPLIED');
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Document upload state
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  
  // Initialize component
  useEffect(() => {
    checkApplicationStatus();
  }, []);
  
  // Check application status
  const checkApplicationStatus = useCallback(async () => {
    try {
      setLoading(true);
      const userDataString = await AsyncStorage.getItem('userData');
      
      if (!userDataString) {
        setLoading(false);
        return;
      }
      
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
      
      // First check if we have cached status
      let cachedStatus = null;
      const cachedStatusString = await AsyncStorage.getItem('operatorApplicationStatus');
      
      if (cachedStatusString) {
        cachedStatus = JSON.parse(cachedStatusString);
        if (cachedStatus.userId === parsedUserData.id) {
          console.log('Using cached application status:', cachedStatus.status);
          // Set all the state values from cache
          setApplicationStatus(cachedStatus.status);
          setOperatorId(cachedStatus.operatorId);
          setOperatorName(cachedStatus.operatorName || '');
          setRepresentativeName(cachedStatus.representativeName || '');
          setEmail(cachedStatus.email || '');
          setMobileNumber(cachedStatus.mobileNumber || '');
          setOfficeAddress(cachedStatus.officeAddress || '');
        }
      }
      
      // Then try to get from API
      let apiSuccess = false;
      
      try {
        const url = `${API_URL}operatorRegis/status/${parsedUserData.id}`;
        console.log('Fetching application status from:', url);
        
        const response = await axios.get(url, {
          headers: { 'Authorization': `Bearer ${parsedUserData.token}` },
          timeout: 10000,
          validateStatus: function (status) {
            return status < 500; // Only reject if server error
          }
        });
        
        if (response.status === 200 && response.data) {
          apiSuccess = true;
          const status = response.data.application_status || 'NOT_APPLIED';
          
          // Only update if we got a valid status that's not NOT_APPLIED
          if (status !== 'NOT_APPLIED') {
            setApplicationStatus(status);
            
            if (response.data.id) {
              setOperatorId(response.data.id);
              setOperatorName(response.data.operator_name || '');
              setRepresentativeName(response.data.representative_name || '');
              setEmail(response.data.email || '');
              setMobileNumber(response.data.mobile_number || '');
              setOfficeAddress(response.data.office_address || '');
              
              // Cache the application status
              const statusToCache = {
                userId: parsedUserData.id,
                status: status,
                operatorId: response.data.id,
                operatorName: response.data.operator_name || '',
                representativeName: response.data.representative_name || '',
                email: response.data.email || '',
                mobileNumber: response.data.mobile_number || '',
                officeAddress: response.data.office_address || '',
                timestamp: new Date().toISOString()
              };
              
              await AsyncStorage.setItem('operatorApplicationStatus', JSON.stringify(statusToCache));
              console.log('Updated cached application status:', statusToCache);
              
              // If approved, load documents
              if (status === 'APPROVED') {
                fetchDocuments(response.data.id, parsedUserData.token);
              }
            }
          }
        } else if (response.status === 404) {
          console.log('No application found at primary endpoint, trying alternative');
        }
      } catch (error) {
        console.error('Error fetching from primary endpoint:', error);
      }
      
      // If primary endpoint fails or returns 404, try alternative endpoint
      if (!apiSuccess) {
        try {
          const altSuccess = await checkApplicationExists(parsedUserData.id, parsedUserData.token);
          apiSuccess = altSuccess;
        } catch (error) {
          console.error('Error checking alternative endpoint:', error);
        }
      }
      
      // If both API calls fail but we have cached data, keep using it
      if (!apiSuccess && cachedStatus && cachedStatus.status !== 'NOT_APPLIED') {
        console.log('API calls failed, relying on cached status:', cachedStatus.status);
        // We already set the state from cache above, so no need to do it again
      } else if (!apiSuccess && (!cachedStatus || cachedStatus.status === 'NOT_APPLIED')) {
        // Only set to NOT_APPLIED if we have no cached data or cached status was NOT_APPLIED
        console.log('No application found and no valid cached data, setting to NOT_APPLIED');
        setApplicationStatus('NOT_APPLIED');
      }
      
    } catch (error) {
      console.error('Error checking application status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to check if application exists using alternative endpoint
  const checkApplicationExists = async (userId, token) => {
    try {
      console.log('Trying alternative endpoint to find application');
      // Try to find the application using an alternative endpoint
      const url = `${API_URL}applications/user/${userId}`;
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Alternative endpoint response:', response.data);
      
      if (response.data && response.data.length > 0) {
        const application = response.data[0]; // Get the first application
        
        // Update state with application data
        setApplicationStatus(application.application_status || 'PENDING');
        
        if (application.id) {
          setOperatorId(application.id);
          setOperatorName(application.operator_name || '');
          setRepresentativeName(application.representative_name || '');
          setEmail(application.email || '');
          setMobileNumber(application.mobile_number || '');
          setOfficeAddress(application.office_address || '');
          
          // Cache this data
          const statusToCache = {
            userId: userId,
            status: application.application_status || 'PENDING',
            operatorId: application.id, // Make sure operatorId is included
            operatorName: application.operator_name || '',
            representativeName: application.representative_name || '',
            email: application.email || '',
            mobileNumber: application.mobile_number || '',
            officeAddress: application.office_address || '',
            timestamp: new Date().toISOString()
          };
          
          await AsyncStorage.setItem('operatorApplicationStatus', JSON.stringify(statusToCache));
          console.log('Cached application status from alternative endpoint:', statusToCache);
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking alternative endpoint:', error);
      return false;
    }
  };

  // Submit application
  const submitApplication = useCallback(async () => {
    if (!userData) {
      Alert.alert('Error', 'User data not found. Please log in again.');
      return;
    }
    
    // Validate inputs
    if (!operatorName.trim()) {
      Alert.alert('Error', 'Operator name is required.');
      return;
    }
    
    if (!representativeName.trim()) {
      Alert.alert('Error', 'Representative name is required.');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Email address is required.');
      return;
    }
    
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Mobile number is required.');
      return;
    }
    
    if (!officeAddress.trim()) {
      Alert.alert('Error', 'Office address is required.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const applicationData = {
        operator_name: operatorName,
        representative_name: representativeName,
        email: email,
        mobile_number: mobileNumber,
        office_address: officeAddress,
        user_id: userData.id,
        application_status: 'PENDING'
      };
      
      console.log('Submitting application:', applicationData);
      
      const url = `${API_URL}operatorRegis`;
      const response = await axios.post(
        url,
        applicationData,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Application submission response:', response.data);
      
      if (response.data && response.data.id) {
        // Update state with submitted data
        setOperatorId(response.data.id);
        setApplicationStatus('PENDING');
        
        // Cache the application status
        const statusToCache = {
          userId: userData.id,
          status: 'PENDING',
          operatorId: response.data.id, // Make sure operatorId is included
          operatorName: operatorName,
          representativeName: representativeName,
          email: email,
          mobileNumber: mobileNumber,
          officeAddress: officeAddress,
          timestamp: new Date().toISOString()
        };
        
        await AsyncStorage.setItem('operatorApplicationStatus', JSON.stringify(statusToCache));
        console.log('Cached application status after submission:', statusToCache);
        
        Alert.alert(
          'Success',
          'Your application has been submitted successfully.',
          [{ 
            text: 'OK',
            onPress: () => {
              // Force a refresh of the application status
              checkApplicationStatus();
            }
          }]
        );
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || `Server error (${error.response.status})`;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [userData, operatorName, representativeName, email, mobileNumber, officeAddress, checkApplicationStatus]);
  
  // Fetch documents
  const fetchDocuments = async (opId, token) => {
    try {
      setLoadingDocuments(true);
      const url = `${API_URL}documents/${opId}`;
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };
  
  // Pick document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled === false) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };
  
  // Upload document
  const uploadDocument = async () => {
    if (!selectedDocumentType || !selectedFile || !operatorId || !userData) {
      Alert.alert('Error', 'Please select a document type and file.');
      return;
    }
    
    setUploadingDocument(true);
    
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.mimeType,
        name: selectedFile.name
      });
      // Use the enum value instead of the label
      formData.append('document_type', selectedDocumentType.value);
      formData.append('operator_id', operatorId);
      
      const url = `${API_URL}documents/upload`;
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data) {
        Alert.alert('Success', 'Document uploaded successfully.');
        setSelectedDocumentType(null);
        setSelectedFile(null);
        fetchDocuments(operatorId, userData.token);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setUploadingDocument(false);
    }
  };

  // Add this function to navigate to document submission page
  const navigateToDocumentSubmission = async () => {
    console.log('Navigate to document submission called');
    console.log('Current operatorId:', operatorId);
    
    try {
      // First check if we have operatorId in state
      if (operatorId) {
        console.log('Using operatorId from state:', operatorId);
        router.push({
          pathname: '/operator/documents/document_submission',
          params: { 
            operatorId: operatorId,
            operatorName: operatorName || 'Tour Operator'
          }
        });
        return;
      }
      
      // If not in state, try to get from cache
      const cachedStatusString = await AsyncStorage.getItem('operatorApplicationStatus');
      console.log('Cached status string:', cachedStatusString);
      
      if (cachedStatusString) {
        const cachedStatus = JSON.parse(cachedStatusString);
        console.log('Parsed cached status:', cachedStatus);
        
        if (cachedStatus.operatorId) {
          console.log('Using operatorId from cache:', cachedStatus.operatorId);
          
          // Update state with cached values
          setOperatorId(cachedStatus.operatorId);
          
          // Navigate with cached values
          router.push({
            pathname: '/operator/documents/document_submission',
            params: { 
              operatorId: cachedStatus.operatorId,
              operatorName: cachedStatus.operatorName || 'Tour Operator'
            }
          });
          return;
        }
      }
      
      // If we still don't have an operatorId, try to get it from the API
      if (userData) {
        try {
          console.log('Trying to get operatorId from API');
          const url = `${API_URL}operatorRegis/user/${userData.id}`;
          
          const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${userData.token}` },
            timeout: 10000,
            validateStatus: function (status) {
              return status < 500; // Only reject if server error
            }
          });
          
          if (response.status === 200 && response.data && response.data.id) {
            console.log('Got operatorId from API:', response.data.id);
            setOperatorId(response.data.id);
            
            // Navigate with API values
            router.push({
              pathname: '/operator/documents/document_submission',
              params: { 
                operatorId: response.data.id,
                operatorName: response.data.operator_name || 'Tour Operator'
              }
            });
            return;
          }
        } catch (error) {
          console.error('Error getting operatorId from API:', error);
        }
      }
      
      // If all else fails, create a temporary ID based on the user ID
      if (userData && userData.id) {
        const tempOperatorId = `temp_${userData.id}`;
        console.log('Using temporary operatorId:', tempOperatorId);
        
        router.push({
          pathname: '/operator/documents/document_submission',
          params: { 
            operatorId: tempOperatorId,
            operatorName: operatorName || 'Tour Operator',
            isTemporary: 'true'
          }
        });
        return;
      }
      
      // If we still don't have an operatorId, show error
      Alert.alert('Error', 'Operator ID not found. Please try again later or contact support.');
    } catch (error) {
      console.error('Error navigating to document submission:', error);
      Alert.alert('Error', 'Failed to navigate to document submission page. Please try again.');
    }
  };

  // Render document upload section
  const renderDocumentUploadSection = () => {
    if (applicationStatus !== 'APPROVED') return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Document Upload</Text>
        <Text style={styles.sectionDescription}>
          Please upload the required documents to complete your registration.
        </Text>
        
        {/* Add this new button for document submission page */}
        <TouchableOpacity
          style={styles.documentPageButton}
          onPress={navigateToDocumentSubmission}
        >
          <Ionicons name="document-text" size={20} color="#fff" style={{marginRight: 8}} />
          <Text style={styles.documentPageButtonText}>Go to Document Submission Page</Text>
        </TouchableOpacity>
        
        <View style={styles.orDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Document Type</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDocumentTypeModal(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedDocumentType ? selectedDocumentType.label : 'Select document type'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Document File</Text>
          <TouchableOpacity
            style={styles.fileButton}
            onPress={pickDocument}
          >
            <Ionicons name="document-outline" size={20} color="#64748b" style={styles.fileIcon} />
            <Text style={styles.fileButtonText} numberOfLines={1}>
              {selectedFile ? selectedFile.name : 'Select a file'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedDocumentType || !selectedFile || uploadingDocument) && styles.uploadButtonDisabled
          ]}
          onPress={uploadDocument}
          disabled={!selectedDocumentType || !selectedFile || uploadingDocument}
        >
          {uploadingDocument ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.documentsListContainer}>
          <Text style={styles.documentsListTitle}>Uploaded Documents</Text>
          
          {loadingDocuments ? (
            <ActivityIndicator size="small" color="#0066cc" style={styles.documentsLoader} />
          ) : documents.length > 0 ? (
            <FlatList
              data={documents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const docType = DOCUMENT_TYPES.find(dt => dt.label === item.document_type);
                
                return (
                  <View style={styles.documentItem}>
                    <Ionicons name="document-text" size={24} color="#0066cc" style={styles.documentIcon} />
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentTitle}>{docType ? docType.label : item.document_type}</Text>
                      <Text style={styles.documentDate}>
                        Uploaded: {new Date(item.uploaded_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.documentViewButton}
                      onPress={() => {
                        if (item.file_path) {
                          router.push({
                            pathname: 'web',
                            params: { url: item.file_path }
                          });
                        }
                      }}
                    >
                      <Ionicons name="eye" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                );
              }}
              style={styles.documentsList}
            />
          ) : (
            <Text style={styles.noDocumentsText}>No documents uploaded yet.</Text>
          )}
        </View>
      </View>
    );
  };

  // Render document type modal
  const renderDocumentTypeModal = () => (
    <Modal
      visible={showDocumentTypeModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDocumentTypeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Select Document Type</Text>
          
          <FlatList
            data={DOCUMENT_TYPES}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedDocumentType(item);
                  setShowDocumentTypeModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            style={styles.modalList}
          />
          
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowDocumentTypeModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <ScrollView 
      style={[styles.container, { marginTop: headerHeight }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            checkApplicationStatus().finally(() => setRefreshing(false));
          }}
        />
      }
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading application status...</Text>
        </View>
      ) : applicationStatus === 'NOT_APPLIED' ? (
        <View style={styles.section}>
          <Text style={styles.title}>Tour Operator Application</Text>
          
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
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter business email address"
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
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Office Address *</Text>
              <TextInput
                style={styles.input}
                value={officeAddress}
                onChangeText={setOfficeAddress}
                placeholder="Enter office address"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={submitApplication}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Application Status</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, styles[`status${applicationStatus}`] || styles.statusPENDING]}>
                <Text style={styles.statusText}>{applicationStatus}</Text>
              </View>
              <Text style={styles.statusDescription}>
                {applicationStatus === 'PENDING' && 'Your application is being reviewed by our team.'}
                {applicationStatus === 'APPROVED' && 'Your application has been approved!'}
                {applicationStatus === 'REJECTED' && 'Your application has been rejected. Please contact support for more information.'}
              </Text>
            </View>
          </View>
          
          {renderDocumentUploadSection()}
        </View>
      )}
      
      {renderDocumentTypeModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0f172a',
    textAlign: 'center',
  },
  applicationForm: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0f172a',
  },
  formDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
    color: '#334155',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  submitButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0f172a',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
    color: '#334155',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#f8fafc',
  },
  selectButtonText: {
    color: '#334155',
    fontSize: 15,
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#f8fafc',
  },
  fileIcon: {
    marginRight: 10,
  },
  fileButtonText: {
    color: '#334155',
    fontSize: 15,
    flex: 1,
  },
  uploadButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  uploadButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  documentsListContainer: {
    marginTop: 24,
  },
  documentsListTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0f172a',
  },
  documentsLoader: {
    marginVertical: 20,
  },
  documentsList: {
    marginTop: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  documentIcon: {
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#334155',
  },
  documentDate: {
    fontSize: 14,
    color: '#64748b',
  },
  documentViewButton: {
    backgroundColor: '#0066cc',
    borderRadius: 6,
    padding: 8,
  },
  noDocumentsText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '85%',
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#0f172a',
  },
  modalScroll: {
    maxHeight: 350,
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalItemText: {
    fontSize: 16,
    color: '#334155',
  },
  modalCloseButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  statusPENDING: {
    backgroundColor: '#fef9c3',
  },
  statusAPPROVED: {
    backgroundColor: '#dcfce7',
  },
  statusREJECTED: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  applicationDetails: {
    marginTop: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
  },
  detailsTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0f172a',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: '40%',
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  documentPageButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  documentPageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#cbd5e1',
  },
  orText: {
    marginHorizontal: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  documentPageButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  documentPageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Add a function to clear application cache on logout
export const clearApplicationCache = async () => {
  try {
    await AsyncStorage.removeItem('operatorApplicationStatus');
    console.log('Operator application status cache cleared');
  } catch (error) {
    console.error('Error clearing application cache:', error);
  }
};


