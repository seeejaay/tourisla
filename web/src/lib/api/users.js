import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}users`, {
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
    const response = await axios.post(`${API_URL}users`, userData, {
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
    const response = await axios.put(
      `${API_URL}users/${userData.user_id}`,
      userData,
      {
        withCredentials: true,
      }
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to edit user. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error editing user:", error.response?.data || error.message);
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

export const editUserStatus = async (userId, status, role) => {
  try {
    const response = await axios.patch(
      `${API_URL}users/status`,
      { userId, status, role },
      {
        withCredentials: true,
      }
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to update user status. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user status:",
      error.response?.data || error.message
    );
    throw error;
  }
};
