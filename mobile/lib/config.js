// API configuration
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005/api/v1/';
export const REQUEST_TIMEOUT = 30000;

// API endpoints - updated with more complete endpoint structure
export const ENDPOINTS = {
  TOURIST_SPOTS: 'tourist-spots',
  USERS: 'users',
  CURRENT_USER: 'users/current',  // Added specific endpoint for current user
  AUTH: 'auth',
  AUTH_USER: 'auth/user',        // Added auth user endpoint
  REVIEWS: 'reviews',
  FAVORITES: 'favorites',
  LOGIN: 'auth/login',           // More standard login endpoint
  TOUR_PACKAGES: 'tour-packages',
  RULES: 'rules',
  APPLICATIONS: 'applications'   // Added based on your logs
};

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'Tourisla',
  VERSION: '1.0.0',
  REGION: 'Bohol, Philippines'
};

// Simplified and more reliable endpoint resolver
export function getApiEndpoint(endpointKey) {
  // Get the endpoint path from our predefined endpoints
  const endpointPath = ENDPOINTS[endpointKey];
  
  if (!endpointPath) {
    console.error(`Endpoint ${endpointKey} not defined`);
    throw new Error(`Unknown endpoint: ${endpointKey}`);
  }

  // Construct the full URL
  const fullUrl = `${API_URL}${endpointPath}`;
  console.log(`Resolved API endpoint for ${endpointKey}:`, fullUrl);
  return fullUrl;
}

// Additional helper for auth endpoints
export function getAuthEndpoint(endpointKey) {
  return getApiEndpoint(endpointKey.startsWith('AUTH_') ? endpointKey : `AUTH_${endpointKey}`);
}

// Helper to check if URL ends with slash
function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}