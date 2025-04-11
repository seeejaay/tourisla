import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data; // Return the data from the API
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
};

export const addUser = async (userData) => {
  try {
    console.log("Sending user data to API:", userData); // Log data being sent to the API
    const response = await axios.post(`${API_URL}/signup`, userData);
    console.log("API Response:", response.data); // Log the API response
    return response.data; // Return response data
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};
