import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createRule = async (ruleData) => {
  try {
    const response = await axios.post(`${API_URL}rules`, ruleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating rule:", error);
    throw error;
  }
};
export const editRule = async (ruleId, ruleData) => {
  try {
    const response = await axios.put(`${API_URL}rules/${ruleId}`, ruleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing rule:", error);
    throw error;
  }
};

export const deleteRule = async (ruleId) => {
  try {
    const response = await axios.delete(`${API_URL}rules/${ruleId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting rule:", error);
    throw error;
  }
};

export const fetchRules = async () => {
  try {
    const response = await axios.get(`${API_URL}rules`, {
      withCredentials: true, // Include cookies in the request
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
};
export const fetchRuleById = async (ruleId) => {
  try {
    const response = await axios.get(`${API_URL}rules/${ruleId}`, {
      withCredentials: true, // Include cookies in the request
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching rule by ID:", error);
    throw error;
  }
};
