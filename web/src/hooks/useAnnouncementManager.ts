import { useState, useCallback } from "react";
import type { AnnouncementSchema } from "@/app/static/announcement/useAnnouncementManagerSchema";
import type { Announcement } from "@/components/custom/announcements/columns";
import {
  createAnnouncement as apiCreateAnnouncement,
  fetchAnnouncements as apiFetchAnnouncements,
  viewAnnouncement as apiViewAnnouncement,
  updateAnnouncement as apiUpdateAnnouncement,
  deleteAnnouncement as apiDeleteAnnouncement,
} from "@/lib/api/announcements";

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
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new announcement and update state
  const createAnnouncement = useCallback(
    async (announcementData: FormData): Promise<Announcement | null> => {
      setLoading(true);
      setError("");
      try {
        const response: Announcement & { error?: string } =
          await apiCreateAnnouncement(announcementData);
        if (response.error) {
          setError(response.error);
          return null;
        }
        setAnnouncements((prev) => [...prev, response]);
        return response;
      } catch (error) {
        setError(
          "An error occurred while creating the announcement." +
            (error instanceof Error ? error.message : String(error))
        );
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
        const response: Announcement & { error?: string } =
          await apiViewAnnouncement(id);
        if (response.error) {
          setError(response.error);
          return null;
        }
        return response;
      } catch (error) {
        setError(
          "An error occurred while viewing the announcement." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update an announcement and update state
  const updateAnnouncement = useCallback(
    async (data: AnnouncementSchema): Promise<Announcement | null> => {
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
      const response: { error?: string } = await apiDeleteAnnouncement(id);
      if (response.error) {
        setError(response.error);
        return;
      }
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== id)
      );
    } catch (error) {
      setError(
        "An error occurred while deleting the announcement." +
          (error instanceof Error ? error.message : String(error))
      );
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
