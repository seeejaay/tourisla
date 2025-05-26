import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchHotlines = async () => {
  try {
    const response = await axios.get(`${API_URL}hotlines`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Hotlines: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const viewHotlines = async (hotlineId) => {
  try {
    const response = await axios.get(`${API_URL}hotlines/${hotlineId}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Hotlines: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createHotline = async (hotlineData) => {
  try {
    const response = await axios.post(`${API_URL}hotlines`, hotlineData, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Hotlines: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateHotline = async (hotlineId, hotlineData) => {
  try {
    const response = await axios.put(
      `${API_URL}hotlines/${hotlineId}`,
      hotlineData,
      { withCredentials: true }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Hotlines: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteHotline = async (hotlineId) => {
  try {
    const response = await axios.delete(`${API_URL}hotlines/${hotlineId}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Hotlines: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
