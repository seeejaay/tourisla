import { useState, useEffect } from "react";
import type { Hotline } from "@/static/hotline/useHotlineManagerSchema.js";
import {
  createHotline as apiCreateHotline,
  fetchHotlines as apiFetchHotlines,
  viewHotlines as apiViewHotline,
  updateHotline as apiUpdateHotline,
  deleteHotline as apiDeleteHotline,
} from "@/lib/api/hotline.js";

export const useHotlineManager = () => {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch all hotlines and update state
  const fetchHotlines = async (): Promise<Hotline[] | null> => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchHotlines();
      setHotlines(data);
      return data;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new hotline and update state
  const createHotline = async (
    hotlineData: HotlineSchema
  ): Promise<Hotline | null> => {
    setLoading(true);
    setError("");
    try {
      const response: Hotline & { error?: string } = await apiCreateHotline(
        hotlineData
      );
      if (response.error) {
        setError(response.error);
        return null;
      }
      setHotlines((prev) => [...prev, response]);
      return response;
    } catch (error) {
      setError(
        "An error occurred while creating the hotline." +
          (error instanceof Error ? error.message : String(error))
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // View a specific hotline by ID
  const viewHotline = async (id: number): Promise<Hotline | null> => {
    setLoading(true);
    setError("");
    try {
      const response = await apiViewHotline(id);
      return response;
    } catch (error) {
      setError(
        "An error occurred while viewing the hotline." +
          (error instanceof Error ? error.message : String(error))
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing hotline
  const updateHotline = async (
    hotlineData: HotlineSchema
  ): Promise<Hotline | null> => {
    setLoading(true);
    setError("");
    try {
      // Pass both id and data to the API
      const response: Hotline & { error?: string } = await apiUpdateHotline(
        hotlineData.id,
        hotlineData
      );
      if (response.error) {
        setError(response.error);
        return null;
      }
      setHotlines((prev) =>
        prev.map((hotline) => (hotline.id === response.id ? response : hotline))
      );
      return response;
    } catch (error) {
      setError(
        "An error occurred while updating the hotline." +
          (error instanceof Error ? error.message : String(error))
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  // Delete a hotline
  const deleteHotline = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      const response = await apiDeleteHotline(id);
      if (response) {
        setHotlines((prev) =>
          prev.filter((hotline) => Number(hotline.id) !== id)
        );
        return true;
      }
      return false;
    } catch (error) {
      setError(
        "An error occurred while deleting the hotline." +
          (error instanceof Error ? error.message : String(error))
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Initial fetch of hotlines on mount
  useEffect(() => {
    fetchHotlines();
  }, []);

  return {
    hotlines,
    loading,
    error,
    fetchHotlines,
    createHotline,
    viewHotline,
    updateHotline,
    deleteHotline,
  };
};
