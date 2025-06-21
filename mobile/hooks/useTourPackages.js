import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { fetchPackages, createPackage, deletePackage } from '../lib/api/tourPackages';
import { API_URL } from '@/lib/config';

export const useTourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
        return parsedUserData;
      }
      throw new Error('No user data found');
    } catch (error) {
      console.error('Error loading user data:', error);
      router.replace('/login');
      return null;
    }
  };

  const loadPackages = async () => {
    try {
      setLoading(true);
      const user = await loadUserData();
      if (!user?.token) return;

      const packagesData = await fetchPackages(user.token);
      setPackages(packagesData);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadPackages();
  }, []);

  const handleCreatePackage = async ({
    packageName,
    location,
    description,
    price,
    durationDays,
    inclusions,
    exclusions,
    availableSlots,
    dateStart,
    dateEnd,
    startTime,
    endTime,
  }) => {
    console.log('User data before creating package:', userData); // Debug log

    if (!userData?.token) {
      Alert.alert('Error', 'Authentication required. Please log in again.');
      return;
    }

    if (!validatePackageData({
      packageName,
      location,
      description,
      price,
      durationDays,
      availableSlots,
      dateStart,
      startTime,
    })) return;

    try {
      const packageData = {
        package_name: packageName.trim().toUpperCase(),
        location: location.trim().toUpperCase(),
        description: description.trim().toUpperCase(),
        price: parseFloat(price),
        duration_days: parseInt(durationDays),
        inclusions: inclusions.trim().toUpperCase(),
        exclusions: exclusions.trim().toUpperCase(),
        available_slots: parseInt(availableSlots),
        date_start: dateStart,
        date_end: dateEnd || null,
        start_time: startTime,
        end_time: endTime,
        operator_id: userData.id, // Add operator ID
      };

      console.log('Submitting package data:', packageData); // Debug log

      const response = await createPackage(userData.token, packageData);

      console.log('Response from server:', response.data); // Debug log

      if (response.data?.tourPackage) {
        Alert.alert('Success', 'Tour package created successfully');
        await loadPackages(); // Refresh packages
      }
    } catch (error) {
      console.error('Full error:', {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });

      let errorMessage = 'Failed to create package. ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        router.replace('/login'); // Redirect to login screen
      }

      Alert.alert('Error', errorMessage);
    }
  };

  const handleDeletePackage = async (packageId) => {
    try {
      if (!userData?.token) throw new Error('Authentication required');

      await deletePackage(userData.token, packageId);
      await loadPackages();
      return { success: true };
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  return {
    packages,
    loading,
    refreshing,
    userData,
    handleRefresh,
    handleCreatePackage,
    handleDeletePackage,
    loadPackages,
  };
};