import axios from 'axios';
import { getApiUrl } from './apiUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get the user ID from AsyncStorage
const getUserId = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.user_id || parsed.id;
    }
    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    // Get the user ID
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User ID not found. Please log in again.');
    }
    
    // Format the data exactly as expected by the backend
    const formattedData = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      phone_number: profileData.phone_number,
      nationality: profileData.nationality,
      // Include other fields that might be required
      email: profileData.email,
      role: profileData.role || 'Tourist',
      status: profileData.status || 'Active'
    };
    
    // Remove undefined values
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined) {
        delete formattedData[key];
      }
    });
    
    console.log('Updating profile for user ID:', userId);
    console.log('Formatted profile data:', formattedData);
    
    const url = getApiUrl(`users/${userId}`);
    const response = await axios.put(url, formattedData, {
      withCredentials: true,
    });
    
    console.log('Update profile response:', response.status);
    return response.data;
  } catch (error) {
    console.error(
      "Error Updating User Profile: ",
      error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : error.message
    );
    throw error;
  }
};

export const updateUserProfileAlternative = async (profileData) => {
  try {
    // Try a different endpoint that might be used by your backend
    const url = getApiUrl('users/update');
    console.log('Trying alternative update endpoint:', url);
    console.log('Profile data being sent:', JSON.stringify(profileData));
    
    const response = await axios.put(url, profileData, {
      withCredentials: true,
    });

    console.log('Update profile response:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error with alternative update: ",
      error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : error.message
    );
    throw error;
  }
};

// Add a third method that uses POST instead of PUT
export const updateUserProfilePost = async (profileData) => {
  try {
    const url = getApiUrl('users/update');
    console.log('Trying POST update endpoint:', url);
    console.log('Profile data being sent:', JSON.stringify(profileData));
    
    const response = await axios.post(url, profileData, {
      withCredentials: true,
    });

    console.log('Update profile response:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error with POST update: ",
      error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : error.message
    );
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const url = getApiUrl('auth/change-password');
    logApiRequest('POST', url);
    
    const response = await axios.post(url, passwordData, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Changing Password: ",
      error.response?.data || error.message
    );
    throw error;
  }
};






