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
    console.log("Login Successful:", response.data); // Log the API response
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

export const currentUser = async (sessionCookie) => {
  const response = await fetch(`${API_URL}user`, {
    headers: {
      Cookie: `connect.sid=${sessionCookie}`,
    },
    credentials: "include",
  });
  return response.json();
};

export const verifyUser = async (token) => {
  try {
    const response = await axios.put(`${API_URL}verify/${token}`, null, {
      withCredentials: true, // Include cookies in the request
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to verify user. Server responded with status: ${response.status}`
      );
    }
    console.log("User verified successfully:", response.data); // Log the API response
    return response.data; // Return response data
  } catch (error) {
    console.error(
      "Error during user verification:",
      error.response?.data || error.message
    );
    throw error; // Re-throw the error for handling in the calling code
  }
};
