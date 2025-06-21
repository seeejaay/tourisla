import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Get guide profile by user ID
export const getGuideProfileByUserId = async (userId) => {
  try {
    // Get auth token
    const token = await AsyncStorage.getItem('authToken');
    
    // Set up request config
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Make the API request - using the existing endpoint structure
    const response = await axios.get(
      `${API_URL}guideRegis/user/${userId}`,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching guide profile:', error);
    throw error;
  }
};

// Get assigned packages for a guide
export const getAssignedPackages = async (guideId) => {
  try {
    // Get auth token
    const token = await AsyncStorage.getItem('authToken');
    
    // Set up request config
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Make the API request - using the existing endpoint structure
    const response = await axios.get(
      `${API_URL}tourguide-assignments/${guideId}`,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching assigned packages:', error);
    throw error;
  }
};

// Get all data in one request (guide profile and assigned packages)
export const getGuideDataAndAssignments = async (userId) => {
  try {
    // First get the guide profile
    const guideProfile = await getGuideProfileByUserId(userId);
    
    if (!guideProfile || !guideProfile.id) {
      throw new Error('Guide profile not found');
    }
    
    // Then get the assigned packages
    const assignedPackages = await getAssignedPackages(guideProfile.id);
    
    return {
      guideProfile,
      assignedPackages
    };
  } catch (error) {
    console.error('Error fetching guide data and assignments:', error);
    throw error;
  }
};

