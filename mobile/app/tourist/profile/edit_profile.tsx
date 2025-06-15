import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { updateUserProfile } from '@/lib/api/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import selectFields from '@/static/selectFields';
import { StatusBar } from 'expo-status-bar';

export default function EditProfileScreen() {
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    first_name: params.first_name?.toString() || '',
    last_name: params.last_name?.toString() || '',
    phone_number: params.phone_number?.toString() || '',
    email: params.email?.toString() || '',
    nationality: params.nationality?.toString() || '',
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get nationality options from selectFields
  const nationalityOptions = selectFields().find(field => field.name === 'nationality')?.options || [];

  // Get user data on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsed = JSON.parse(storedUserData);
          setUserData(parsed);
          
          // Update form with stored user data if not provided in params
          setForm(prev => ({
            first_name: prev.first_name || parsed.first_name || '',
            last_name: prev.last_name || parsed.last_name || '',
            phone_number: prev.phone_number || parsed.phone_number || '',
            email: parsed.email || '',
            nationality: prev.nationality || parsed.nationality || '',
          }));
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };
    
    getUserData();
  }, []);

  const handleChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userData || (!userData.user_id && !userData.id)) {
      Alert.alert("Error", "User ID not found. Please log in again.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Format data for API
      const dataToSend = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        nationality: form.nationality,
        email: userData.email, // Keep original email
        role: userData.role || 'Tourist',
        status: userData.status || 'Active'
      };
      
      console.log('Attempting to update profile with data:', dataToSend);
      
      const updatedUser = await updateUserProfile(dataToSend);
      console.log('Update successful:', updatedUser);
      
      // Update local storage with new data
      const newUserData = {
        ...userData,
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        nationality: form.nationality
      };
      
      console.log('Updating AsyncStorage with:', newUserData);
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
      
      Alert.alert(
        "Success", 
        "Profile updated successfully",
        [
          {
            text: "OK",
            onPress: () => {
              // Force refresh the tourist_profile screen by replacing it
              router.replace({
                pathname: "/tourist/profile/tourist_profile",
                params: { refresh: Date.now() }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error("Update failed:", error);
      
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error.response) {
        console.log('Error response:', error.response);
        if (error.response.status === 404) {
          errorMessage = "Update service not found. Please contact support.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.profileImageSection}>
            <View style={styles.avatarContainer}>
              {userData?.profile_image ? (
                <Image 
                  source={{ uri: userData.profile_image }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>
                    {form.first_name.charAt(0)}{form.last_name.charAt(0)}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <MaterialIcons name="camera-alt" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{form.first_name} {form.last_name}</Text>
            <Text style={styles.profileEmail}>{userData?.email}</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#38bdf8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.first_name}
                  onChangeText={(text) => handleChange('first_name', text)}
                  placeholder="Enter first name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#38bdf8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.last_name}
                  onChangeText={(text) => handleChange('last_name', text)}
                  placeholder="Enter last name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color="#38bdf8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.phone_number}
                  onChangeText={(text) => handleChange('phone_number', text)}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nationality</Text>
              <View style={styles.pickerOuterWrapper}>
                <View style={styles.pickerWrapper}>
                  <Ionicons name="flag-outline" size={20} color="#38bdf8" style={styles.inputIcon} />
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={form.nationality}
                      onValueChange={(value) => handleChange('nationality', value)}
                      style={styles.picker}
                      dropdownIconColor="#38bdf8"
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label="Select Nationality" value="" />
                      {nationalityOptions.map((option) => (
                        <Picker.Item 
                          key={option.value} 
                          label={option.label} 
                          value={option.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.disabledButton]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#38bdf8',
  },
  container: {
    flex: 1,
    backgroundColor: '#38bdf8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    position: 'relative',
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#38bdf8',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#64748b',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  pickerOuterWrapper: {
    // This extra wrapper helps with styling
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  pickerContainer: {
    flex: 1,
    // Ensure enough height for the picker
    height: Platform.OS === 'ios' ? 150 : 60,
  },
  picker: {
    flex: 1,
    // Increased height to prevent text clipping
    height: Platform.OS === 'ios' ? 150 : 50,
    color: '#1e293b',
  },
  pickerItem: {
    fontSize: 16,
    height: 120, // Increased height for iOS picker items
    color: '#1e293b',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#38bdf8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  }
});


