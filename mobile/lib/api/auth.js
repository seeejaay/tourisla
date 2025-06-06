import axios from "axios";
import { getApiUrl, logApiRequest } from "./utils";

export const login = async (userData) => {
  try {
    const url = getApiUrl('login');
    logApiRequest('POST', url, userData);
    
    const response = await axios.post(url, userData, {
      withCredentials: true,
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to login. Server responded with status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
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
    // Try different endpoints that might be used by your backend
    const possibleEndpoints = [
      'user',           // First try the standard endpoint
      'auth/me',        // Then try auth/me
      'auth/profile',   // Then try auth/profile
      'auth/user',      // Then try auth/user
      'users/me',       // Then try users/me
      'profile'         // Finally try profile
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
    
    // If we get here, all endpoints failed
    throw lastError || new Error('Failed to fetch user from any endpoint');
  } catch (error) {
    console.error("Error getting current user:", error.response?.data || error.message);
    throw error;
  }
};
