import { useState, useCallback } from 'react';
import { 
  fetchTouristSpots, 
  fetchTouristSpotById, 
  createTouristSpot as apiCreateTouristSpot,
  updateTouristSpot as apiUpdateTouristSpot,
  deleteTouristSpot as apiDeleteTouristSpot
} from '../lib/api/touristSpot';

export const useTouristSpotManager = () => {
  const [touristSpots, setTouristSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all tourist spots
  const getAllTouristSpots = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API first
      const data = await fetchTouristSpots();
      setTouristSpots(data);
      return data;
    } catch (err) {
      console.error('Error fetching tourist spots:', err);
      
      // If API fails, use mock data as fallback
      try {
        console.log('Using mock data as fallback');
        const mockData = getMockTouristSpots();
        setTouristSpots(mockData);
        return mockData;
      } catch (mockErr) {
        console.error('Error with mock data:', mockErr);
        setError('Failed to load tourist spots. Please try again.');
        return [];
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Get tourist spot by ID
  const getTouristSpotById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API first
      const data = await fetchTouristSpotById(id);
      return data;
    } catch (err) {
      console.error(`Error fetching tourist spot with ID ${id}:`, err);
      
      // If API fails, try to find in mock data
      try {
        console.log('Using mock data as fallback for single tourist spot');
        const mockData = getMockTouristSpots();
        const spot = mockData.find(spot => spot.id.toString() === id.toString());
        if (spot) {
          return spot;
        } else {
          setError('Tourist spot not found');
          return null;
        }
      } catch (mockErr) {
        setError('Failed to load tourist spot details');
        return null;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Create tourist spot (admin only)
  const createTouristSpot = useCallback(async (spotData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiCreateTouristSpot(spotData, token);
      
      // Update the local state with the new tourist spot
      setTouristSpots(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating tourist spot:', err);
      setError('Failed to create tourist spot. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update tourist spot (admin only)
  const updateTouristSpot = useCallback(async (id, spotData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiUpdateTouristSpot(id, spotData, token);
      
      // Update the local state
      setTouristSpots(prev => 
        prev.map(spot => spot.id.toString() === id.toString() ? data : spot)
      );
      
      return data;
    } catch (err) {
      console.error(`Error updating tourist spot with ID ${id}:`, err);
      setError('Failed to update tourist spot. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete tourist spot (admin only)
  const deleteTouristSpot = useCallback(async (id, token) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiDeleteTouristSpot(id, token);
      
      // Update the local state
      setTouristSpots(prev => prev.filter(spot => spot.id.toString() !== id.toString()));
      return true;
    } catch (err) {
      console.error(`Error deleting tourist spot with ID ${id}:`, err);
      setError('Failed to delete tourist spot. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    touristSpots,
    loading,
    error,
    getAllTouristSpots,
    getTouristSpotById,
    createTouristSpot,
    updateTouristSpot,
    deleteTouristSpot
  };
};



