import axios from 'axios';

// Get the API URL from environment variables
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://tourisla-api.onrender.com/api/';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Log API requests for debugging
export const logApiRequest = (method, url, data = null) => {
  console.log(`API ${method} Request:`, url);
  if (data) {
    console.log('Request Data:', JSON.stringify(data).substring(0, 200) + '...');
  }
};

// Get API URL with proper formatting
export const getApiUrl = (endpoint) => {
  const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  return `${baseUrl}${endpoint}`;
};

// Check API health
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}health`, { timeout: 5000 });
    return {
      status: 'online',
      message: response.data?.message || 'API is online',
      version: response.data?.version
    };
  } catch (error) {
    return {
      status: 'offline',
      message: 'API is currently unavailable',
      error: error.message
    };
  }
};

