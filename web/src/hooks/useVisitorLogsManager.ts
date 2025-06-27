import {
  exportVisitorLogs,
  exportVisitorLogsSummary,
  getVisitorLogsWithSpotName,
} from "@/lib/api/visitor_logs";

import { useCallback, useState } from "react";

export function useVisitorLogsManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportLogs = useCallback(
    async (params: { from: string; to: string; tourist_spot_id?: string }) => {
      setLoading(true);
      setError(null);
      try {
        console.log("Exporting visitor logs with params");
        const result = await exportVisitorLogs(params);
        console.log("Exported visitor logs");
        return result;
      } catch (err) {
        setError(String(err) + " Unknown error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const exportSummary = useCallback(
    async (params: { from: string; to: string; tourist_spot_id?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await exportVisitorLogsSummary(params);
        return result;
      } catch (err) {
        setError(String(err) + " Unknown error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAllVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getVisitorLogsWithSpotName();
      console.log("Fetched visitor logs with spot names");
      return result;
    } catch (err) {
      setError(String(err) + " Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportLogs, exportSummary, loading, error, fetchAllVisitors };
}
