import { login } from '@/lib/api';
import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image } from 'react-native';



export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async () => {
    setError(""); // Clear previous errors
    try {
      await login({ email, password }); // Use the login function
      router.push('/users/users_home');
      // Redirect to the dashboard or home page
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during login.");
      } else {
        setError("An error occurred during login.");
      }
    }
  };
  return (
    <View className="flex-1 justify-center px-6 bg-ghost">
      <Text className="text-4xl font-black mb-6 text-center text-water">Login</Text>

      <TextInput
        placeholder="Email"
        onChange={(e) => setEmail(e.nativeEvent.text)}
        className="border border-gray-300 rounded-md p-3 mb-4"
      />
      <View className="relative mb-1">
        <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChange={(e) => setPassword(e.nativeEvent.text)}
            className="border border-gray-300 rounded-md p-3 pr-12"
        />
        <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5"
        >
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/forgot-password')} className="mb-6">
        <Text className="text-water text-right text-xs">Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        title="Login"
        color="#00ADEF" // Replace with the desired color for the button
        onPress={handleLogin}
      />

      {/* <TouchableOpacity
      className="flex-row items-center justify-center border border-gray-300 rounded-md p-3 mb-6"
      onPress={() => {
        console.log('Continue with Google pressed');
      }}
      >
        <Image
            source={require('../assets/images/google-icon.png')}
            style={{ width: 20, height: 20 }}
        />
        <Text className="ml-2 text-gray-700 font-semibold">Continue with Google</Text>
      </TouchableOpacity> */}

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text className="text-water text-center">Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
