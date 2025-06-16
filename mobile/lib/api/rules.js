import axios from 'axios';
import { logApiRequest } from './utils';

/**
 * Fetches all rules from the API
 * @returns {Promise<Array>} Array of rules
 */
export const fetchRules = async () => {
  try {
    // Get the raw base URL from environment
    const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005';
    console.log('Raw base URL:', rawBaseUrl);
    
    // Remove any trailing slashes
    const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
    console.log('Cleaned base URL:', baseUrl);
    
    // Check if the base URL already includes /api/v1
    const hasApiPrefix = baseUrl.includes('/api/v1');
    console.log('Base URL already includes /api/v1:', hasApiPrefix);
    
    // Construct the URL correctly
    const url = hasApiPrefix ? `${baseUrl}/rules` : `${baseUrl}/api/v1/rules`;
    console.log('Final URL:', url);
    
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
    console.error('Error fetching rules:', error.message || error);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

// Alias for fetchRules to maintain compatibility
export const getAllRules = fetchRules;

/**
 * Fetches a single rule by ID
 * @param {string} id - The rule ID
 * @returns {Promise<Object>} The rule object
 */
export const fetchRuleById = async (id) => {
  try {
    // Get the raw base URL from environment
    const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005';
    
    // Remove any trailing slashes
    const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
    
    // Check if the base URL already includes /api/v1
    const hasApiPrefix = baseUrl.includes('/api/v1');
    
    // Construct the URL correctly
    const url = hasApiPrefix ? `${baseUrl}/rules/${id}` : `${baseUrl}/api/v1/rules/${id}`;
    console.log('Fetching rule by ID from URL:', url);
    
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
    console.error('Error fetching rule by ID:', error.message || error);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

// Alias for fetchRuleById to maintain compatibility
export const getRuleById = fetchRuleById;

/**
 * Creates a new rule
 * @param {Object} ruleData - The rule data
 * @returns {Promise<Object>} The created rule
 */
export const createRule = async (ruleData) => {
  try {
    // Get the raw base URL from environment
    const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005';
    
    // Remove any trailing slashes
    const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
    
    // Check if the base URL already includes /api/v1
    const hasApiPrefix = baseUrl.includes('/api/v1');
    
    // Construct the URL correctly
    const url = hasApiPrefix ? `${baseUrl}/rules` : `${baseUrl}/api/v1/rules`;
    console.log('Creating rule with URL:', url);
    
    logApiRequest('POST', url, ruleData);
    
    const response = await axios.post(url, ruleData, {
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
    console.error('Error creating rule:', error.response?.data || error.message);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

/**
 * Updates an existing rule
 * @param {string} id - The rule ID
 * @param {Object} ruleData - The updated rule data
 * @returns {Promise<Object>} The updated rule
 */
export const updateRule = async (id, ruleData) => {
  try {
    // Get the raw base URL from environment
    const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005';
    
    // Remove any trailing slashes
    const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
    
    // Check if the base URL already includes /api/v1
    const hasApiPrefix = baseUrl.includes('/api/v1');
    
    // Construct the URL correctly
    const url = hasApiPrefix ? `${baseUrl}/rules/${id}` : `${baseUrl}/api/v1/rules/${id}`;
    console.log('Updating rule with URL:', url);
    
    logApiRequest('PUT', url, ruleData);
    
    const response = await axios.put(url, ruleData, {
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
    console.error('Error updating rule:', error.response?.data || error.message);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};

/**
 * Deletes a rule
 * @param {string} id - The rule ID
 * @returns {Promise<boolean>} True if successful
 */
export const deleteRule = async (id) => {
  try {
    // Get the raw base URL from environment
    const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005';
    
    // Remove any trailing slashes
    const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
    
    // Check if the base URL already includes /api/v1
    const hasApiPrefix = baseUrl.includes('/api/v1');
    
    // Construct the URL correctly
    const url = hasApiPrefix ? `${baseUrl}/rules/${id}` : `${baseUrl}/api/v1/rules/${id}`;
    console.log('Deleting rule with URL:', url);
    
    logApiRequest('DELETE', url);
    
    const response = await axios.delete(url, {
      withCredentials: true,
      timeout: 10000
    });
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting rule:', error.response?.data || error.message);
    if (error.config) {
      console.error('URL attempted:', error.config.url);
    }
    throw error;
  }
};















