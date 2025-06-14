import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}announcements`, {
      withCredentials: true, // Include cookies in the request
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data; // Return the fetched user data
  } catch (err) {
    console.error(
      "Error fetching announcements:",
      err.response?.data || err.message
    );
    throw err; // Re-throw the error for handling in the calling code
  }
};

export const viewAnnouncement = async (announcementId) => {
  try {
    const response = await axios.get(
      `${API_URL}announcements/${announcementId}`,
      {
        withCredentials: true, // Include cookies in the request
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data; // Return the fetched user data
  } catch (err) {
    console.error(
      "Error fetching announcements:",
      err.response?.data || err.message
    );
    throw err; // Re-throw the error for handling in the calling code
  }
};

export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axios.post(
      `${API_URL}announcements`,
      announcementData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (response.status !== 200)
      throw new Error("Failed to create announcement");
    return response.data;
  } catch (error) {
    console.error(
      "Error adding announcement:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateAnnouncement = async (announcementId, announcementData) => {
  try {
    console.log("Sending id to API:", announcementId);
    console.log("Sending data", announcementData); // Log data being sent to the API
    const response = await axios.put(
      `${API_URL}announcements/${announcementId}`,
      announcementData,
      {
        withCredentials: true, // Include cookies in the request
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to update announcement. Server responded with status: ${response.status}`
      );
    }

    console.log("API Response:", response.data); // Log the API response
    return response.data; // Return response data
  } catch (error) {
    console.error(
      "Error updating announcement:",
      error.response?.data || error.message
    );
    throw error; // Re-throw the error for handling in the calling code
  }
};

export const deleteAnnouncement = async (announcementId) => {
  try {
    const response = await axios.delete(
      `${API_URL}announcements/${announcementId}`,
      {
        withCredentials: true, // Include cookies in the request
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data; // Return the fetched user data
  } catch (err) {
    console.error(
      "Error deleting announcements:",
      err.response?.data || err.message
    );
    throw err; // Re-throw the error for handling in the calling code
  }
};
