import { useState, useEffect, useCallback } from "react";
import type { HotlineSchema } from "@/app/static/hotline/useHotlineManagerSchema";
import type { Hotline } from "@/app/static/hotline/useHotlineManagerSchema";

import {
  createHotline as apiCreateHotline,
  fetchHotlines as apiFetchHotlines,
  viewHotlines as apiViewHotline,
  updateHotline as apiUpdateHotline,
  deleteHotline as apiDeleteHotline,
} from "@/lib/api/hotline";

export const useHotlineManager = () => {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch all hotlines and update state
  const fetchHotlines = useCallback(async (): Promise<Hotline[] | null> => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchHotlines();
      console.log("Fetched hotlines:", data);
      setHotlines(data);
      return data;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new hotline and update state
  const createHotline = useCallback(
    async (hotlineData: HotlineSchema): Promise<Hotline | null> => {
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
    },
    []
  );

  // View a specific hotline by ID
  const viewHotline = useCallback(
    async (id: number): Promise<Hotline | null> => {
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
    },
    []
  );

  // Update an existing hotline
  const updateHotline = useCallback(
    async (hotlineData: HotlineSchema): Promise<Hotline | null> => {
      setLoading(true);
      setError("");
      try {
        const response: Hotline & { error?: string } = await apiUpdateHotline(
          hotlineData.id,
          hotlineData
        );
        if (response.error) {
          setError(response.error);
          return null;
        }
        setHotlines((prev) =>
          prev.map((hotline) =>
            hotline.id === response.id ? response : hotline
          )
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
    },
    []
  );

  // Delete a hotline
  const deleteHotline = useCallback(async (id: number): Promise<boolean> => {
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
  }, []);

  // Initial fetch of hotlines on mount
  useEffect(() => {
    fetchHotlines();
  }, [fetchHotlines]);

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
