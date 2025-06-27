import { useState, useCallback } from "react";

import type { TouristSpotSchema } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import type { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";

import {
  createTouristSpot as apiCreateTouristSpot,
  fetchTouristSpots as apiFetchTouristSpots,
  viewTouristSpots as apiViewTouristSpot,
  updateTouristSpot as apiUpdateTouristSpot,
  deleteTouristSpot as apiDeleteTouristSpot,
  assignAttractionToStaff as apiAssignAttractionToStaff,
} from "@/lib/api/touristSpot";

export const useTouristSpotManager = () => {
  const [touristSpots, setTouristSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch all tourist spots and update state
  const fetchTouristSpots = useCallback(async (): Promise<
    TouristSpot[] | null
  > => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchTouristSpots();
      setTouristSpots(data);
      console.log("Fetched tourist spots:", data);
      return data;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new tourist spot and update state
  const createTouristSpot = useCallback(
    async (touristSpotData: FormData): Promise<TouristSpot | null> => {
      setLoading(true);
      setError("");
      try {
        const response: TouristSpot & { error?: string } =
          await apiCreateTouristSpot(touristSpotData); // <-- Pass FormData
        if (response.error) {
          setError(response.error);
          return null;
        }
        setTouristSpots((prev) => [...prev, response]);
        return response;
      } catch (error) {
        setError(
          "An error occurred while creating the tourist spot." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // View a specific tourist spot
  const viewTouristSpot = useCallback(
    async (id: string): Promise<TouristSpot | null> => {
      setLoading(true);
      setError("");
      try {
        const data = await apiViewTouristSpot(id);

        return data;
      } catch (err) {
        setError(
          "Error: " + (err instanceof Error ? err.message : String(err))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update an existing tourist spot
  const updateTouristSpot = useCallback(
    async (
      id: number,
      touristSpotData: TouristSpotSchema | FormData
    ): Promise<TouristSpot | null> => {
      setLoading(true);
      setError("");
      try {
        const response: TouristSpot & { error?: string } =
          await apiUpdateTouristSpot(id, touristSpotData);
        if (response.error) {
          setError(response.error);
          return null;
        }
        setTouristSpots((prev) =>
          prev.map((spot) => (spot.id === id ? response : spot))
        );
        return response;
      } catch (error) {
        setError(
          "An error occurred while updating the tourist spot." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  // Delete a tourist spot and update state
  const deleteTouristSpot = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiDeleteTouristSpot(id);
        if (response.error) {
          setError(response.error);
          return false;
        }
        setTouristSpots((prev) => prev.filter((spot) => spot.id !== id));
        return true;
      } catch (error) {
        setError(
          "An error occurred while deleting the tourist spot." +
            (error instanceof Error ? error.message : String(error))
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const assignAttractionToStaff = useCallback(
    async (staffId: number, touristSpotId: number | null): Promise<boolean> => {
      setLoading(true);
      setError("");
      try {
        console.log("Assigning tourist spot to staff");
        const response = await apiAssignAttractionToStaff(
          staffId,
          touristSpotId
        );
        if (response.error) {
          setError(response.error);
          return false;
        }
        // Optionally, you can update the state or perform any other actions here
        return true;
      } catch (error) {
        setError(
          "An error occurred while assigning the tourist spot to staff." +
            (error instanceof Error ? error.message : String(error))
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    touristSpots,
    loading,
    error,
    fetchTouristSpots,
    createTouristSpot,
    viewTouristSpot,
    updateTouristSpot,
    deleteTouristSpot,
    assignAttractionToStaff,
  };
};
