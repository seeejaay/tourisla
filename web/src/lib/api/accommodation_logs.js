import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAccommodationLog = async (data) => {
  try {
    const response = await axios.post(`${API_URL}accommodation-logs`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating accommodation log:", error);
    throw error;
  }
};
export const updateAccommodationLog = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/accommodation-logs/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating accommodation log:", error);
    throw error;
  }
};
export const deleteAccommodationLog = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}accommodation-logs/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting accommodation log:", error);
    throw error;
  }
};

export const getAccommodationLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}accommodation-logs`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching accommodation logs:", error);
    throw error;
  }
};
export const getAccommodationLog = async (id) => {
  try {
    const response = await axios.get(`${API_URL}accommodation-logs/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching accommodation log:", error);
    throw error;
  }
};

export const exportAccommodationLogs = async (params) => {
  try {
    const response = await axios.get(
      `${API_URL}accommodation-logs/export`,
      {
        params,
        responseType: "blob", // Important for file download
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error exporting accommodation logs:", error);
    throw error;
  }
};
export const getAccommodationLogByAccommodationId = async (accomodation_id) => {
  try {
    const response = await axios.get(
      `${API_URL}accommodations/logs/${accomodation_id}`,
      {
        withCredentials: true,
      }
    );
    console.log("Response from getAccommodationLogByAccommodationId:");
    return response.data;
  } catch (error) {
    console.error("Error fetching accommodation log by ID:", error);
    throw error;
  }
};
