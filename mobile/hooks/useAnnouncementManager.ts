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
    async (data: FormData | AnnouncementSchema): Promise<Announcement | null> => {
      setLoading(true);
      setError("");
      try {
        console.log("Creating announcement with data:", 
          data instanceof FormData 
            ? "FormData object" 
            : JSON.stringify(data)
        );
        
        const response = await apiCreateAnnouncement(data);
        if ("error" in response && response.error) {
          setError(response.error);
          return null;
        }
        
        console.log("Announcement created successfully:", response);
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

  // Update an announcement
  const updateAnnouncement = useCallback(
    async (id: string, data: FormData | Partial<AnnouncementSchema>): Promise<Announcement | null> => {
      setLoading(true);
      setError("");
      try {
        console.log("Updating announcement with ID:", id);
        console.log("Data type:", data instanceof FormData ? "FormData with image" : "JSON data");
        
        // Add more detailed logging
        if (data instanceof FormData) {
          // Log FormData contents
          for (let pair of (data as any).entries()) {
            console.log(`FormData field: ${pair[0]}, value: ${typeof pair[1] === 'object' ? 'File object' : pair[1]}`);
          }
        } else {
          console.log("JSON data:", JSON.stringify(data));
        }
        
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
        
        console.log("API Response:", JSON.stringify(response));
        
        // Update the announcements state
        setAnnouncements((prev) =>
          prev.map((item) => (item.id === id ? response : item))
        );
        
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error updating announcement:", errorMessage);
        setError("Failed to update announcement. " + errorMessage);
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
