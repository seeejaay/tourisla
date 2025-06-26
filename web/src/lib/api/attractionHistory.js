import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAttractionHistory = async () => {
  const res = await axios.get(`${API_URL}visitor/history`, { withCredentials: true });
  return res.data.history;
};