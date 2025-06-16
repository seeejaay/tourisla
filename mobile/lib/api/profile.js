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
    
    console.log('Updating profile for user ID:', userId);
    console.log('Profile data being sent:', JSON.stringify(profileData));
    
    // Format the data exactly as expected by the backend
    const formattedData = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      phone_number: profileData.phone_number,
      nationality: profileData.nationality,
      email: profileData.email,
      role: profileData.role || 'Tourist',
      status: profileData.status || 'Active'
    };
    
    // Add profile image if available
    if (profileData.profile_image) {
      formattedData.profile_image = profileData.profile_image;
    }
    
    // Remove undefined values
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined) {
        delete formattedData[key];
      }
    });
    
    // Try multiple endpoints and methods until one works
    let response;
    let error;
    
    // First try the standard endpoint with PUT
    try {
      const url = getApiUrl(`users/${userId}`);
      console.log('Trying standard endpoint:', url);
      response = await axios.put(url, formattedData, {
        withCredentials: true,
      });
      console.log('Update profile response:', response.status);
      return response.data;
    } catch (err) {
      console.error('Standard endpoint failed:', err.message);
      error = err;
      // Continue to next attempt
    }
    
    // Try alternative endpoint with PUT
    try {
      const url = getApiUrl('users/update');
      console.log('Trying alternative endpoint:', url);
      response = await axios.put(url, {
        ...formattedData,
        user_id: userId
      }, {
        withCredentials: true,
      });
      console.log('Alternative update response:', response.status);
      return response.data;
    } catch (err) {
      console.error('Alternative endpoint failed:', err.message);
      // Continue to next attempt
    }
    
    // Try with POST method
    try {
      const url = getApiUrl('users/update');
      console.log('Trying POST method:', url);
      response = await axios.post(url, {
        ...formattedData,
        user_id: userId
      }, {
        withCredentials: true,
      });
      console.log('POST update response:', response.status);
      return response.data;
    } catch (err) {
      console.error('POST method failed:', err.message);
    }
    
    // If we got here, all attempts failed
    throw error || new Error('All update attempts failed');
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








