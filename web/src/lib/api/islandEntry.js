import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createIslandEntryRegistration = async (data) => {
  const res = await axios.post(`${API_URL}island-entry/register`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const getTourismFee = async () => {
  const res = await axios.get(`${API_URL}prices/active`);
  return res.data;
};

export const getLatestIslandEntry = async () => {
  const res = await axios.get(`${API_URL}island-entry/latest`, {
    withCredentials: true,
  });
  return res.data;
};

export const registerIslandWalkIn = async (data) => {
  return axios.post(`${API_URL}island-entry/walk-in`, data, {
    withCredentials: true,
  });
};

export const getIslandEntryMembers = async (input) => {
  const query = new URLSearchParams(input).toString();
  return axios.get(`${API_URL}island-entry/members?${query}`, {
    withCredentials: true,
  });
};

export const manualIslandEntryCheckIn = async (unique_code) => {
  return axios.post(
    `${API_URL}island-entry/manual-check-in`,
    { unique_code },
    { withCredentials: true }
  );
};

export const markIslandEntryPaid = async (unique_code) => {
  return axios.post(
    `${API_URL}island-entry/mark-paid`,
    { unique_code },
    { withCredentials: true }
  );
};

export const createOnlineIslandEntry = async (data) => {
  const res = await axios.post(`${API_URL}island-entry/register`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const getIslandEntryStatus = async (uniqueCode) => {
  const res = await axios.get(`${API_URL}island-entry/status/${uniqueCode}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getAllIslandEntries = async () => {
  const res = await axios.get(`${API_URL}island-entry`, {
    withCredentials: true,
  });
  return res.data;
};

export const exportIslandEntryLog = async (filter) => {
  try {
    const query = new URLSearchParams(filter).toString();
    const res = await axios.get(`${API_URL}island-entry/export?${query}`, {
      withCredentials: true,
      responseType: "blob", // Important for downloading files!
    });
    return res.data;
  } catch (error) {
    console.error("Error exporting island entry log:", error);
    throw error;
  }
};
