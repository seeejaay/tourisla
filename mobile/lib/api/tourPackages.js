import axios from 'axios';
import { API_URL } from '../config';

export const fetchPackages = async () => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');

    if (!userDataString) {
      Alert.alert('Error', 'No user data found. Please log in again.');
      return;
    }

    const userData = JSON.parse(userDataString);

    if (!userData?.token) {
      Alert.alert('Error', 'Authentication required. Please log in again.');
      return;
    }

    const response = await axios.get(`${API_URL}/tour-packages`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching packages:', error.message);
    Alert.alert('Error', 'Something went wrong while fetching packages.');
  }
};

export const createPackage = async (token, packageData) => {
  try {
    const response = await axios.post(
      `${API_URL}/tour-packages`,
      packageData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

export const deletePackage = async (token, packageId) => {
  try {
    await axios.delete(
      `${API_URL}/tour-packages/${packageId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};