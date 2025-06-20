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
      console.log("Fetching announcements...");
      const data = await apiFetchAnnouncements();
      console.log(`Received ${data?.length || 0} announcements`);
      setAnnouncements(data || []);
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

  // View a single announcement
  const viewAnnouncement = useCallback(async (id: string): Promise<Announcement | null> => {
    setLoading(true);
    setError("");
    try {
      console.log(`Viewing announcement with ID: ${id}`);
      const data = await apiViewAnnouncement(id);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error viewing announcement ${id}:`, errorMessage);
      setError("Failed to view announcement. " + errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new announcement
  const createAnnouncement = useCallback(async (data: any): Promise<Announcement | null> => {
    setLoading(true);
    setError("");
    try {
      console.log("Creating new announcement");
      const response = await apiCreateAnnouncement(data);
      
      // Update the announcements list
      setAnnouncements(prev => [...prev, response]);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error creating announcement:", errorMessage);
      setError("Failed to create announcement. " + errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing announcement
  const updateAnnouncement = useCallback(async (id: string, data: any): Promise<Announcement | null> => {
    setLoading(true);
    setError("");
    try {
      console.log(`Updating announcement with ID: ${id}`);
      
      // Add retry logic
      let retries = 0;
      const maxRetries = 2;
      let response = null;
      
      while (retries <= maxRetries && !response) {
        try {
          if (retries > 0) {
            console.log(`Retry attempt ${retries}...`);
          }
          
          response = await apiUpdateAnnouncement(id, data);
          
          if (!response) {
            throw new Error("Server returned null response");
          }
        } catch (retryError) {
          console.error(`Attempt ${retries + 1} failed:`, retryError);
          if (retries === maxRetries) {
            throw retryError;
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries++;
        }
      }
      
      console.log("API Response:", JSON.stringify(response).substring(0, 200));
      
      // Update the announcements state
      setAnnouncements((prev) =>
        prev.map((item) => (item.id === id ? response : item))
      );
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error updating announcement ${id}:`, errorMessage);
      setError("Failed to update announcement. " + errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an announcement
  const deleteAnnouncement = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      console.log(`Deleting announcement with ID: ${id}`);
      await apiDeleteAnnouncement(id);
      
      // Update the announcements state
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error deleting announcement ${id}:`, errorMessage);
      setError("Failed to delete announcement. " + errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    viewAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
};
