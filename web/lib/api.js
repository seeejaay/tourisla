import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data; // Return the data from the API
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}/${endpoint}`, data);
    return response.data; // Return the response data
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    return null;
  }
};

export const updateData = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_URL}/${endpoint}`, data);
    return response.data; // Return the updated data
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    return null;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(`${API_URL}/${endpoint}`);
    return response.data; // Return the response data
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    return null;
  }
};
