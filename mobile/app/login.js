import { login } from '@/lib/api/auth.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLogin = async () => {
  if (!email || !password) {
    setError('Email and password are required');
    return;
  }
  
  setLoading(true);
  setError('');
  
  try {
    console.log('Attempting login with email:', email);
    // Make sure we're using the correct login function
    const response = await login({ 
      email: email.trim(), 
      password: password.trim() 
    });
    console.log('Login successful:', response);
    
    // Store user data
    if (response.user) {
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
    }
    
    // Navigate based on user role
    if (response.user.role === 'Admin') {
      router.replace('/admin');
    } else if (response.user.role === 'Tourism Staff') {
      router.replace('/tourism-staff');
    } else {
      router.replace('/');
    }
  } catch (err) {
    console.error('Login Error:', err.response?.data || err.message);
    
    let errorMessage = 'Login failed';
    
    // Handle different error scenarios
    if (err.response) {
      // The server responded with an error status
      if (err.response.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response.status === 404) {
        errorMessage = 'Server endpoint not found. Please check your connection.';
      } else if (err.response.data?.error) {
        errorMessage = err.response.data.error;
      }
    } else if (err.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request
      errorMessage = err.message || 'An unexpected error occurred';
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

