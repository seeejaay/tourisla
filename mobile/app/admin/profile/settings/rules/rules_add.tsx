import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, Switch, SafeAreaView, StatusBar, Platform, Alert,
  KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRuleManager } from '@/hooks/useRuleManager';
import { Picker } from '@react-native-picker/picker';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

export default function AddRuleScreen() {
  const { createRule, loading, error } = useRuleManager();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [penalty, setPenalty] = useState('');
  const [category, setCategory] = useState('General');
  const [isActive, setIsActive] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    penalty: '',
    category: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      title: '',
      description: '',
      penalty: '',
      category: '',
    };

    if (!title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    } else if (title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
      isValid = false;
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
      isValid = false;
    }

    if (!penalty.trim()) {
      errors.penalty = 'Penalty is required';
      isValid = false;
    }

    if (!category.trim()) {
      errors.category = 'Category is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEffectiveDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const formattedDate = effectiveDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Add a timestamp to make the title unique
      const uniqueTitle = `${title.trim()} ${Date.now().toString().slice(-4)}`;
      
      const ruleData = {
        title: uniqueTitle, // Use the unique title
        description,
        penalty,
        category,
        is_active: isActive,
        effective_date: formattedDate
      };
      
      console.log('Submitting rule with unique title:', uniqueTitle);
      
      const result = await createRule(ruleData);
      console.log('Rule created successfully:', result);
      
      Alert.alert(
        'Success',
        'Rule created successfully',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Navigate back to the rules list
              router.back();
            }
          }
        ]
      );
    } catch (err) {
      console.error('Error submitting rule:', err);
      
      // Extract the error message
      let errorMessage = 'Failed to create rule';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Check if it's a 404 error
      if (err.response?.status === 404) {
        errorMessage = 'Server endpoint not found. Please check your API configuration.';
      }
      
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Rule</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter rule title"
              placeholderTextColor="#94a3b8"
            />
            {formErrors.title ? (
              <Text style={styles.errorText}>{formErrors.title}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter rule description"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {formErrors.description ? (
              <Text style={styles.errorText}>{formErrors.description}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Penalty</Text>
            <TextInput
              style={styles.input}
              value={penalty}
              onChangeText={setPenalty}
              placeholder="Enter penalty for violation"
              placeholderTextColor="#94a3b8"
            />
            {formErrors.penalty ? (
              <Text style={styles.errorText}>{formErrors.penalty}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="General" value="General" />
                <Picker.Item label="Safety" value="Safety" />
                <Picker.Item label="Environment" value="Environment" />
                <Picker.Item label="Accommodation" value="Accommodation" />
                <Picker.Item label="Transportation" value="Transportation" />
                <Picker.Item label="Activities" value="Activities" />
              </Picker>
            </View>
            {formErrors.category ? (
              <Text style={styles.errorText}>{formErrors.category}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Effective Date</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={showDatepicker}
            >
              <Text style={styles.dateText}>
                {effectiveDate.toLocaleDateString()}
              </Text>
              <Feather name="calendar" size={20} color="#64748b" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={effectiveDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#cbd5e1', true: '#0f766e' }}
                thumbColor={isActive ? '#fff' : '#f4f4f5'}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="save" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Save Rule</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 120,
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
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#0f172a',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#0f172a',
  },
  submitButton: {
    backgroundColor: '#0f766e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
});









