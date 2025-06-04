import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserManager } from '@/hooks/useUserManager';
import signupSchema, { signupSchema as SignupSchemaType } from '@/static/userManagerSchema';
import { z } from 'zod';

export default function AdminUserCreate() {
  const router = useRouter();
  const { registerUser } = useUserManager();

  const [form, setForm] = useState<Omit<SignupSchemaType, 'confirm_password'>>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    role: 'Tourist',
    nationality: 'Filipino',
    terms: true,
    status: 'Active',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const dataToValidate = { ...form, confirm_password: confirmPassword };
    try {
      signupSchema.parse(dataToValidate);
      await registerUser(dataToValidate);
      Alert.alert('Success', 'User created successfully');
      router.push('/admin/users/admin_users');
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors); 
        Alert.alert('Validation Error', error.errors[0].message);
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New User</Text>
      <TextInput
        placeholder="First Name"
        style={styles.input}
        onChangeText={(text) => handleChange('first_name', text)}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        onChangeText={(text) => handleChange('last_name', text)}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        onChangeText={(text) => handleChange('phone_number', text)}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}
      />
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007dab',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
