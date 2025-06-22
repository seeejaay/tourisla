import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchGuidePackages = async (userId) => {
  try {
    // Get auth token from AsyncStorage
    const token = await AsyncStorage.getItem('authToken');
    
    // Set up request config with auth token
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Using auth token:', token ? 'Yes (token exists)' : 'No token found');
    
    // First get the guide profile to get the guide ID
    const profileEndpoints = [
      `${API_URL}tourguide/profile/${userId}`,
      `${API_URL}guideRegis/user/${userId}`,
      `${API_URL}tourguide-applicants/user/${userId}`
    ];
    
    let guideProfile = null;
    
    for (const endpoint of profileEndpoints) {
      try {
        console.log(`Trying to get guide profile from: ${endpoint}`);
        const profileResult = await axios.get(endpoint, config);
        
        if (profileResult.status === 200) {
          guideProfile = profileResult.data;
          console.log(`Guide profile found at ${endpoint}:`, guideProfile);
          break;
        }
      } catch (profileError) {
        console.log(`Profile endpoint ${endpoint} failed: ${profileError.message}`);
      }
    }
    
    // If we couldn't find the guide profile, try using the user ID directly
    if (!guideProfile) {
      console.log('Could not find guide profile, using user ID directly');
      
      // Use the correct endpoint to get packages by user ID
      const packagesEndpoint = `${API_URL}tour-packages/by-user/${userId}`;
      console.log(`Fetching packages from: ${packagesEndpoint}`);
      
      const packagesResponse = await axios.get(packagesEndpoint, config);
      
      if (packagesResponse.status === 200) {
        console.log("Successfully fetched guide packages by user ID");
        return packagesResponse.data.tourPackages || packagesResponse.data;
      }
      
      throw new Error("Could not find guide profile or packages");
    }
    
    // Get the guide ID from the profile
    const guideId = guideProfile.id || guideProfile.guide_id || guideProfile.tourguide_id;
    
    if (!guideId) {
      throw new Error("Could not determine guide ID from profile");
    }
    
    console.log(`Using guide ID: ${guideId} to fetch packages`);
    
    // Use the correct endpoint to get packages by guide ID
    const packagesEndpoint = `${API_URL}tour-packages/by-guide/${guideId}`;
    console.log(`Fetching packages from: ${packagesEndpoint}`);
    
    const packagesResponse = await axios.get(packagesEndpoint, config);
    
    if (packagesResponse.status === 200) {
      console.log("Successfully fetched guide packages");
      return packagesResponse.data.tourPackages || packagesResponse.data;
    }
    
    throw new Error("Failed to fetch guide packages");
  } catch (error) {
    console.error(
      "Error Fetching Guide Packages: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Export as default object
export default {
  fetchGuidePackages
};
