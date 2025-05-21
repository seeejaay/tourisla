import axios from "axios";
const API_URL = "http://192.168.0.130:3005/api/v1/";

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
