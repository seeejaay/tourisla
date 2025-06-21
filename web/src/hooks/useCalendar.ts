import { useState, useCallback } from "react";

export const useCalendar = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Authorize calendar
  const authorizeCalendar = useCallback((): void => {
    setLoading(true);
    setError("");
    try {
      // Instead of axios, just redirect:
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}calendar/authorize`,
        "_self"
      ); // or your backend endpoint that starts OAuth
    } catch (err) {
      setError("Failed to authorize calendar.");
      console.error(err);
      setLoading(false);
    }
  }, []);

  return { authorizeCalendar, loading, error };
};
