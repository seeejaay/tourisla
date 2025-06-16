// API configuration
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.135:3005/api/v1/';
export const REQUEST_TIMEOUT = 30000;

// API endpoints
export const ENDPOINTS = {
  TOURIST_SPOTS: 'tourist-spots',
  USERS: 'users',
  AUTH: 'auth',
  REVIEWS: 'reviews',
  FAVORITES: 'favorites',
  LOGIN: 'login'
};

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'Tourisla',
  VERSION: '1.0.0',
  REGION: 'Bohol, Philippines'
};


