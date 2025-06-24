import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createIslandEntryRegistration = async (data) => {
  const res = await axios.post(
    `${API_URL}island-entry/register`, 
    data,
    { withCredentials: true });
  return res.data;
};

export const getTourismFee = async () => {
  const res = await axios.get(`${API_URL}prices/active`);
  return res.data;
};

export const getLatestIslandEntry = async () => {
  const res = await axios.get(
  `${API_URL}island-entry/latest`, 
  { withCredentials: true });
  return res.data;
};