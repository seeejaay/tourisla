import axios from 'axios';
import { logApiRequest } from '../utils/logging';

// Get the raw base URL from environment
const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005';

// Function to ensure proper URL formatting
const constructApiUrl = (baseUrl) => {
  // Remove trailing slashes
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Check if the URL already includes the API path
  if (cleanBaseUrl.includes('/api/v1')) {
    // Make sure it ends with a slash
    return cleanBaseUrl.endsWith('/') ? cleanBaseUrl : `${cleanBaseUrl}/`;
  }
  
  // Add the API path with trailing slash
  return `${cleanBaseUrl}/api/v1/`;
};

// Construct the API URL
const API_URL = constructApiUrl(rawBaseUrl);

// Log the API URL for debugging
console.log('API URL configured as:', API_URL);

/**
 * Fetch all terms/policies
 * @returns {Promise<Array>} Array of terms
 */
export const fetchTerms = async () => {
  try {
    const url = `${API_URL}policies`;
    
    // Debug the constructed URL
    console.log('Fetching terms from URL:', url);
    
    logApiRequest('GET', url);
    
    const response = await axios.get(url, {
      withCredentials: true,
      timeout: 10000
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching terms:', error.message || error);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

/**
 * Fetch a term/policy by ID
 * @param {string} id - The term ID
 * @returns {Promise<Object>} The term
 */
export const fetchTermById = async (id) => {
  try {
    const url = `${API_URL}policies/${id}`;
    logApiRequest('GET', url);
    
    const response = await axios.get(url, {
      withCredentials: true,
      timeout: 10000
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching term by ID:', error.message || error);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

/**
 * Create a new term/policy
 * @param {Object} termData - The term data
 * @returns {Promise<Object>} The created term
 */
export const createTerm = async (termData) => {
  try {
    const url = `${API_URL}policies`;
    logApiRequest('POST', url);
    
    const response = await axios.post(url, termData, {
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating term:', error.response?.data || error.message);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

/**
 * Update an existing term/policy
 * @param {string} id - The term ID
 * @param {Object} termData - The updated term data
 * @returns {Promise<Object>} The updated term
 */
export const updateTerm = async (id, termData) => {
  try {
    const url = `${API_URL}policies/${id}`;
    logApiRequest('PUT', url);
    
    const response = await axios.put(url, termData, {
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating term:', error.response?.data || error.message);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

/**
 * Delete a term/policy
 * @param {string} id - The term ID
 * @returns {Promise<Object>} The response data
 */
export const deleteTerm = async (id) => {
  try {
    const url = `${API_URL}policies/${id}`;
    logApiRequest('DELETE', url);
    
    const response = await axios.delete(url, {
      withCredentials: true,
      timeout: 10000
    });
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting term:', error.response?.data || error.message);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

// Aliases for backward compatibility
export const getAllTerms = fetchTerms;
export const getTermById = fetchTermById;





