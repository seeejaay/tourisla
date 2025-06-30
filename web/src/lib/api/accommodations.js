import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAccommodation = async (accommodation) => {
  try {
    const response = await axios.post(
      `${API_URL}accommodations`,
      accommodation,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating accommodation:", error);
    throw error;
  }
};

export const editAccommodation = async (accommodationId, accommodationData) => {
  try {
    const response = await axios.put(
      `${API_URL}accommodations/${accommodationId}`,
      accommodationData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing accommodation:", error);
    throw error;
  }
};

export const deleteAccommodation = async (accommodationId) => {
  try {
    const response = await axios.delete(
      `${API_URL}accommodations/${accommodationId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    throw error;
  }
};

export const getAccommodations = async () => {
  try {
    const response = await axios.get(`${API_URL}accommodations`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw error;
  }
};

export const getAccommodationById = async (accommodationId) => {
  try {
    const response = await axios.get(
      `${API_URL}accommodations/${accommodationId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching accommodation by ID:", error);
    throw error;
  }
};

export const getTourismStaff = async () => {
  try {
    console.log("Fetching tourism staff...");
    const response = await axios.get(`${API_URL}accommodations/tourism-staff`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tourism staff:", error);
    throw error;
  }
};

export const assignAccommodationToStaff = async (staffId, accommodationId) => {
  try {
    const response = await axios.put(
      `${API_URL}accommodations/${accommodationId}/assign-staff`,
      { staffId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning accommodation to staff:", error);
    throw error;
  }
};
