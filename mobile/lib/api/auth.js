// auth.js (mobile)

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL; // <- Use Expo public env

// Helper to ensure API_URL ends with a slash
const ensureTrailingSlash = (url) => (url.endsWith("/") ? url : `${url}/`);

// Login user
export const login = async (userData) => {
  try {
    if (userData.email) {
      userData.email = userData.email.toUpperCase();
    }

    const response = await axios.post(`${ensureTrailingSlash(API_URL)}login`, userData, {
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to login. Server responded with status: ${response.status}`);
    }

    await AsyncStorage.setItem("userData", JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await axios.post(`${ensureTrailingSlash(API_URL)}logout`, {}, {
      withCredentials: true,
      timeout: 10000,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to logout. Server responded with status: ${response.status}`);
    }

    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("operatorApplicationStatus");
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error.response?.data || error.message);
    // Still clear local storage even if request failed
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("operatorApplicationStatus");
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${ensureTrailingSlash(API_URL)}forgot-password`, { email }, {
      withCredentials: true,
      timeout: 10000,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to request password reset. Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error during forgot password:", error.response?.data || error.message);
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${ensureTrailingSlash(API_URL)}reset-password`, { token, password }, {
      withCredentials: true,
      timeout: 10000,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to reset password. Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error during password reset:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch current user
export const currentUser = async () => {
  try {
    const response = await axios.get(`${ensureTrailingSlash(API_URL)}user`, {
      withCredentials: true,
      timeout: 5000,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch user. Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error.response?.data || error.message);
    throw error;
  }
};
