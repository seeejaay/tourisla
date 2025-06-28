import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchArticles = async () => {
  const res = await axios.get(`${API_URL}articles`, { withCredentials: true });
  return res.data;
};

export const viewArticle = async (articleId) => {
  const res = await axios.get(`${API_URL}articles/${articleId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const createArticle = async (data) => {
  const res = await axios.post(`${API_URL}articles`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const updateArticle = async (articleId, data) => {
  const res = await axios.put(`${API_URL}articles/${articleId}`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteArticle = async (articleId) => {
  const res = await axios.delete(`${API_URL}articles/${articleId}`, {
    withCredentials: true,
  });
  return res.data;
};
