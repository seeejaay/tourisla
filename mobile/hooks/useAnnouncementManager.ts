import { useState, useCallback } from "react";
import type { AnnouncementSchema } from "@/static/announcement/useAnnouncementManagerSchema.js";
import {
  createAnnouncement as apiCreateAnnouncement,
  fetchAnnouncements as apiFetchAnnouncements,
  viewAnnouncement as apiViewAnnouncement,
  updateAnnouncement as apiUpdateAnnouncement,
  deleteAnnouncement as apiDeleteAnnouncement,
} from "@/lib/api/announcement";

// Define the Announcement type
interface Announcement {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useAnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch all announcements and update state
  const fetchAnnouncements = useCallback(async (): Promise<
    Announcement[] | null
  > => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchAnnouncements();
      setAnnouncements(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error fetching announcements:", errorMessage);
      setError("Failed to fetch announcements. " + errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new announcement and update state
  const createAnnouncement = useCallback(
    async (data: AnnouncementSchema): Promise<Announcement | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiCreateAnnouncement(data);
        if ("error" in response && response.error) {
          setError(response.error);
          return null;
        }
        setAnnouncements((prev) => [...prev, response]);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error creating announcement:", errorMessage);
        setError("Failed to create announcement. " + errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // View a single announcement
  const viewAnnouncement = useCallback(
    async (id: string): Promise<Announcement | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiViewAnnouncement(id);
        if ("error" in response && response.error) {
          setError(response.error);
          return null;
        }
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error viewing announcement:", errorMessage);
        setError("Failed to view announcement. " + errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update an announcement and update state
  const updateAnnouncement = useCallback(
    async (
      data: AnnouncementSchema & { id: string }
    ): Promise<Announcement | null> => {
      setLoading(true);
      setError("");
      try {
        // FIX: Pass id and data separately
        const response: Announcement & { error?: string } =
          await apiUpdateAnnouncement(data.id, data);
        if (response.error) {
          setError(response.error);
          return null;
        }
        setAnnouncements((prev) =>
          prev.map((announcement) =>
            announcement.id === data.id ? response : announcement
          )
        );
        return response;
      } catch (error) {
        setError(
          "An error occurred while updating the announcement." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete an announcement and update state
  const deleteAnnouncement = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const response = await apiDeleteAnnouncement(id);
      if ("error" in response && response.error) {
        setError(response.error);
        return;
      }
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== id)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error deleting announcement:", errorMessage);
      setError("Failed to delete announcement. " + errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    createAnnouncement,
    viewAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    setAnnouncements,
    setLoading,
    setError,
  };
};
