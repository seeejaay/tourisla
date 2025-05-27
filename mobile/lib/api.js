import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}login`, userData, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to login. Server responded with status: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error during login full response:", error.response);
    console.error(
      "Error during login message/data:",
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

export const logoutUser = async () => {
  return axiosInstance.post("logout");
};
