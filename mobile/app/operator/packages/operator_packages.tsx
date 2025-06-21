import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTourPackages } from '@/hooks/useTourPackagesManager';
import { router } from 'expo-router';

export default function OperatorPackagesScreen({ headerHeight }) {
  const {
    packages,
    loading,
    refreshing,
    userData,
    handleRefresh,
    handleCreatePackage,
    handleDeletePackage
  } = useTourPackages();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    packageName: '',
    location: '',
    description: '',
    price: '',
    durationDays: '',
    inclusions: '',
    exclusions: '',
    availableSlots: '',
    dateStart: '',
    dateEnd: '',
    startTime: '',
    endTime: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const requiredFields = [
      'packageName', 'location', 'description', 'price', 
      'durationDays', 'availableSlots', 'dateStart', 'startTime'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
        return false;
      }
    }

    if (isNaN(parseFloat(formData.price))) {
      Alert.alert('Error', 'Valid price is required');
      return false;
    }

    if (isNaN(parseInt(formData.durationDays))) {
      Alert.alert('Error', 'Valid duration in days is required');
      return false;
    }

    if (isNaN(parseInt(formData.availableSlots))) {
      Alert.alert('Error', 'Valid number of available slots is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const packageData = {
        package_name: formData.packageName.trim().toUpperCase(),
        location: formData.location.trim().toUpperCase(),
        description: formData.description.trim().toUpperCase(),
        price: parseFloat(formData.price),
        duration_days: parseInt(formData.durationDays),
        inclusions: formData.inclusions.trim().toUpperCase(),
        exclusions: formData.exclusions.trim().toUpperCase(),
        available_slots: parseInt(formData.availableSlots),
        date_start: formData.dateStart,
        date_end: formData.dateEnd || null,
        start_time: formData.startTime,
        end_time: formData.endTime,
        operator_id: userData.id 
      };

      const result = await handleCreatePackage(packageData);
      
      if (result?.success) {
        Alert.alert('Success', 'Tour package created successfully');
        setShowCreateModal(false);
        setFormData({
          packageName: '',
          location: '',
          description: '',
          price: '',
          durationDays: '',
          inclusions: '',
          exclusions: '',
          availableSlots: '',
          dateStart: '',
          dateEnd: '',
          startTime: '',
          endTime: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Failed to create package');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPackage = (packageId) => {
    router.push({
      pathname: '/operator/packages/edit_package',
      params: { packageId }
    });
  };

  const confirmDeletePackage = (packageId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this package?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await handleDeletePackage(packageId);
              Alert.alert('Success', 'Package deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete package');
            }
          }
        }
      ]
    );
  };

  const renderCreatePackageModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Tour Package</Text>
            <TouchableOpacity 
              onPress={() => setShowCreateModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <Text style={styles.inputLabel}>Package Name</Text>
            <TextInput
              style={styles.input}
              value={formData.packageName}
              onChangeText={(text) => setFormData({...formData, packageName: text})}
              placeholder="Enter package name"
            />
            
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
              placeholder="Enter location"
            />
            
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />
            
            <Text style={styles.inputLabel}>Price (PHP)</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
              placeholder="Enter price"
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Duration (Days)</Text>
            <TextInput
              style={styles.input}
              value={formData.durationDays}
              onChangeText={(text) => setFormData({...formData, durationDays: text})}
              placeholder="Enter duration in days"
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Inclusions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.inclusions}
              onChangeText={(text) => setFormData({...formData, inclusions: text})}
              placeholder="Enter inclusions"
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Exclusions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.exclusions}
              onChangeText={(text) => setFormData({...formData, exclusions: text})}
              placeholder="Enter exclusions"
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Available Slots</Text>
            <TextInput
              style={styles.input}
              value={formData.availableSlots}
              onChangeText={(text) => setFormData({...formData, availableSlots: text})}
              placeholder="Enter available slots"
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={formData.dateStart}
              onChangeText={(text) => setFormData({...formData, dateStart: text})}
              placeholder="Enter start date (e.g., 2023-12-01)"
            />

            <Text style={styles.inputLabel}>End Date (YYYY-MM-DD) - Optional</Text>
            <TextInput
              style={styles.input}
              value={formData.dateEnd}
              onChangeText={(text) => setFormData({...formData, dateEnd: text})}
              placeholder="Enter end date (e.g., 2023-12-05)"
            />

            <Text style={styles.inputLabel}>Start Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              value={formData.startTime}
              onChangeText={(text) => setFormData({...formData, startTime: text})}
              placeholder="Enter start time (e.g., 08:00)"
            />

            <Text style={styles.inputLabel}>End Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              value={formData.endTime}
              onChangeText={(text) => setFormData({...formData, endTime: text})}
              placeholder="Enter end time (e.g., 17:00)"
            />
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Create Package</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderPackageItem = (packageItem) => (
    <View key={packageItem.id} style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageName}>{packageItem.package_name}</Text>
        <View style={styles.packageActions}>
          <TouchableOpacity 
            onPress={() => handleEditPackage(packageItem.id)}
            style={styles.actionButton}
          >
            <Ionicons name="create-outline" size={20} color="#0ea5e9" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => confirmDeletePackage(packageItem.id)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.packageDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{packageItem.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{packageItem.duration_days} days</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>₱{packageItem.price.toLocaleString()}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{packageItem.available_slots} slots available</Text>
        </View>
      </View>
      
      <Text style={styles.packageDescription}>{packageItem.description}</Text>
      
      <View style={styles.packageFooter}>
        <Text style={styles.packageStatus}>
          {packageItem.is_active ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Tour Packages</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={styles.loadingText}>Loading packages...</Text>
          </View>
        ) : packages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>No tour packages found</Text>
            <Text style={styles.emptySubtext}>
              Create your first tour package to get started
            </Text>
          </View>
        ) : (
          <View style={styles.packagesContainer}>
            {packages.map(renderPackageItem)}
          </View>
        )}
      </ScrollView>
      
      {renderCreatePackageModal()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  packagesContainer: {
    marginTop: 8,
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
  packageActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  packageDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  packageStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
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
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Additional styles for better visual hierarchy
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginVertical: 8,
  },
  statusActive: {
    color: '#10b981',
    fontWeight: '500',
  },
  statusInactive: {
    color: '#ef4444',
    fontWeight: '500',
  },
  detailIcon: {
    color: '#64748b',
  },
  // Add responsive styles if needed
  '@media (min-width: 768px)': {
    modalContent: {
      width: '60%',
    }
  }
});