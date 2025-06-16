import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
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

export default function AdminTermAdd() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { addTerm } = useTermsManager();
  const [form, setForm] = useState({
    title: POLICY_TYPES[0],
    content: '',
    version: '1.0',
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0], // Add effective date
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Submitting term data:', termData);
      
      await addTerm(termData);
      
      Alert.alert(
        'Success',
        'Terms & Conditions created successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error creating term:', error);
      
      let errorMessage = 'Failed to create terms & conditions';
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
        <Text style={styles.headerTitle}>Add Terms & Conditions</Text>
        <View style={{ width: 24 }} />
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
            <Text style={styles.submitButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    minHeight: 200,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

