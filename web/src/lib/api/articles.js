import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  let config = {
    withCredentials: true,
  };

  // If data is FormData (for file upload), let browser set headers
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    // Do not set Content-Type, axios will handle it
  } else {
    // For JSON, set Content-Type
    config.headers = { "Content-Type": "application/json" };
  }

  const res = await axios.put(`${API_URL}articles/${articleId}`, data, config);
  return res.data;
};

export const deleteArticle = async (articleId) => {
  const res = await axios.delete(`${API_URL}articles/${articleId}`, {
    withCredentials: true,
  });
  return res.data;
};
