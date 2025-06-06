/**
 * Ensures the API URL is properly formatted with a trailing slash
 * @param {string} endpoint - The API endpoint to append to the base URL
 * @returns {string} The complete URL with proper formatting
 */
export const getApiUrl = (endpoint) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  
  // Remove leading slash from endpoint if it exists
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  // Ensure the base URL ends with a slash
  const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Logs API request details for debugging
 * @param {string} method - The HTTP method (GET, POST, etc.)
 * @param {string} url - The complete URL being requested
 * @param {object} data - Optional data being sent with the request
 */
export const logApiRequest = (method, url, data = null) => {
  console.log(`API Request: ${method} ${url}`);
  if (data) {
    console.log('Request data:', JSON.stringify(data));
  }
};