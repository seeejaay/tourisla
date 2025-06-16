import axios from "axios";
import { getApiUrl, logApiRequest } from "./utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (userData) => {
  try {
    // Ensure email is uppercase as backend expects
    if (userData.email) {
      userData.email = userData.email.toUpperCase();
    }
    
    const url = getApiUrl('login');
    console.log('Login request to:', url);
    console.log('Login data:', { ...userData, password: '***' });
    
    // Add timeout and better error handling
    const response = await axios.post(url, userData, {
      withCredentials: true,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Login response status:', response.status);
    console.log('Login response headers:', response.headers);
    console.log('Login response data:', response.data);
    
    if (response.status !== 200) {
      console.error(`Failed login with status: ${response.status}`);
      throw new Error(`Failed to login. Server responded with status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    console.error("Full error object:", JSON.stringify(error));
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const url = getApiUrl('signup');
    logApiRequest('POST', url, userData);
    
    const response = await axios.post(url, userData, {
      withCredentials: true,
    });
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Failed to signup. Server responded with status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const url = getApiUrl('logout');
    logApiRequest('POST', url);
    
    const response = await axios.post(url, {}, {
      withCredentials: true,
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to logout. Server responded with status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error.response?.data || error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const url = getApiUrl('forgot-password');
    logApiRequest('POST', url, { email });
    
    const response = await axios.post(url, { email }, {
      withCredentials: true,
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to request password reset. Server responded with status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during forgot password:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const url = getApiUrl('reset-password');
    logApiRequest('POST', url);
    
    const response = await axios.post(url, { token, password }, {
      withCredentials: true,
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to reset password. Server responded with status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during password reset:", error.response?.data || error.message);
    throw error;
  }
};

export const currentUser = async () => {
  try {
    // Define multiple possible endpoints to try
    const possibleEndpoints = [
      'user',           // Try the standard endpoint first
      'users/current',  // Then try a common alternative
      'me',             // Another common endpoint for current user
      'auth/user'       // Auth-prefixed endpoint
    ];
    
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of possibleEndpoints) {
      try {
        const url = getApiUrl(endpoint);
        console.log(`Trying to fetch user from: ${url}`);
        
        const response = await axios.get(url, {
          withCredentials: true,
          timeout: 5000, // 5 second timeout
        });
        
        if (response.status === 200 && response.data) {
          console.log(`Successfully fetched user from: ${url}`);
          return response.data;
        }
      } catch (error) {
        console.log(`Failed to fetch user from endpoint ${endpoint}: ${error.message}`);
        lastError = error;
        // Continue to the next endpoint
      }
    }
    
    // If all endpoints fail, try to get user data from AsyncStorage as fallback
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log('Using cached user data from AsyncStorage');
        return { data: { user: parsedData } };
      }
    } catch (storageError) {
      console.error('Error accessing AsyncStorage:', storageError);
    }
    
    // If we get here, all endpoints failed and no cached data
    throw lastError || new Error('Failed to fetch user from any endpoint');
  } catch (error) {
    console.error("Error getting current user:", error.response?.data || error.message);
    throw error;
  }
};
