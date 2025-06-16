import axios from "axios";
import { API_URL } from '../config'; // Import API_URL from config
import { getApiUrl } from './apiUtils';

export const fetchUsers = async () => {
  try {
    // Ensure the URL has the correct format with a trailing slash
    const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
    const response = await axios.get(`${baseUrl}users`, {
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (err) {
    console.error("Error fetching users:", err.response?.data || err.message);
    throw err;
  }
};

export const createUser = async (userData) => {
  try {
    console.log("Sending user data to API:", userData);
    const url = getApiUrl('users'); // Use getApiUrl helper
    const response = await axios.post(url, userData, {
      withCredentials: true,
    });
    if (response.status !== 201) {
      throw new Error(
        `Failed to create user. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error;
  }
};

export const viewOneUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}users/${userId}`, {
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Fetched user data");
    return response.data.data.user;
  } catch (err) {
    console.error(
      "Error fetching user data:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const editUser = async (userData) => {
  try {
    console.log("Payload sent to API:", userData); // Debug log
    
    if (!userData.user_id) {
      throw new Error("User ID is required for updating a user");
    }
    
    const url = getApiUrl(`users/${userData.user_id}`);
    console.log("API URL:", url);
    
    const response = await axios.put(url, userData, {
      withCredentials: true,
    });
    
    console.log("API response:", response.data); // Debug log
    
    if (response.status !== 200) {
      throw new Error(
        `Failed to edit user. Server responded with status: ${response.status}`
      );
    }
    
    return response.data;
  } catch (error) {
    console.error("Error editing user:", error.response?.data || error.message); // Debug log
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.patch(
      `${API_URL}users/${userId}`,
      { userId },
      {
        withCredentials: true,
      }
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to delete user. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
    throw error;
  }
};
