import { useState, useEffect, useCallback } from "react";
import type { AccommodationSchema } from "@/app/static/accommodation/accommodationSchema";
import type { Accommodation } from "@/app/static/accommodation/accommodationSchema";

import {
  createAccommodation as apiCreateAccommodation,
  getAccommodations as apiFetchAccommodations,
  getAccommodationById as apiViewAccommodation,
  editAccommodation as apiUpdateAccommodation,
  deleteAccommodation as apiDeleteAccommodation,
  getTourismStaff as apiGetTourismStaff,
  assignAccommodationToStaff as apiAssignAccommodationToStaff,
} from "@/lib/api/accommodations";

export interface TourismStaff {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  nationality: string;
  role: string;
  status: string;
  created_at: string;
  last_login_at: string;
  last_login_ip: string;
  mfa_enabled: boolean;
  password: string;
  accommodation_id: number | null;
  attraction_id: number | null;
  deleted_at: string | null;
  reset_password_token: string | null;
  reset_password_expires: string | null;
}

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
        console.log("Accommodation viewed");
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

  // Fetch tourism staff and assign accommodation to staff
  const assignAccommodationToStaff = useCallback(
    async (
      staffId: number,
      accommodationId: number | null
    ): Promise<boolean> => {
      setLoading(true);
      setError("");
      try {
        console.log(`Assigning accommodation ID to Staff ID`);
        const response = await apiAssignAccommodationToStaff(
          staffId,
          accommodationId
        );
        if (response.error) {
          setError(response.error);
          return false;
        }
        // Optionally, update the state with the new assignment
        return true;
      } catch (error) {
        setError(
          "An error occurred while assigning the accommodation to staff." +
            (error instanceof Error ? error.message : String(error))
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch tourism staff for assignment
  const getTourismStaff = useCallback(async (): Promise<TourismStaff[]> => {
    setLoading(true);
    setError("");
    try {
      const staff = await apiGetTourismStaff();
      console.log("Tourism staff fetched");
      return staff;
    } catch (error) {
      setError(
        "An error occurred while fetching tourism staff." +
          (error instanceof Error ? error.message : String(error))
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
    assignAccommodationToStaff,
    getTourismStaff,
  };
};
