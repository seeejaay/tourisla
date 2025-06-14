// app/forgot-password.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Correct: use hook at top-level
  const { handleForgotPassword } = useAuth();

  const onSubmit = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      const response = await handleForgotPassword(email.trim().toUpperCase());
      Alert.alert('Success', response.message || 'Reset link sent!');
      setEmail('');
      router.push('/login');
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || 'Failed to send reset link.';
      if (errorMessage === 'User not found') {
        Alert.alert('Error', 'No account found with this email address.');
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Forgot Password</Text>
      <Text className="text-base text-gray-600 mb-6 text-center">
        Enter your email and we'll send you a link to reset your password.
      </Text>
      <TextInput
        className="w-full p-3 border border-gray-300 rounded-xl mb-4"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
        <TouchableOpacity
          className={`w-full py-3 rounded-xl ${
            loading ? 'bg-gray-400' : 'bg-blue-600'
          }`}
          onPress={onSubmit}
          disabled={loading}
        >
        <Text className="text-center text-white font-semibold">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
