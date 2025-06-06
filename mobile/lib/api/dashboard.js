import axios from "axios";
import { getApiUrl, logApiRequest } from "./utils";

export const fetchDashboardData = async () => {
  try {
    const url = getApiUrl('dashboard');
    logApiRequest('GET', url);
    
    const response = await axios.get(url, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Dashboard Data: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchRecentAnnouncements = async (limit = 5) => {
  try {
    const url = getApiUrl(`announcements?limit=${limit}`);
    logApiRequest('GET', url);
    
    const response = await axios.get(url, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Recent Announcements: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchPopularTouristSpots = async (limit = 5) => {
  try {
    const url = getApiUrl(`tourist-spots?limit=${limit}&sort=popular`);
    logApiRequest('GET', url);
    
    const response = await axios.get(url, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Popular Tourist Spots: ",
      error.response?.data || error.message
    );
    throw error;
  }
};