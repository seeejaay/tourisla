import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createTourPackage = async (packageData) => {
  try {
    console.log("API Creating Tour Package with data:", packageData);
    const response = await axios.post(`${API_URL}tour-packages`, packageData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Creating Tour Package: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const editTourPackage = async (packageId, packageData) => {
  try {
    console.log(
      "Editing Tour Package with ID:",
      packageId,
      "and data:",
      packageData
    );
    const response = await axios.put(
      `${API_URL}tour-packages/${packageId}`,
      packageData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Editing Tour Package: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTourPackage = async (packageId) => {
  try {
    console.log("Deleting Tour Package with ID:", packageId);
    const response = await axios.delete(
      `${API_URL}tour-packages/${packageId}`,
      {
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Deleting Tour Package: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchTourPackages = async () => {
  try {
    const response = await axios.get(`${API_URL}tour-packages`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    console.log("Fetched Tour Packages:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tour Packages: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchTourPackage = async (operatorId) => {
  try {
    console.log("API Fetching Tour Package with ID:", operatorId);
    const response = await axios.get(
      `${API_URL}tour-packages/pkg/${operatorId}`,
      {
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tour Package: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchAllTourPackages = async () => {
  try {
    const response = await axios.get(`${API_URL}tour-packages/all`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    console.log("Fetched All Tour Packages:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching All Tour Packages: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
