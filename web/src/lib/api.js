import axios from "axios";

/*
  REMOVE CONSOLE LOGS IN PRODUCTION
  CONSOLE LOGS ARE FOR DEBUGGING PURPOSES ONLY
  REMOVE THEM BEFORE DEPLOYING YOUR APPLICATION
*/

const API_URL = "http://localhost:3005/api/v1/";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}users`, {
      withCredentials: true, // Include cookies in the request
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data; // Return the fetched user data
  } catch (err) {
    console.error("Error fetching users:", err.response?.data || err.message);
    throw err; // Re-throw the error for handling in the calling code
  }
};

export const createUser = async (userData) => {
  try {
    console.log("Sending user data to API:", userData); // Log data being sent to the API
    const response = await axios.post(`${API_URL}users`, userData, {
      withCredentials: true, // Include cookies in the request
    });

    if (response.status !== 201) {
      throw new Error(
        `Failed to create user. Server responded with status: ${response.status}`
      );
    }

    console.log("API Response:", response.data); // Log the API response
    return response.data; // Return response data
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
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

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}logout`, null, {
      withCredentials: true, // Include cookies in the request
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to logout. Server responded with status: ${response.status}`
      );
    }

    console.log("API Response", response); // Log the API response

    return response.data; // Return response data
  } catch (error) {
    console.error(
      "Error during logout:",
      error.response?.data || error.message
    );
    throw error; // Re-throw the error for handling in the calling code
  }
};
