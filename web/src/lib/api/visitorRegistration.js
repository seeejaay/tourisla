import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getVisitorGroupMembers = async (input) => {
  try {
    const query = new URLSearchParams(input).toString();
    const response = await axios.get(`${API_URL}register/members?${query}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Visitor Group Members: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const registerVisitor = async (visitors) => {
  try {
    console.log("API Registering Visitors: ", visitors);
    // Wrap visitors in an object with groupMembers property
    const response = await axios.post(
      `${API_URL}register`,
      { groupMembers: visitors }, // <-- FIXED HERE
      { withCredentials: true }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Registering Visitor: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const manualCheckIn = async (unique_code) => {
  try {
    const response = await axios.post(
      `${API_URL}register/manual-check-in`,
      { unique_code },
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
      "Error Checking In Visitor: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const walkInVisitor = async (groupMembers) => {
  try {
    const response = await axios.post(
      `${API_URL}register/walk-in`,
      { groupMembers }, // send groupMembers in the body
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Processing Walk-In Visitor: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getVisitorResult = async (input) => {
  try {
    const query = new URLSearchParams(input).toString();
    const response = await axios.get(`${API_URL}register/result?${query}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Visitor Result: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getQRCodebyUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}register/qr/${userId}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching QR Code by User ID: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
