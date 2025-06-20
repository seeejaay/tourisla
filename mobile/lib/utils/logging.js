/**
 * Log API request details
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Object} data - Request data (optional)
 */
export const logApiRequest = (method, url, data = null) => {
  console.log(`API Request: ${method} ${url}`);
  if (data) {
    console.log('Request data:', JSON.stringify(data).substring(0, 200) + '...');
  }
};

/**
 * Log API response details
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {number} status - HTTP status code
 * @param {Object} data - Response data (optional)
 */
export const logApiResponse = (method, url, status, data = null) => {
  console.log(`API Response: ${method} ${url} - Status: ${status}`);
  if (data) {
    console.log('Response data:', JSON.stringify(data).substring(0, 200) + '...');
  }
};

/**
 * Log API error details
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Error} error - Error object
 */
export const logApiError = (method, url, error) => {
  console.error(`API Error: ${method} ${url}`);
  if (error.response) {
    console.error(`Status: ${error.response.status}`);
    console.error('Response data:', error.response.data);
  } else if (error.request) {
    console.error('No response received');
  } else {
    console.error('Error message:', error.message);
  }
};