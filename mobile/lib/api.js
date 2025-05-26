import axios from "axios";

const API_URL = "http://192.168.0.135:3005/api/v1/"; // Base URL for the API

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
      throw new Error(`Failed to login. Server responded with status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error during login full response:", error.response);
    console.error("Error during login message/data:", error.response?.data || error.message);
    throw error;
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

// Call logout endpoint
export const logoutUser = async () => {
  return axiosInstance.post('logout');
};



// ANNOUNCEMENTS
export const fetchAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}announcements`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (err) {
    console.error(
      "Error fetching announcements:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const viewAnnouncement = async (announcementId) => {
  try {
    const response = await axios.get(`${API_URL}announcements/${announcementId}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (err) {
    console.error(
      `Error viewing announcement with ID ${announcementId}:`,
      err.response?.data || err.message
    );
    throw err;
  }
};

export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axios.post(`${API_URL}announcements`, announcementData, {
      withCredentials: true,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Failed to create announcement. Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error creating announcement:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateAnnouncement = async (announcementId, announcementData) => {
  try {
    const response = await axios.put(`${API_URL}announcements/${announcementId}`, announcementData, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to update announcement. Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      `Error updating announcement with ID ${announcementId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteAnnouncement = async (announcementId) => {
  try {
    const response = await axios.delete(`${API_URL}announcements/${announcementId}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to delete announcement. Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      `Error deleting announcement with ID ${announcementId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};