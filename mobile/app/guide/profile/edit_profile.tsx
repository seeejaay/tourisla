import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { editUser } from '@/lib/api/users';

export default function EditProfileScreen() {
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    first_name: params.first_name || '',
    last_name: params.last_name || '',
    phone_number: params.phone_number || '',
    nationality: params.nationality || '',
    email: params.email || '',
    birth_date: params.birth_date || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      const payload = {
        ...form,
        user_id: params.user_id, // ✅ must include for editUser to work
        role: 'Tour Guide',
        status: 'Active',
      };
  
      // Optionally prevent email changes
      if (form.email === params.email) {
        delete payload.email;
      }
  
      await editUser(payload); // ✅ uses new API method
  
      Alert.alert('Success', 'Profile updated successfully.');
      router.back();
    } catch (error) {
      let errorMsg = 'Failed to update profile. Please try again.';
      if (
        error.response?.status === 409 &&
        error.response?.data?.error?.includes('Email already exists')
      ) {
        errorMsg = 'The email address is already taken. Please use another one.';
      }
  
      Alert.alert('Error', errorMsg);
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
        {[
          { label: 'First Name', key: 'first_name' },
          { label: 'Last Name', key: 'last_name' },
          { label: 'Phone Number', key: 'phone_number' },
          { label: 'Nationality', key: 'nationality' },
          { label: 'Birth Date (YYYY-MM-DD)', key: 'birth_date' },
        ].map((item, idx) => (
          <View key={idx} style={styles.inputGroup}>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              style={styles.input}
              value={form[item.key as keyof typeof form]}
              onChangeText={(text) => handleChange(item.key as keyof typeof form, text)}
              keyboardType={item.key.includes('phone') ? 'phone-pad' : 'default'}
              autoCapitalize="none"
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1c5461',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: '#64748b',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1c5461',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});