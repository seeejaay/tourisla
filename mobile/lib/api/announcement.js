import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// Update with your actual API URL

// ANNOUNCEMENTS
export const fetchAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}announcements`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Fetched announcements:", response.data);
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
    const response = await axios.get(
      `${API_URL}announcements/${announcementId}`,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Ensure the response includes date_posted
    return {
      ...response.data,
      date_posted: response.data.date_posted || null,
    };
  } catch (err) {
    console.error(
      `Error viewing announcement with ID ${announcementId}:`,
      err.response?.data || err.message
    );
    throw err;
  }
};

export const createAnnouncement = async (announcementData) => {
  console.log("Payload being sent to the backend:", announcementData);
  try {
    // Ensure all required fields are included in the request body
    const requiredFields = ["category", "description", "location", "title"];
    for (const field of requiredFields) {
      if (!announcementData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const response = await axios.post(
      `${API_URL}announcements`,
      announcementData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        `Failed to create announcement. Status: ${response.status}`
      );
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
    const response = await axios.put(
      `${API_URL}announcements/${announcementId}`,
      announcementData,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to update announcement. Status: ${response.status}`
      );
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
    const response = await axios.delete(
      `${API_URL}announcements/${announcementId}`,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to delete announcement. Status: ${response.status}`
      );
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
