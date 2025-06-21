import axios from "axios";

// Get the API URL from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005';

// Helper function to ensure proper URL formatting
const getApiUrl = (endpoint) => {
  // Remove trailing slash from base URL if present
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  // Add /api/v1/ prefix if not already included
  const apiPrefix = baseUrl.includes('/api/v1') ? '' : '/api/v1';
  return `${baseUrl}${apiPrefix}/${endpoint}`;
};

// Helper function to log API requests
const logApiRequest = (method, url, data = null) => {
  console.log(`API Request: ${method} ${url}`);
  if (data) {
    console.log('Request data:', JSON.stringify(data).substring(0, 200) + '...');
  }
};

export const fetchAnnouncements = async () => {
  try {
    const url = getApiUrl('announcements');
    logApiRequest('GET', url);
    
    console.log('Fetching announcements from:', url);
    
    const response = await axios.get(url, {
      withCredentials: true,
      timeout: 10000
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    console.log(`Received ${response.data.length} announcements`);
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Announcements: ",
      error.message || error
    );
    throw error;
  }
};

export const viewAnnouncement = async (announcementId) => {
  try {
    const url = getApiUrl(`announcements/${announcementId}`);
    logApiRequest('GET', url);
    
    const response = await axios.get(url, {
      withCredentials: true,
      timeout: 10000
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Announcement: ",
      error.message || error
    );
    throw error;
  }
};

export const createAnnouncement = async (announcementData) => {
  try {
    const url = getApiUrl('announcements');
    logApiRequest('POST', url, announcementData);
    
    const response = await axios.post(url, announcementData, {
      withCredentials: true,
      timeout: 30000,
      headers: { 
        "Content-Type": "multipart/form-data" 
      }
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Failed to create announcement. Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Creating Announcement: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateAnnouncement = async (id, data) => {
  try {
    const url = getApiUrl(`announcements/${id}`);
    logApiRequest('PUT', url, data);
    
    console.log("Update URL:", url);
    
    // Set timeout and retry logic
    const axiosConfig = {
      timeout: 30000, // 30 seconds timeout
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    
    const response = await axios.put(url, data, axiosConfig);
    
    if (response.status !== 200) {
      throw new Error(`Failed to update announcement. Status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(
      "Error Updating Announcement: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteAnnouncement = async (announcementId) => {
  try {
    const url = getApiUrl(`announcements/${announcementId}`);
    logApiRequest('DELETE', url);
    
    const response = await axios.delete(url, {
      withCredentials: true,
      timeout: 10000
    });

    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Deleting Announcement: ",
      error.message || error
    );
    throw error;
  }
};
