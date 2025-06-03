import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import CheckBox from 'expo-checkbox';
import { useUserManager } from '@/hooks/useUserManager';
import selectFields from '@/static/selectFields';

export default function SignUpScreen() {
  const { registerUser } = useUserManager();

  const nationalityOptions = selectFields().find(field => field.name === 'nationality')?.options || [];

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    nationality: '',
    password: '',
    confirm_password: '',
    terms: false,
    role: 'Tourist',
    status: 'Active',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      nationality,
      password,
      confirm_password,
      terms,
      role,
      status,
    } = form;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !nationality ||
      !password ||
      !confirm_password
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirm_password) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!terms) {
      Alert.alert('Notice', 'You must agree to the terms and conditions');
      return;
    }

    try {
      await registerUser({
        first_name,
        last_name,
        email: email.toUpperCase(), 
        phone_number,
        nationality,
        password,
        confirm_password,
        terms,
        role,
        status,
      });
      router.push('/login');
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput placeholder="First Name" style={styles.input} onChangeText={(text) => handleChange('first_name', text)} value={form.first_name}/>
      <TextInput placeholder="Last Name" style={styles.input} onChangeText={(text) => handleChange('last_name', text)} value={form.last_name}/>
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" onChangeText={(text) => handleChange('email', text)} value={form.email}/>
      <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" onChangeText={(text) => handleChange('phone_number', text)} value={form.phone_number}/>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.nationality}
          onValueChange={(value) => handleChange('nationality', value)}
          value={form.nationality}
          style={styles.picker}
        >
          <Picker.Item label="Select Nationality" value="" enabled={false} />
          {nationalityOptions.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          onChangeText={(text) => handleChange('password', text)}
          value={form.password}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
          onChangeText={(text) => handleChange('confirm_password', text)}
          value={form.confirm_password}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox
          value={form.terms}
          onValueChange={(val) => handleChange('terms', val)}
          color={form.terms ? '#007dab' : undefined}
        />
        <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
      </View>

      <TouchableOpacity onPress={handleSignUp} style={styles.signupButton}>
        <Text style={styles.signupButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginRedirectText}>Already have an account? Login</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    color: '#007dab',
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
  pickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    padding: 12,
    height: 50,
    width: '100%',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#007dab',
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
  signupButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginRedirectText: {
    textAlign: 'center',
    color: '#007dab',
    fontWeight: '500',
  },
});