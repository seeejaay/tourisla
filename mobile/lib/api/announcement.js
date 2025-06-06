import axios from "axios";
import { getApiUrl, logApiRequest } from "./utils";

export const fetchAnnouncements = async () => {
  try {
    const url = getApiUrl('announcements');
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
      "Error Fetching Announcements: ",
      error.response?.data || error.message
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
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Announcement: ",
      error.response?.data || error.message
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
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
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

export const updateAnnouncement = async (announcementId, announcementData) => {
  try {
    const url = getApiUrl(`announcements/${announcementId}`);
    logApiRequest('PUT', url, announcementData);
    
    const response = await axios.put(url, announcementData, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
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
    });

    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Deleting Announcement: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
