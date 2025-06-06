import axios from 'axios';
import { getApiUrl } from './utils';

/**
 * Tests an API endpoint and returns detailed information about the request and response
 * @param {string} endpoint - The API endpoint to test
 * @param {string} method - The HTTP method to use (GET, POST, etc.)
 * @param {object} data - Optional data to send with the request
 * @returns {object} Detailed information about the request and response
 */
export const testApiEndpoint = async (endpoint, method = 'GET', data = null) => {
  const url = getApiUrl(endpoint);
  const startTime = Date.now();
  
  try {
    const config = {
      method,
      url,
      withCredentials: true,
      timeout: 10000,
      validateStatus: () => true, // Don't throw on any status code
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.data = data;
    }
    
    const response = await axios(config);
    const endTime = Date.now();
    
    return {
      success: response.status >= 200 && response.status < 300,
      request: {
        url,
        method,
        data: data || 'No data sent',
        headers: response.config.headers,
      },
      response: {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      },
      timing: {
        duration: endTime - startTime,
        started: new Date(startTime).toISOString(),
        completed: new Date(endTime).toISOString(),
      },
    };
  } catch (error) {
    const endTime = Date.now();
    
    return {
      success: false,
      request: {
        url,
        method,
        data: data || 'No data sent',
      },
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code,
      },
      timing: {
        duration: endTime - startTime,
        started: new Date(startTime).toISOString(),
        completed: new Date(endTime).toISOString(),
      },
    };
  }
};

/**
 * Tests multiple API endpoints and returns detailed information about each
 * @param {Array<{endpoint: string, method: string, data: object}>} endpoints - Array of endpoints to test
 * @returns {Array<object>} Array of test results
 */
export const testMultipleEndpoints = async (endpoints) => {
  const results = [];
  
  for (const { endpoint, method = 'GET', data = null } of endpoints) {
    const result = await testApiEndpoint(endpoint, method, data);
    results.push({
      endpoint,
      ...result,
    });
  }
  
  return results;
};

/**
 * Tests basic connectivity to the API server
 * @returns {object} Information about the connectivity test
 */
export const testApiConnectivity = async () => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const startTime = Date.now();
    
    const response = await fetch(API_URL, {
      method: 'HEAD',
      cache: 'no-cache',
    });
    
    const endTime = Date.now();
    
    return {
      success: response.ok,
      url: API_URL,
      status: response.status,
      statusText: response.statusText,
      timing: {
        duration: endTime - startTime,
        started: new Date(startTime).toISOString(),
        completed: new Date(endTime).toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      url: process.env.EXPO_PUBLIC_API_URL,
      error: {
        message: error.message,
        name: error.name,
      },
    };
  }
};