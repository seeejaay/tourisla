import { login } from '@/lib/api/auth.js';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  // Animation value for error notification
  const errorAnim = useRef(new Animated.Value(0)).current;
  
  // Handle error animation when error state changes
  useEffect(() => {
    if (error) {
      // Reset animation value first
      errorAnim.setValue(0);
      
      // Animate in with a bounce effect
      Animated.spring(errorAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
      
      // Set a timeout to hide the error after 5 seconds
      const timer = setTimeout(() => {
        Animated.timing(errorAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setError(''));
      }, 5000);
      
      // Clear the timeout if the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error, errorAnim]);

  const handleLogin = async () => {
    setError('');
    
    // Validate inputs
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    // Format email exactly as backend expects
    const trimmedEmail = email.trim().toUpperCase();
    const trimmedPassword = password.trim();

    try {
      console.log('Attempting login with email:', trimmedEmail);
      
      const res = await login({ email: trimmedEmail, password: trimmedPassword });
      console.log('Login response:', JSON.stringify(res));
      
      // Make sure we're getting the correct role
      if (!res || !res.user) {
        setError('Invalid login response');
        return;
      }
      
      const { role } = res.user;
      console.log('User role from login:', role);

      if (!role) {
        setError('No role returned. Cannot proceed.');
        return;
      }

      // Store the exact role as returned by the API
      await AsyncStorage.setItem('userData', JSON.stringify(res.user));
      await AsyncStorage.setItem('role', role);

      // Use the role directly from the response
      switch (role) {
        case 'Admin':
          router.replace('/admin/admin_dashboard');
          break;
        case 'Tourist':
          router.replace('/tourist/tourist_dashboard');
          break;
        case 'Tour Guide':
        case 'tour_guide':
          router.replace('/guide_home');
          break;
        case 'Tour Operator':
        case 'tour_operator':
          router.replace('/operator/operator_dashboard');
          break;
        case 'Tourism Staff':
          router.replace('/staff/staff_dashboard');
          break;
        default:
          console.log('Unknown role received:', role);
          setError('Unknown role: ' + role);
      }
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
      // Extract the error message
      if (err.response?.data?.error === "Invalid email or password") {
        setError('Invalid email or password');
      } else {
        setError(err.response?.data?.message || err.message || 'An error occurred during login.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Login</Text>
      
      {/* Error Notification - Positioned below the title */}
      {error && (
        <Animated.View 
          style={[
            styles.errorNotification,
            {
              opacity: errorAnim,
              transform: [
                {
                  translateY: errorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.errorContent}>
            <Feather name="alert-circle" size={20} color="#ffffff" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity 
            style={styles.errorDismiss}
            onPress={() => setError('')}
          >
            <Feather name="x" size={18} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Login Form */}
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

      {/* Login Redirect */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/role-selection')}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  errorNotification: {
    backgroundColor: '#ef4444', // Bootstrap danger background
    borderColor: '#f5c2c7', // Bootstrap danger border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: '#ffffff', // Bootstrap danger text color
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 8,
    flex: 1,
  },
  errorDismiss: {
    padding: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    color: '#0f172a',
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
  signupText: {
    textAlign: 'center',
    color: '#0f172a',
    fontWeight: '500',
  },
  footer: {
    marginTop: 24,
  },
  // helpButton and helpButtonText styles removed
});
