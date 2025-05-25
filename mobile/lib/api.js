import axios from "axios";

const API_URL = "http://192.168.0.135:3005/api/v1/"; // Base URL for the API

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const login = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}login`, userData, {
        withCredentials: true, // Include cookies in the request
      });
  
      if (response.status !== 200) {
        throw new Error(
          `Failed to login. Server responded with status: ${response.status}`
        );
      }
  
      console.log("API Response"); // Log the API response
      return response.data; // Return response data
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      throw error; // Re-throw the error for handling in the calling code
    }
};

export const currentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}user`, {
        withCredentials: true, // Include cookies in the request
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.data; // Return the fetched user data
    } catch (err) {
      console.error(
        "Error fetching user data:",
        err.response?.data || err.message
      );
      throw err; // Re-throw the error for handling in the calling code
    }
};

export const getAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}announcements`);
    return response.data; // Expected: array of announcements
  } catch (err) {
    console.error("Error fetching announcements:", err.response?.data || err.message);
    return [];
  }
};


// Call logout endpoint
export const logoutUser = async () => {
  return axiosInstance.post('logout');
};