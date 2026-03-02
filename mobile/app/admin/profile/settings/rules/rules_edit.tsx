import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  Switch, ScrollView, Alert, SafeAreaView, StatusBar, Platform, 
  ActivityIndicator, KeyboardAvoidingView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRuleManager } from '@/hooks/useRuleManager';
import { Picker } from '@react-native-picker/picker';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

export default function RulesEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRuleById, updateRule } = useRuleManager();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [penalty, setPenalty] = useState('');
  const [category, setCategory] = useState('General');
  const [isActive, setIsActive] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [ruleId, setRuleId] = useState<string>('');
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    penalty: '',
    category: '',
  });

  useEffect(() => {
    if (id) {
      loadRule(id);
    } else {
      setInitialLoading(false);
      Alert.alert('Error', 'Rule ID is missing', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [id]);

  const loadRule = async (ruleId: string) => {
    try {
      setInitialLoading(true);
      const rule = await getRuleById(ruleId);
      
      if (rule) {
        setRuleId(rule.id);
        setTitle(rule.title || '');
        setDescription(rule.description || '');
        setPenalty(rule.penalty || '');
        setCategory(rule.category || 'General');
        setIsActive(rule.is_active);
        
        if (rule.effective_date) {
          setEffectiveDate(new Date(rule.effective_date));
        }
      } else {
        Alert.alert('Error', 'Rule not found', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (err) {
      console.error('Error loading rule:', err);
      Alert.alert('Error', `Failed to load rule: ${err.message}`, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } finally {
      setInitialLoading(false);
    }
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

  const handleBackPress = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const formattedDate = effectiveDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      const ruleData = {
        title,
        description,
        penalty,
        category,
        is_active: isActive,
        effective_date: formattedDate
      };
      
      console.log('Updating rule with ID:', ruleId);
      console.log('Rule data:', ruleData);
      
      await updateRule(ruleId, ruleData);
      
      Alert.alert(
        'Success',
        'Rule updated successfully',
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
    } catch (err: any) {
      console.error('Error updating rule:', err);
      Alert.alert(
        'Error',
        `Failed to update rule: ${err.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.header}
        >
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Rule</Text>
          <View style={styles.placeholder} />
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f172a" />
          <Text style={styles.loadingText}>Loading rule details...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Edit Rule</Text>
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
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Enter rule category"
              placeholderTextColor="#94a3b8"
            />
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
                <Text style={styles.submitButtonText}>Update Rule</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});



