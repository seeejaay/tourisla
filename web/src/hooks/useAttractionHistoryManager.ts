import { useState, useEffect } from "react";
import { fetchAttractionHistory } from "@/lib/api/attractionHistory";
import type { VisitorLog } from "@/app/(User)/profile/[id]/attraction-history/page"; // Adjust path as needed

export const useAttractionHistoryManager = () => {
  const [history, setHistory] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttractionHistory()
      .then(setHistory)
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  return { history, loading, error };
};