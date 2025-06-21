import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, FlatList
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Document types using enum values
const DOCUMENT_TYPES = [
  { id: 1, value: 'LETTER_OF_INTENT', label: 'Letter of Intent', required: true },
  { id: 2, value: 'BUSINESS_PERMIT', label: 'Business Permit', required: true },
  { id: 3, value: 'DTI_OR_SEC', label: 'DTI or SEC Registration', required: true },
  { id: 4, value: 'BIR_CERTIFICATE', label: 'BIR Certificate', required: true },
  { id: 5, value: 'PROOF_OF_OFFICE', label: 'Proof of Office', required: true },
  { id: 6, value: 'OFFICE_PHOTOS', label: 'Office Photos', required: true },
  { id: 7, value: 'BRGY_CLEARANCE', label: 'Barangay Clearance', required: true },
  { id: 8, value: 'DOLE_REGISTRATION', label: 'DOLE Registration', required: true },
  { id: 9, value: 'EMPLOYEE_LIST', label: 'Employee List', required: true },
  { id: 10, value: 'MANAGER_RESUME_ID', label: 'Manager Resume & ID', required: true },
  { id: 11, value: 'MANAGER_PROOF_OF_EXPERIENCE', label: 'Manager Proof of Experience', required: true },
  { id: 12, value: 'TOUR_PACKAGES_LIST', label: 'Tour Packages List', required: true },
  { id: 13, value: 'PARTNER_ESTABLISHMENTS', label: 'Partner Establishments', required: true },
  { id: 14, value: 'VOUCHER_SAMPLE', label: 'Voucher Sample', required: true },
  { id: 15, value: 'CLIENT_FEEDBACK_FORM', label: 'Client Feedback Form', required: true },
  { id: 16, value: 'AFFIDAVIT_OF_UNDERTAKING', label: 'Affidavit of Undertaking', required: true },
  { id: 17, value: 'ECC_OR_CNC', label: 'ECC or CNC', required: true }
];

export default function DocumentSubmission() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [userData, setUserData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [operatorId, setOperatorId] = useState<string | null>(null);
  const [operatorName, setOperatorName] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('Document submission page loaded');
    console.log('Route params:', params);
    
    // Extract operatorId from params
    const paramOperatorId = params.operatorId as string;
    const paramOperatorName = params.operatorName as string;
    const isTemporary = params.isTemporary === 'true';
    
    console.log('Param operatorId:', paramOperatorId);
    console.log('Param operatorName:', paramOperatorName);
    console.log('Is temporary:', isTemporary);
    
    if (paramOperatorId) {
      setOperatorId(paramOperatorId);
    }
    
    if (paramOperatorName) {
      setOperatorName(paramOperatorName);
    }
    
    loadUserData();
  }, [params]);
  
  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        console.log('User data loaded:', parsedUserData.id);
        setUserData(parsedUserData);
        
        // Check if we have a cached operatorId if not in params
        if (!params.operatorId) {
          const cachedStatusString = await AsyncStorage.getItem('operatorApplicationStatus');
          if (cachedStatusString) {
            const cachedStatus = JSON.parse(cachedStatusString);
            if (cachedStatus.operatorId) {
              console.log('Using operatorId from cache:', cachedStatus.operatorId);
              setOperatorId(cachedStatus.operatorId);
              setOperatorName(cachedStatus.operatorName || 'Tour Operator');
            }
          }
        }
        
        // If we have both userData and operatorId, fetch documents
        if (parsedUserData && (params.operatorId || operatorId)) {
          fetchDocuments(parsedUserData.token);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
  
  const fetchDocuments = async (token) => {
    try {
      setLoading(true);
      
      const currentOperatorId = params.operatorId || operatorId;
      
      if (!currentOperatorId) {
        console.error('No operatorId available for fetching documents');
        Alert.alert('Error', 'Operator ID not found. Please go back and try again.');
        setLoading(false);
        return;
      }
      
      // If it's a temporary ID, we won't try to fetch documents
      if (currentOperatorId.startsWith('temp_')) {
        console.log('Using temporary ID, skipping document fetch');
        setDocuments([]);
        setLoading(false);
        return;
      }
      
      const url = `${API_URL}documents/${currentOperatorId}`;
      console.log('Fetching documents from:', url);
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500; // Only reject if server error
        }
      });
      
      if (response.status === 200 && response.data) {
        console.log('Documents fetched successfully:', response.data);
        setDocuments(response.data);
      } else {
        console.log('No documents found or error status:', response.status);
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Don't show alert, just set empty documents
      setDocuments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const uploadDocument = async (documentType) => {
    if (!userData) {
      Alert.alert('Error', 'User data not found. Please log in again.');
      return;
    }
    
    if (!documentType) {
      Alert.alert('Error', 'Please select a document type.');
      return;
    }
    
    const currentOperatorId = params.operatorId || operatorId;
    
    if (!currentOperatorId) {
      Alert.alert('Error', 'Operator ID not found. Please go back and try again.');
      return;
    }
    
    // Check if we're using a temporary ID
    if (currentOperatorId.startsWith('temp_')) {
      Alert.alert(
        'Application Pending',
        'Your application is still pending approval. You can upload documents once your application is approved.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled) {
        return;
      }
      
      const selectedFile = result.assets[0];
      
      // Show loading indicator
      Alert.alert(
        'Uploading',
        'Uploading document, please wait...',
        [],
        { cancelable: false }
      );
      
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.mimeType,
        name: selectedFile.name
      });
      
      // Append document type using the enum value
      formData.append('document_type', documentType.value);
      
      // Add additional metadata if needed
      formData.append('file_name', selectedFile.name);
      formData.append('file_size', selectedFile.size.toString());
      formData.append('file_type', selectedFile.mimeType);
      formData.append('operator_id', currentOperatorId);
      
      const url = `${API_URL}documents/upload`;
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Dismiss loading indicator
      Alert.dismiss();
      
      if (response.data) {
        Alert.alert('Success', 'Document uploaded successfully.');
        fetchDocuments(userData.token);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };
  
  const deleteDocument = async (documentId) => {
    if (!userData) {
      Alert.alert('Error', 'User data not found. Please log in again.');
      return;
    }
    
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const url = `${API_URL}documents/${documentId}`;
              await axios.delete(url, {
                headers: { 'Authorization': `Bearer ${userData.token}` }
              });
              
              Alert.alert('Success', 'Document deleted successfully.');
              fetchDocuments(userData.token);
            } catch (error) {
              console.error('Error deleting document:', error);
              Alert.alert('Error', 'Failed to delete document. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  const getDocumentStatus = (docType) => {
    const uploaded = documents.find(doc => doc.document_type === docType.value);
    return uploaded ? 'uploaded' : 'missing';
  };
  
  const renderDocumentItem = ({ item }) => {
    const status = getDocumentStatus(item);
    const isUploaded = status === 'uploaded';
    const uploadedDoc = documents.find(doc => doc.document_type === item.value);
    
    return (
      <View style={styles.documentCard}>
        <View style={styles.documentHeader}>
          <Text style={styles.documentTitle}>{item.label}</Text>
          {item.required && (
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>Required</Text>
            </View>
          )}
        </View>
        
        <View style={styles.documentStatus}>
          {isUploaded ? (
            <>
              <View style={styles.uploadedStatus}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.uploadedText}>Uploaded</Text>
              </View>
              <Text style={styles.uploadDateText}>
                {uploadedDoc && new Date(uploadedDoc.uploaded_at).toLocaleDateString()}
              </Text>
            </>
          ) : (
            <View style={styles.missingStatus}>
              <Ionicons name="alert-circle" size={20} color="#f59e0b" />
              <Text style={styles.missingText}>
                {item.required ? 'Required - Not Uploaded' : 'Optional - Not Uploaded'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.documentActions}>
          {isUploaded ? (
            <>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  if (uploadedDoc && uploadedDoc.file_path) {
                    router.push({
                      pathname: 'web',
                      params: { url: uploadedDoc.file_path }
                    });
                  }
                }}
              >
                <Ionicons name="eye" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.replaceButton}
                onPress={() => uploadDocument(item)}
              >
                <Ionicons name="refresh" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Replace</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteDocument(uploadedDoc.id)}
              >
                <Ionicons name="trash" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => uploadDocument(item)}
            >
              <Ionicons name="cloud-upload" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Upload</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  
  return (
    <>
      <Stack.Screen
        options={{
          title: "Document Submission",
          headerShown: true,
        }}
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              if (userData) {
                fetchDocuments(userData.token);
              } else {
                setRefreshing(false);
              }
            }}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Document Submission</Text>
          <Text style={styles.headerSubtitle}>{operatorName}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#0066cc" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Please upload all required documents to complete your registration as a tour operator.
            All documents must be in PDF or image format and less than 5MB in size.
          </Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Loading documents...</Text>
          </View>
        ) : (
          <>
            {/* Document Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Document Type</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Actions</Text>
            </View>
            
            {/* Document Table Rows */}
            {DOCUMENT_TYPES.map((docType) => {
              const uploadedDoc = documents.find(doc => doc.document_type === docType.value);
              const isUploaded = !!uploadedDoc;
              
              return (
                <View key={docType.id} style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 3 }]}>
                    <Text style={styles.documentTypeText}>{docType.label}</Text>
                    {docType.required && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredText}>Required</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    {isUploaded ? (
                      <View style={styles.statusBadgeUploaded}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <Text style={styles.statusTextUploaded}>Uploaded</Text>
                      </View>
                    ) : (
                      <View style={styles.statusBadgeMissing}>
                        <Ionicons name="alert-circle" size={16} color="#f59e0b" />
                        <Text style={styles.statusTextMissing}>
                          {docType.required ? 'Required' : 'Optional'}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <View style={styles.actionButtons}>
                      {isUploaded ? (
                        <>
                          <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() => {
                              if (uploadedDoc && uploadedDoc.file_path) {
                                router.push({
                                  pathname: 'web',
                                  params: { url: uploadedDoc.file_path }
                                });
                              }
                            }}
                          >
                            <Ionicons name="eye" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>View</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={styles.replaceButton}
                            onPress={() => uploadDocument(docType)}
                          >
                            <Ionicons name="refresh" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>Replace</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={styles.uploadButton}
                          onPress={() => uploadDocument(docType)}
                        >
                          <Ionicons name="cloud-upload" size={16} color="#fff" />
                          <Text style={styles.actionButtonText}>Upload</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
            
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitAllButton}
              onPress={() => {
                // Check if all required documents are uploaded
                const missingRequired = DOCUMENT_TYPES.filter(
                  doc => doc.required && !documents.find(d => d.document_type === doc.value)
                );
                
                if (missingRequired.length > 0) {
                  Alert.alert(
                    'Missing Documents',
                    'Please upload all required documents before submitting.',
                    [{ text: 'OK' }]
                  );
                  return;
                }
                
                Alert.alert(
                  'Submit Documents',
                  'Are you sure you want to submit all documents? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Submit', 
                      style: 'default',
                      onPress: async () => {
                        try {
                          const url = `${API_URL}documents/submit/${operatorId}`;
                          await axios.post(url, {}, {
                            headers: { 'Authorization': `Bearer ${userData.token}` }
                          });
                          
                          Alert.alert(
                            'Success', 
                            'Documents submitted successfully!',
                            [
                              { 
                                text: 'OK',
                                onPress: () => router.back()
                              }
                            ]
                          );
                        } catch (error) {
                          console.error('Error submitting documents:', error);
                          Alert.alert('Error', 'Failed to submit documents. Please try again.');
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.submitAllButtonText}>Submit All Documents</Text>
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" style={{marginRight: 8}} />
          <Text style={styles.backButtonText}>Back to Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    color: '#0369a1',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  
  // Table styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  tableHeaderCell: {
    padding: 12,
    fontWeight: 'bold',
    color: '#334155',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  tableCell: {
    padding: 12,
    justifyContent: 'center',
  },
  documentTypeText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  requiredBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  requiredText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  statusBadgeUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusTextUploaded: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
    marginLeft: 4,
  },
  statusBadgeMissing: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusTextMissing: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  replaceButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  uploadButton: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  submitAllButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});









