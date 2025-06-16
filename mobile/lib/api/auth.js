import axios from "axios";
import { getBaseUrl, API_ENDPOINTS, logApiRequest } from "./utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get the full URL for auth endpoints (which may not have the /api/v1 prefix)
 * @param {string} endpoint - The API endpoint
 * @returns {string} The full URL
 */
const getAuthUrl = (endpoint) => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error('API URL is not defined');
  }
  
  // Ensure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${baseUrl}${formattedEndpoint}`;
};

/**
 * Login user with email and password
 * @param {Object} userData - User credentials
 * @returns {Promise<Object>} User data
 */
export const login = async (userData) => {
  try {
    // Ensure email is uppercase as backend expects
    if (userData.email) {
      userData.email = userData.email.toUpperCase();
    }
    
    // Use direct URL construction for login endpoint
    const url = getAuthUrl(API_ENDPOINTS.LOGIN);
    console.log('Login request to:', url);
    console.log('Login data:', { ...userData, password: '***' });
    
    logApiRequest('POST', url, { ...userData, password: '***' });
    const response = await axios.post(url, userData, {
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Login response status:', response.status);
    
    if (response.status !== 200) {
      throw new Error(`Failed to login. Server responded with status: ${response.status}`);
    }
    
    // Store user data in AsyncStorage for offline access
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    } catch (storageError) {
      console.warn('Failed to store user data in AsyncStorage:', storageError);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    console.error("Warning: Full error object:", JSON.stringify(error));
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data
 */
export const signup = async (userData) => {
  try {
    const url = getFullUrl(API_ENDPOINTS.SIGNUP);
    logApiRequest('POST', url, userData);
    
    const response = await axios.post(url, userData, {
      withCredentials: true,
      timeout: 10000
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

/**
 * Logout the current user
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    const url = getAuthUrl(API_ENDPOINTS.LOGOUT);
    logApiRequest('POST', url);
    
    const response = await axios.post(url, {}, {
      withCredentials: true,
      timeout: 10000
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to logout. Server responded with status: ${response.status}`);
    }
    
    // Clear user data from AsyncStorage
    try {
      await AsyncStorage.removeItem('userData');
    } catch (storageError) {
      console.warn('Failed to clear user data from AsyncStorage:', storageError);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Response data
 */
export const forgotPassword = async (email) => {
  try {
    const url = getAuthUrl(API_ENDPOINTS.FORGOT_PASSWORD);
    logApiRequest('POST', url, { email });
    
    const response = await axios.post(url, { email }, {
      withCredentials: true,
      timeout: 10000
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
