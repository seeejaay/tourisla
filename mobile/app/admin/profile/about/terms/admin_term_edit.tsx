import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTermsManager } from '../../../../../lib/hooks/useTermsManager';
import DateTimePicker from '@react-native-community/datetimepicker';

// Valid policy types based on the backend enum
const POLICY_TYPES = [
  'TERMS',
  'PRIVACY_POLICY',
  'REFUND_POLICY',
  'COMMUNITY_GUIDELINES',
  'TERMS_OF_SERVICE'
];

export default function AdminTermEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { getTerm, editTerm } = useTermsManager();
  const [form, setForm] = useState({
    title: POLICY_TYPES[0],
    content: '',
    version: '1.0',
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTerm();
    } else {
      setLoading(false);
      Alert.alert('Error', 'No term ID provided');
      router.back();
    }
  }, [id]);

  const fetchTerm = async () => {
    try {
      setLoading(true);
      const termData = await getTerm(id);
      
      setForm({
        title: termData.type || termData.title || POLICY_TYPES[0],
        content: termData.content || '',
        version: termData.version || '1.0',
        is_active: termData.is_active !== undefined ? termData.is_active : true,
        effective_date: termData.effective_date || new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error fetching term:', error);
      Alert.alert('Error', 'Failed to load term details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange('effective_date', formattedDate);
    }
  };

  const handleSubmit = async () => {
    if (!form.title) {
      Alert.alert('Error', 'Policy type is required');
      return;
    }

    if (!form.content.trim()) {
      Alert.alert('Error', 'Content is required');
      return;
    }

    if (!form.version.trim()) {
      Alert.alert('Error', 'Version is required');
      return;
    }

    if (!form.effective_date) {
      Alert.alert('Error', 'Effective date is required');
      return;
    }

    try {
      setSubmitting(true);
      
      // Map our form data to match the backend's expected format
      const termData = {
        type: form.title,
        content: form.content,
        version: form.version,
        is_active: form.is_active,
        effective_date: form.effective_date,
        updated_at: new Date().toISOString()
      };
      
      console.log('Updating term data:', termData);
      
      await editTerm(id, termData);
      
      Alert.alert(
        'Success',
        'Terms & Conditions updated successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error updating term:', error);
      
      let errorMessage = 'Failed to update terms & conditions';
      if (error.response) {
        errorMessage += ` (Status: ${error.response.status})`;
        if (error.response.data && error.response.data.error) {
          errorMessage += `: ${error.response.data.error}`;
        }
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Policy Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.title}
              onValueChange={(value) => handleChange('title', value)}
              style={styles.picker}
              enabled={!submitting}
            >
              {POLICY_TYPES.map((type) => (
                <Picker.Item 
                  key={type} 
                  label={type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                  value={type} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Version</Text>
          <TextInput
            style={styles.input}
            value={form.version}
            onChangeText={(text) => handleChange('version', text)}
            placeholder="e.g., 1.0, 2.1"
            editable={!submitting}
          />
        </View>
        
        {/* Add effective date field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Effective Date</Text>
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
            disabled={submitting}
          >
            <Text>{form.effective_date || 'Select date'}</Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={new Date(form.effective_date || Date.now())}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.content}
            onChangeText={(text) => handleChange('content', text)}
            placeholder="Enter the terms and conditions content here..."
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            editable={!submitting}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Active</Text>
          <Switch
            value={form.is_active}
            onValueChange={(value) => handleChange('is_active', value)}
            disabled={submitting}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Update</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 150,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 1,
  },
});
