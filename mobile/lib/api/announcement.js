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

export const createAnnouncement = async (data) => {
  try {
    const url = getApiUrl('announcements');
    logApiRequest('POST', url, data instanceof FormData ? 'FormData with image' : data);
    
    let response;
    
    if (data instanceof FormData) {
      // If FormData is provided (with image)
      response = await axios.post(url, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
    } else {
      // If regular JSON data is provided
      response = await axios.post(url, data, {
        withCredentials: true,
      });
    }

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

// Update announcement
export const updateAnnouncement = async (id, data) => {
  try {
    const url = getApiUrl(`announcements/${id}`);
    console.log("Update URL:", url);
    
    // Set timeout and retry logic
    const axiosConfig = {
      timeout: 30000, // 30 seconds timeout
      withCredentials: true,
    };
    
    if (data instanceof FormData) {
      console.log("Updating announcement with FormData");
      
      // Log FormData contents for debugging
      for (let pair of data.entries()) {
        console.log(`FormData field: ${pair[0]}, value: ${typeof pair[1] === 'object' ? 'File object' : pair[1]}`);
      }
      
      // Try using fetch API for FormData which can be more reliable
      const fetchResponse = await fetch(url, {
        method: 'PUT',
        body: data,
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        throw new Error(`HTTP Error! Status: ${fetchResponse.status}, Message: ${errorText}`);
      }
      
      const responseData = await fetchResponse.json();
      console.log("Update response:", responseData);
      return responseData;
    } else {
      // Regular JSON data
      console.log("Updating announcement with JSON data:", JSON.stringify(data));
      const response = await axios.put(url, data, axiosConfig);
      console.log("Update response:", response.data);
      return response.data;
    }
  } catch (error) {
    // Enhanced error logging
    console.error("Error Updating Announcement: ", error.message);
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
