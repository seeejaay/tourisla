/**
 * Get the base API URL from environment or use a fallback
 * @returns {string} The base API URL
 */
export const getBaseUrl = () => {
  // Check for environment variable
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  // Fallback URLs if environment variable is not set
  const fallbackUrls = [
    'http://192.168.0.135:3005',
    'http://localhost:3005',
    'http://10.0.2.2:3005' // For Android emulator
  ];
  
  // Use environment variable if available, otherwise use first fallback
  const baseUrl = envApiUrl || fallbackUrls[0];
  
  // Ensure the URL doesn't end with a slash
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

/**
 * Log API request details
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Object} data - Request data (optional)
 */
export const logApiRequest = (method, url, data = null) => {
  // Log the original URL without modification
  console.log(`API Request: ${method} ${url}`);
  
  // Don't modify the URL in any way
  return url;
};

/**
 * Known API endpoints structure - WITHOUT the /api/v1 prefix
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/login',
  SIGNUP: '/signup',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Rules endpoints
  RULES: '/rules',
  RULE_BY_ID: (id) => `/rules/${id}`,
  
  // Tourist spots endpoints
  TOURIST_SPOTS: '/tourist-spots',
  TOURIST_SPOT_BY_ID: (id) => `/tourist-spots/${id}`,
  
  // Hotlines endpoints
  HOTLINES: '/hotlines',
  HOTLINE_BY_ID: (id) => `/hotlines/${id}`,
};

/**
 * Get the full URL for an API endpoint
 * @param {string} endpoint - The API endpoint from API_ENDPOINTS
 * @returns {string} The full URL
 */
export const getFullUrl = (endpoint) => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error('API URL is not defined');
  }
  
  if (!endpoint) {
    throw new Error('Endpoint is not defined');
  }
  
  // Ensure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Add the API version prefix
  const apiPrefix = '/api/v1';
  
  return `${baseUrl}${apiPrefix}${formattedEndpoint}`;
};

/**
 * Debug function to check URL construction
 * @param {string} endpoint - The API endpoint
 * @returns {void}
 */
export const debugUrl = (endpoint) => {
  try {
    const baseUrl = getBaseUrl();
    const apiPrefix = '/api/v1';
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${apiPrefix}${formattedEndpoint}`;
    
    console.log('Debug URL construction:');
    console.log('- Base URL:', baseUrl);
    console.log('- API Prefix:', apiPrefix);
    console.log('- Endpoint:', endpoint);
    console.log('- Formatted Endpoint:', formattedEndpoint);
    console.log('- Final URL:', url);
    
    return url;
  } catch (error) {
    console.error('Error in debugUrl:', error);
    return null;
  }
};
