import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchAttractionHistory = async () => {
  const res = await axios.get(`${API_URL}visitor/history`, { withCredentials: true });
  return res.data.history;
};

export const fetchTouristSpots = async () => {
  const res = await axios.get(`${API_URL}tourist-spots`);
  return res.data.map((spot) => ({
    id: spot.id,
    name: spot.name,
  }));
};