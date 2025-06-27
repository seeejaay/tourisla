import { useState, useCallback } from "react";
import {
  createAccommodationLog,
  updateAccommodationLog,
  deleteAccommodationLog,
  getAccommodationLogs,
  getAccommodationLog,
  exportAccommodationLogs,
  getAccommodationLogByAccommodationId,
} from "@/lib/api/accommodation_logs";
import type { AccommodationLog } from "@/app/static/accommodation/accommodationlogSchema";

export const useAccommodationLogsManager = () => {
  const [logs, setLogs] = useState<AccommodationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch all logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAccommodationLogs();
      setLogs(data);
      return data;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a log
  const createLog = useCallback(async (logData: AccommodationLog) => {
    setLoading(true);
    setError("");
    try {
      console.log("Creating log with data:", logData);
      const newLog = await createAccommodationLog(logData);
      setLogs((prev) => [...prev, newLog]);
      return newLog;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a log
  const updateLog = useCallback(
    async (id: number, logData: AccommodationLog) => {
      setLoading(true);
      setError("");
      try {
        const updated = await updateAccommodationLog(id, logData);
        setLogs((prev) => prev.map((log) => (log.id === id ? updated : log)));
        return updated;
      } catch (err) {
        setError(
          "Error: " + (err instanceof Error ? err.message : String(err))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a log
  const deleteLog = useCallback(async (id: number) => {
    setLoading(true);
    setError("");
    try {
      await deleteAccommodationLog(id);
      setLogs((prev) => prev.filter((log) => log.id !== id));
      return true;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Export logs (downloads a file)
  const exportLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const blob = await exportAccommodationLogs();
      // Download the file
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "accommodation_logs_export.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      return true;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single log (optional)
  const getLog = useCallback(async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const log = await getAccommodationLog(id);
      return log;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLogByAccommodationId = useCallback(
    async (accommodationId: number) => {
      setLoading(true);
      setError("");
      try {
        const response = await getAccommodationLogByAccommodationId(
          accommodationId
        );
        setLogs(response); // <-- This line updates the logs state!
        console.log("Fetched log by accommodation ID:", response);
        return response;
      } catch (err) {
        setError(
          "Error: " + (err instanceof Error ? err.message : String(err))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    logs,
    loading,
    error,
    fetchLogs,
    createLog,
    updateLog,
    deleteLog,
    exportLogs,
    getLog,
    getLogByAccommodationId,
  };
};
