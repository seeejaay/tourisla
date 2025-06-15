import axios from 'axios';

// Mock data for TripAdvisor
const MOCK_ATTRACTIONS = [
  {
    location_id: "mock1",
    name: "Chocolate Hills",
    description: "Famous geological formation with over 1,200 hills",
    web_url: "https://www.tripadvisor.com",
    rating: 4.8,
    num_reviews: 1245,
    photo: { images: { medium: { url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500" } } },
    category: { name: "Natural Formation" }
  },
  {
    location_id: "mock2",
    name: "Panglao Beach",
    description: "Beautiful white sand beach with crystal clear waters",
    web_url: "https://www.tripadvisor.com",
    rating: 4.6,
    num_reviews: 987,
    photo: { images: { medium: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500" } } },
    category: { name: "Beach" }
  },
  {
    location_id: "mock3",
    name: "Tarsier Sanctuary",
    description: "Conservation area for the endangered Philippine tarsier",
    web_url: "https://www.tripadvisor.com",
    rating: 4.5,
    num_reviews: 856,
    photo: { images: { medium: { url: "https://images.unsplash.com/photo-1544979590-37e9b4a31c41?w=500" } } },
    category: { name: "Wildlife Sanctuary" }
  },
  {
    location_id: "mock4",
    name: "Hinagdanan Cave",
    description: "Underground cave with a natural swimming pool",
    web_url: "https://www.tripadvisor.com",
    rating: 4.3,
    num_reviews: 723,
    photo: { images: { medium: { url: "https://images.unsplash.com/photo-1564324738080-bbbf8d6b4887?w=500" } } },
    category: { name: "Cave" }
  },
  {
    location_id: "mock5",
    name: "Loboc River Cruise",
    description: "Scenic boat ride with floating restaurant",
    web_url: "https://www.tripadvisor.com",
    rating: 4.4,
    num_reviews: 689,
    photo: { images: { medium: { url: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=500" } } },
    category: { name: "Boat Tour" }
  }
];

/**
 * Get nearby attractions
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {number} radius - Search radius in km
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Array of attractions
 */
export const getNearbyAttractions = async (latitude, longitude, radius = 10, limit = 5) => {
  try {
    console.log(`Getting mock nearby attractions at ${latitude},${longitude}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return MOCK_ATTRACTIONS.slice(0, limit);
  } catch (error) {
    console.error("Error fetching TripAdvisor attractions:", error.message);
    throw error;
  }
};

/**
 * Search for locations
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Array of locations
 */
export const searchLocations = async (query, limit = 5) => {
  try {
    console.log(`Searching mock locations with query: ${query}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Filter mock data based on query
    const filteredResults = MOCK_ATTRACTIONS.filter(
      item => item.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
    
    return filteredResults;
  } catch (error) {
    console.error("Error searching TripAdvisor locations:", error.message);
    throw error;
  }
};

/**
 * Get reviews for a specific location
 * @param {string} locationId - TripAdvisor location ID
 * @param {number} limit - Maximum number of reviews to fetch
 * @returns {Promise<Array>} - List of reviews
 */
export const getLocationReviews = async (locationId, limit = 5) => {
  if (!isApiKeyConfigured()) {
    throw new Error('TripAdvisor API key not configured');
  }
  
  try {
    console.log(`Fetching reviews for location ID: ${locationId}`);
    
    const response = await axios.get(`${API_URL}/location/${locationId}/reviews`, {
      params: {
        key: API_KEY,
        language: 'en',
        limit
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid API response format');
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching TripAdvisor reviews:", error.response?.data || error.message);
    throw error; // Re-throw to let caller handle the error
  }
};

/**
 * Get detailed information about a specific location
 * @param {string} locationId - TripAdvisor location ID
 * @returns {Promise<Object>} - Location details
 */
export const getLocationDetails = async (locationId) => {
  if (!isApiKeyConfigured()) {
    throw new Error('TripAdvisor API key not configured');
  }
  
  try {
    console.log(`Fetching details for location ID: ${locationId}`);
    
    const response = await axios.get(`${API_URL}/location/${locationId}/details`, {
      params: {
        key: API_KEY,
        language: 'en'
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data) {
      throw new Error('Invalid API response format');
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching TripAdvisor location details:", error.response?.data || error.message);
    throw error; // Re-throw to let caller handle the error
  }
};



