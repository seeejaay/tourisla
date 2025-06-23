import { useState, useEffect, useCallback } from "react";
import type { AccommodationSchema } from "@/app/static/accommodation/accommodationSchema";
import type { Accommodation } from "@/app/static/accommodation/accommodationSchema";

import {
  createAccommodation as apiCreateAccommodation,
  getAccommodations as apiFetchAccommodations,
  getAccommodationById as apiViewAccommodation,
  editAccommodation as apiUpdateAccommodation,
  deleteAccommodation as apiDeleteAccommodation,
} from "@/lib/api/accommodations";

export const useAccommodationManager = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedAccommodation, setSelectedAccommodation] =
    useState<Accommodation | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch all accommodations and update state
  const fetchAccommodations = useCallback(async (): Promise<
    Accommodation[] | null
  > => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchAccommodations();
      setAccommodations(data);
      return data;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new accommodation and update state
  const createAccommodation = useCallback(
    async (
      accommodationData: AccommodationSchema
    ): Promise<Accommodation | null> => {
      setLoading(true);
      setError("");
      try {
        const response: Accommodation & { error?: string } =
          await apiCreateAccommodation(accommodationData);
        if (response.error) {
          setError(response.error);
          return null;
        }
        setAccommodations((prev) => [...prev, response]);
        return response;
      } catch (error) {
        setError(
          "An error occurred while creating the accommodation." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // View a specific accommodation by ID
  const viewAccommodation = useCallback(
    async (id: number): Promise<Accommodation | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiViewAccommodation(id);
        setSelectedAccommodation(response);
        console.log("Accommodation viewed:", response);
        return response;
      } catch (error) {
        setError(
          "An error occurred while viewing the accommodation." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Edit an existing accommodation and update state
  const editAccommodation = useCallback(
    async (
      id: number,
      accommodationData: AccommodationSchema
    ): Promise<Accommodation | null> => {
      setLoading(true);
      setError("");
      try {
        const response: Accommodation & { error?: string } =
          await apiUpdateAccommodation(id, accommodationData);
        if (response.error) {
          setError(response.error);
          return null;
        }
        setAccommodations((prev) =>
          prev.map((acc) => (acc.id === id ? response : acc))
        );
        return response;
      } catch (error) {
        setError(
          "An error occurred while updating the accommodation." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete an accommodation and update state
  const deleteAccommodation = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError("");
      try {
        await apiDeleteAccommodation(id);
        setAccommodations((prev) => prev.filter((acc) => acc.id !== id));
        return true;
      } catch (error) {
        setError(
          "An error occurred while deleting the accommodation." +
            (error instanceof Error ? error.message : String(error))
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Reset the selected accommodation and editing state
  const resetSelectedAccommodation = useCallback(() => {
    setSelectedAccommodation(null);
    setIsEditing(false);
  }, []);

  // Toggle editing state
  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  // Effect to fetch accommodations on mount
  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  return {
    accommodations,
    loading,
    error,
    selectedAccommodation,
    isEditing,
    fetchAccommodations,
    createAccommodation,
    viewAccommodation,
    editAccommodation,
    deleteAccommodation,
    resetSelectedAccommodation,
    toggleEditing,
  };
};
