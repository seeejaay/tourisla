import axios from 'axios';

// OpenWeatherMap API configuration
const API_KEY = '9de243494c0b295cca9337e1e96b00e2'; // This is a sample key - replace with yours
const API_URL = 'https://api.openweathermap.org/data/2.5';

// Location name cache to maintain consistency
let lastLocationName = null;
let lastLocationCountry = null;
let lastCoordinates = null;

/**
 * Get current weather by coordinates
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {boolean} forceRefresh - Force refresh location name
 * @returns {Promise<Object>} - Weather data
 */
export const getCurrentWeather = async (latitude, longitude, forceRefresh = false) => {
  try {
    console.log('Fetching current weather for:', latitude, longitude);
    
    // Check if coordinates have changed significantly (more than 1km)
    const coordinatesChanged = hasLocationChangedSignificantly(latitude, longitude);
    
    // If forcing refresh or coordinates changed significantly, clear the cache
    if (forceRefresh || coordinatesChanged) {
      console.log('Location changed significantly or force refresh requested');
      refreshLocationName();
    }
    
    // Update last coordinates
    lastCoordinates = { latitude, longitude };
    
    const response = await axios.get(`${API_URL}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric', // Use metric units (Celsius)
        appid: API_KEY
      },
      timeout: 8000 // 8 second timeout
    });
    
    console.log('Weather API response status:', response.status);
    
    // Process the response to ensure location name consistency
    const weatherData = response.data;
    
    // If we have a cached location name and not forcing refresh, use it
    if (lastLocationName && lastLocationCountry && !forceRefresh && !coordinatesChanged) {
      console.log('Using cached location name:', lastLocationName);
      weatherData.name = lastLocationName;
      weatherData.sys.country = lastLocationCountry;
    } else {
      // Cache the new location name
      lastLocationName = weatherData.name;
      lastLocationCountry = weatherData.sys.country;
      console.log('Caching new location name:', lastLocationName);
    }
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather:', error.response?.data || error.message);
    
    // If API fails, return mock data as fallback
    console.log('Using mock data as fallback');
    return {
      name: lastLocationName || "Unknown Location", // Use cached name or default
      sys: { country: lastLocationCountry || "Unknown" },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 28, feels_like: 30, humidity: 75, pressure: 1012 },
      weather: [{ description: "partly cloudy", icon: "02d" }],
      wind: { speed: 3.5 },
      visibility: 10000
    };
  }
};

/**
 * Get weather forecast
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} - Forecast data
 */
export const getWeatherForecast = async (latitude, longitude) => {
  try {
    console.log('Fetching forecast for:', latitude, longitude);
    
    const response = await axios.get(`${API_URL}/forecast`, {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric', // Use metric units (Celsius)
        appid: API_KEY
      },
      timeout: 8000 // 8 second timeout
    });
    
    console.log('Forecast API response status:', response.status);
    
    // Ensure forecast city name matches current weather location name for consistency
    const forecastData = response.data;
    if (lastLocationName && lastLocationCountry) {
      forecastData.city.name = lastLocationName;
      forecastData.city.country = lastLocationCountry;
    } else {
      // If we don't have a cached name yet, cache it from the forecast
      lastLocationName = forecastData.city.name;
      lastLocationCountry = forecastData.city.country;
    }
    
    return forecastData;
  } catch (error) {
    console.error('Error fetching forecast:', error.response?.data || error.message);
    
    // If API fails, return mock data as fallback
    console.log('Using mock forecast data as fallback');
    return {
      city: {
        name: lastLocationName || "Unknown Location",
        country: lastLocationCountry || "Unknown"
      },
      list: Array(40).fill(null).map((_, index) => {
        const timestamp = Math.floor(Date.now() / 1000) + (index * 3600);
        const hour = new Date(timestamp * 1000).getHours();
        
        // Vary temperature based on time of day
        let temp = 28;
        if (hour >= 10 && hour <= 14) temp = 32; // Hotter during midday
        if (hour >= 0 && hour <= 5) temp = 24; // Cooler at night
        
        return {
          dt: timestamp,
          main: {
            temp: temp,
            feels_like: temp + 2,
            humidity: 70 + Math.floor(Math.random() * 20),
            pressure: 1010 + Math.floor(Math.random() * 10)
          },
          weather: [{ description: "partly cloudy", icon: "02d" }],
          wind: { speed: 2 + Math.random() * 5 },
          visibility: 8000 + Math.floor(Math.random() * 2000)
        };
      })
    };
  }
};

/**
 * Check if location has changed significantly (more than 1km)
 * @param {number} latitude - Current latitude
 * @param {number} longitude - Current longitude
 * @returns {boolean} - True if location changed significantly
 */
const hasLocationChangedSignificantly = (latitude, longitude) => {
  if (!lastCoordinates) return true;
  
  // Calculate distance between points using Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = (lastCoordinates.latitude - latitude) * Math.PI / 180;
  const dLon = (lastCoordinates.longitude - longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(latitude * Math.PI / 180) * Math.cos(lastCoordinates.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // If moved more than 1km, consider it significant
  return distance > 1;
};

/**
 * Force refresh location name on next API call
 */
export const refreshLocationName = () => {
  lastLocationName = null;
  lastLocationCountry = null;
  console.log('Location name cache cleared');
};

/**
 * Get weather icon URL with size option
 * @param {string} iconCode - Weather icon code from API
 * @param {string} size - Icon size (1x, 2x, 4x)
 * @returns {string} - Icon URL
 */
export const getWeatherIconUrl = (iconCode, size = '2x') => {
  if (!iconCode) return null;
  
  // Use OpenWeatherMap icons with specified size
  // Make sure we're using https for secure connections
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

/**
 * Get a more detailed icon URL for better visual quality
 * @param {string} iconCode - Weather icon code from API
 * @returns {string} - High quality icon URL
 */
export const getHighQualityWeatherIconUrl = (iconCode) => {
  if (!iconCode) return null;
  
  // Use the 4x size for better quality
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

/**
 * Get background color based on weather condition
 * @param {string} iconCode - Weather icon code from API
 * @returns {string} - Hex color code for background
 */
export const getWeatherBackgroundColor = (iconCode) => {
  if (!iconCode) return '#4facfe'; // Default blue
  
  const isNight = iconCode.endsWith('n');
  const condition = iconCode.substring(0, 2);
  
  if (isNight) {
    return '#1e293b'; // Dark blue for night
  }
  
  switch (condition) {
    case '01': // Clear sky
      return '#4facfe';
    case '02': // Few clouds
    case '03': // Scattered clouds
      return '#8e9eab';
    case '04': // Broken clouds
      return '#757f9a';
    case '09': // Shower rain
      return '#3a7bd5';
    case '10': // Rain
      return '#0369a1';
    case '11': // Thunderstorm
      return '#414345';
    case '13': // Snow
      return '#e6dada';
    case '50': // Mist
      return '#757f9a';
    default:
      return '#4facfe';
  }
};

/**
 * Get Ionicons name based on weather condition and time
 * @param {string} iconCode - Weather icon code from API
 * @returns {string} - Ionicons name
 */
export const getIonicon = (iconCode) => {
  if (!iconCode) return 'partly-sunny'; // Default fallback
  
  // Extract condition and day/night info from icon code
  const condition = iconCode.substring(0, 2);
  const isNight = iconCode.endsWith('n');
  
  // Map OpenWeatherMap icon codes to Ionicons
  switch (condition) {
    case '01': // Clear sky
      return isNight ? 'moon' : 'sunny';
    case '02': // Few clouds
      return isNight ? 'partly-sunny-outline' : 'partly-sunny';
    case '03': // Scattered clouds
    case '04': // Broken clouds
      return 'cloudy';
    case '09': // Shower rain
      return 'rainy';
    case '10': // Rain
      return isNight ? 'rainy' : 'rainy';
    case '11': // Thunderstorm
      return 'thunderstorm';
    case '13': // Snow
      return 'snow';
    case '50': // Mist/fog
      return 'cloud';
    default:
      // Fallback to a guaranteed existing icon
      return 'partly-sunny';
  }
};

/**
 * Fallback function to get weather icon based on description
 * This is used as a backup if the icon code doesn't work
 * @param {string} description - Weather description text
 * @returns {string} - Material Community Icons name
 */
export const getIconFromDescription = (description) => {
  if (!description) return 'weather-partly-cloudy';
  
  const desc = description.toLowerCase();
  
  if (desc.includes('clear')) {
    return 'weather-sunny';
  } else if (desc.includes('few clouds') || desc.includes('partly cloudy')) {
    return 'weather-partly-cloudy';
  } else if (desc.includes('cloud')) {
    return 'weather-cloudy';
  } else if (desc.includes('shower') || desc.includes('drizzle')) {
    return 'weather-pouring';
  } else if (desc.includes('rain')) {
    return 'weather-rainy';
  } else if (desc.includes('thunder')) {
    return 'weather-lightning';
  } else if (desc.includes('snow')) {
    return 'weather-snowy';
  } else if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
    return 'weather-fog';
  }
  
  return 'weather-partly-cloudy';
};

/**
 * Get color for weather condition
 * @param {string} iconCode - Weather icon code from API
 * @returns {string} - Hex color code
 */
export const getWeatherColor = (iconCode) => {
  // Extract condition and day/night info from icon code
  const condition = iconCode?.substring(0, 2);
  const isNight = iconCode?.endsWith('n');
  
  if (isNight) {
    return '#1e293b'; // Dark blue for night
  }
  
  // Map conditions to colors
  switch (condition) {
    case '01': // Clear sky
      return '#0ea5e9'; // Sky blue
    case '02': // Few clouds
    case '03': // Scattered clouds
      return '#0284c7'; // Lighter blue
    case '04': // Broken clouds
      return '#64748b'; // Gray blue
    case '09': // Shower rain
    case '10': // Rain
      return '#0369a1'; // Darker blue
    case '11': // Thunderstorm
      return '#334155'; // Dark slate
    case '13': // Snow
      return '#94a3b8'; // Light slate
    case '50': // Mist
      return '#64748b'; // Gray
    default:
      return '#0ea5e9'; // Default blue
  }
};













