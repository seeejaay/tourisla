// API configuration
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005/';
export const REQUEST_TIMEOUT = 30000;

// API endpoints
export const ENDPOINTS = {
  TOURIST_SPOTS: 'tourist-spots',
  USERS: 'users',
  AUTH: 'auth',
  REVIEWS: 'reviews',
  FAVORITES: 'favorites',
  LOGIN: 'login',
  RULES: 'rules'  // We'll adjust this based on the test results
};

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'Tourisla',
  VERSION: '1.0.0',
  REGION: 'Bohol, Philippines'
};

// Helper function to get the full API URL for an endpoint
export function getApiEndpoint(endpoint) {
  // Try different combinations until we find one that works
  const possiblePaths = [
    `${API_URL}${endpoint}`,
    `${API_URL}api/${endpoint}`,
    `${API_URL}api/v1/${endpoint}`,
    `${API_URL}v1/${endpoint}`
  ];
  
  console.log('Possible API paths:', possiblePaths);
  return possiblePaths[0]; // Start with the first option
}

