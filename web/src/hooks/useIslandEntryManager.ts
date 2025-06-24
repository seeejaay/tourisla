import { useState } from "react";
import { createIslandEntryRegistration, getTourismFee } from "../lib/api/islandEntry";

export function useIslandEntryManager() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fee, setFee] = useState<number | null>(null);

  const fetchFee = async () => {
    setLoading(true);
    try {
      const data = await getTourismFee();
      setFee(Number(data.amount));
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: any) => {
    setLoading(true);
    try {
      const res = await createIslandEntryRegistration(payload);
      setResult(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, fee, fetchFee, register };
}