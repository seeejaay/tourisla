import { useState, useCallback } from "react";
import { authorizeGoogleCalendar as authorizeCalendarApi } from "@/lib/api/calendar"; // Adjust the import path as necessary

export const useCalendar = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Authorize calendar
  const authorizeCalendar = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      // Call your API to get the Google OAuth URL
      const { data } = await authorizeCalendarApi();
      if (data && data.authUrl) {
        // Redirect to the Google OAuth URL
        window.location.href = data.authUrl;
      } else {
        setError("Failed to get authorization URL.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to authorize calendar.");
      console.error(err);
      setLoading(false);
    }
  }, []);

  return { authorizeCalendar, loading, error };
};
