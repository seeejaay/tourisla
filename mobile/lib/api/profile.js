import axios from "axios";
import { getApiUrl, logApiRequest } from "./utils";

export const fetchUserProfile = async () => {
  try {
    const url = getApiUrl('auth/profile');
    logApiRequest('GET', url);
    
    const response = await axios.get(url, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching User Profile: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const url = getApiUrl('auth/profile');
    logApiRequest('PUT', url, profileData);
    
    const response = await axios.put(url, profileData, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Updating User Profile: ",
      error.response?.data || error.message
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