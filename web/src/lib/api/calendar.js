import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authorizeGoogleCalendar = async () => {
  try {
    const response = await axios.get(`${API_URL}calendar/authorize`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error authorizing Google Calendar:", error);
    throw error;
  }
};
