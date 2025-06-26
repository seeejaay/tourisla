import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllPrices = async () => {
  const res = await axios.get(`${API_URL}prices`, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchActivePrice = async () => {
  const res = await axios.get(`${API_URL}prices/active`, {
    withCredentials: true,
  });
  return res.data;
};

export const createPrice = async (data) => {
  const res = await axios.post(`${API_URL}prices`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const togglePriceStatus = async (id, is_enabled) => {
  const res = await axios.patch(`${API_URL}prices/${id}/toggle`, { is_enabled }, {
    withCredentials: true,
  });
  return res.data;
};

export const updatePriceDetails = async (id, amount, type) => {
  const res = await axios.patch(`${API_URL}prices/${id}/update`, {
    amount,
    type,
  }, { withCredentials: true });

  return res.data;
};

