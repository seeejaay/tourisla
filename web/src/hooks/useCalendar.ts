import { useState, useCallback } from "react";
import { authorizeGoogleCalendar as authorizeCalendarApi } from "@/lib/api/calendar"; // Adjust the import path as necessary

export const useCalendar = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Authorize calendar
  // useCalendar.ts
  const authorizeCalendar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await authorizeCalendarApi();
      setLoading(false);
      return data; // { authUrl }
    } catch (err) {
      setError("Failed to authorize calendar.");
      setLoading(false);
      throw err;
    }
  }, []);
  return { authorizeCalendar, loading, error };
};
