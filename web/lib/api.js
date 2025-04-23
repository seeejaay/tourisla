import axios from "axios";

const API_URL = "http://localhost:3005/api/v1/users";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data; // Return the fetched user data
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err; // Re-throw the error for handling in the calling code
  }
};

export const addUser = async (userData) => {
  try {
    console.log("Sending user data to API:", userData); // Log data being sent to the API
    const response = await axios.post(`${API_URL}`, userData);
    console.log("API Response:", response.data); // Log the API response
    return response.data; // Return response data
  } catch (error) {
    console.error("Error adding user:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};
