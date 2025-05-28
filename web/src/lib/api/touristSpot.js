import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchTouristSpots = async () => {
  try {
    const response = await axios.get(`${API_URL}tourist-spots`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tourist Spots: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const viewTouristSpots = async (touristSpotId) => {
  try {
    const response = await axios.get(
      `${API_URL}tourist-spots/${touristSpotId}`,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tourist Spot: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createTouristSpot = async (touristSpotData) => {
  try {
    const response = await axios.post(
      `${API_URL}tourist-spits`,
      touristSpotData,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Creating Tourist Spot: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTouristSpot = async (touristSpotId, touristSpotData) => {
  try {
    const response = await axios.put(
      `${API_URL}tourist-spots/${touristSpotId}`,
      touristSpotData,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Updating Tourist Spot: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTouristSpot = async (touristSpotId) => {
  try {
    const response = await axios.delete(
      `${API_URL}tourist-spots/${touristSpotId}`,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Deleting Tourist Spot: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
