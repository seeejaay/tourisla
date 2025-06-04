import axios from "axios";

/*
  REMOVE CONSOLE LOGS IN PRODUCTION
  CONSOLE LOGS ARE FOR DEBUGGING PURPOSES ONLY
  REMOVE THEM BEFORE DEPLOYING YOUR APPLICATION
*/

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    console.log("Logout Successful"); // Log the API response

    return response.data; // Return response data
  } catch (error) {
    console.error(
      "Error during logout:",
      error.response?.data || error.message
    );
    throw error; // Re-throw the error for handling in the calling code
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}forgot-password`, { email });
    if (response.status !== 200) {
      throw new Error(
        `Failed to send reset link. Server responded with status: ${response.status}`
      );
    }
    console.log("Forgot password email sent successfully"); // Log the API response
    return response.data;
  } catch (error) {
    console.error(
      "Error sending forgot password email:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}reset-password`, {
      token,
      password,
    });
    if (response.status !== 200) {
      throw new Error(
        `Failed to reset password. Server responded with status: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.log(
      "Error resetting password:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const currentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}user`, {
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (err) {
    console.error(
      "Error fetching user data:",
      err.response?.data || err.message
    );
    throw err;
  }
};
