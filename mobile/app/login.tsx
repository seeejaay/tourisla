import { login } from '@/lib/api/auth.js';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const trimmedEmail = email.trim().toUpperCase();
    const trimmedPassword = password.trim();

    console.log('Logging in with:', {
      email: trimmedEmail,
      password: trimmedPassword,
    });

    try {
      console.log('Sending login payload:', { email: trimmedEmail, password: trimmedPassword });
      const res = await login({ email: trimmedEmail, password: trimmedPassword });
      console.log('Login Response:', res);

      const { role, ...userData } = res.user;

      if (!role) {
        setError('No role returned. Cannot proceed.');
        return;
      }

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('role', role);

      switch (role) {
        case 'Admin':
          router.replace('/admin/admin_dashboard');
          break;
        case 'Tourist':
          router.replace('/tourist/tourist_dashboard');
          break;
        case 'tour_guide':
          router.replace('/guide_home');
          break;
        case 'tour_operator':
          router.replace('/operator_home');
          break;
        default:
          setError('Unknown role.');
      }
    } catch (err: any) {
      console.error('Login Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'An error occurred during login.');
    }
  };

  const debugApiUrl = () => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
    const loginUrl = `${baseUrl}login`;
    
    Alert.alert(
      'API URL Debug',
      `Environment variable: ${API_URL}\n\nFormatted URL: ${loginUrl}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/forgot-password')} style={{ marginBottom: 24 }}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.signupRedirectText}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={debugApiUrl}
        style={styles.helpButton}
      >
        <Text style={styles.helpButtonText}>Debug API URL</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb', // ghost
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    color: '#0f172a', // water
    marginBottom: 24,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: '#0f172a',
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  signupRedirectText: {
    textAlign: 'center',
    color: '#0f172a',
    fontWeight: '500',
  },
  helpButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  helpButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

