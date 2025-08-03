import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const completeBooking = async (bookingId) => {
  try {
    console.log("API Completing Booking with ID:", bookingId);
    const response = await axios.patch(
      `${API_URL}bookings/guide/${bookingId}/finish`,
      {},
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
      "Error Completing Booking: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBookingsByGuide = async (guideId) => {
  try {
    console.log("API Fetching Bookings for Guide ID:", guideId);
    const response = await axios.get(`${API_URL}bookings/guide`, {
      params: { guideId },
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Bookings by Guide: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    console.log("API Creating Booking with data:", bookingData);
    const response = await axios.post(`${API_URL}bookings`, bookingData, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Creating Booking: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateBookingStatus = async (bookingId, status) => {
  try {
    console.log("API Updating Booking Status for ID:", bookingId, "to", status);
    const response = await axios.put(
      `${API_URL}bookings/${bookingId}/status`,
      { status },
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
      "Error Updating Booking Status: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBookingsByTourist = async (touristId) => {
  try {
    console.log("API Fetching Bookings for Tourist ID:", touristId);
    const response = await axios.get(`${API_URL}bookings/tourist`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Bookings by Tourist: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBookingsByPackage = async (packageId) => {
  try {
    console.log("API Fetching Bookings for Package ID:", packageId);
    const response = await axios.get(
      `${API_URL}bookings/package/${packageId}`,
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
      "Error Fetching Bookings by Package: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBookingById = async (bookingId) => {
  try {
    console.log("API Fetching Booking by ID:", bookingId);
    const response = await axios.get(`${API_URL}bookings/${bookingId}`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Booking by ID: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFilteredBookingsByTourist = async (touristId, filter) => {
  try {
    console.log(
      "API Fetching Filtered Bookings for Tourist ID:",
      touristId,
      "with filter:",
      filter
    );
    const response = await axios.get(
      `${API_URL}bookings/tourist/${touristId}/filter`,
      {
        params: { filter },
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Filtered Bookings by Tourist: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    console.log("API Cancelling Booking with ID:", bookingId);
    const response = await axios.put(`${API_URL}bookings/${bookingId}/cancel`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Cancelling Booking: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBookingsByOperator = async (operatorId) => {
  try {
    console.log("API Fetching Bookings for Operator ID:", operatorId);
    const response = await axios.get(
      `${API_URL}bookings/operator/${operatorId}`,
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
      "Error Fetching Bookings by Operator: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getTotalEarnings = async () => {
  try {
    console.log("Fetching Total Earnings");
    const response = await axios.get(`${API_URL}earnings/total`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Total Earnings: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getEarningsByPackage = async () => {
  try {
    console.log("Fetching Earnings by Package");
    const response = await axios.get(`${API_URL}earnings/by-package`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Earnings by Package: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getMonthlyEarnings = async () => {
  try {
    console.log("Fetching Monthly Earnings");
    const response = await axios.get(`${API_URL}earnings/by-monthly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Monthly Earnings: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
