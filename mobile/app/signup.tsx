import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image } from 'react-native';

export default function SignUpScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View className="flex-1 justify-center px-6 bg-ghost">
      <Text className="text-4xl font-black mb-6 text-center text-water">Sign Up</Text>

      <TextInput
        placeholder="Name"
        className="border border-gray-300 rounded-md p-3 mb-4"
      />

      <TextInput
        placeholder="Username"
        className="border border-gray-300 rounded-md p-3 mb-4"
      />

      <TextInput
        placeholder="Email"
        className="border border-gray-300 rounded-md p-3 mb-4"
      />

      {/* Password */}
      <View className="relative mb-4">
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          className="border border-gray-300 rounded-md p-3 pr-12"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3.5"
        >
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View className="relative mb-6">
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          className="border border-gray-300 rounded-md p-3 pr-12"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-3.5"
        >
          <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="bg-water rounded-md p-3 mb-4">
        <Text className="text-white text-center font-semibold">Sign Up</Text>
      </TouchableOpacity>

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

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text className="text-water text-center">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
