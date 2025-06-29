import { useState, useCallback } from "react";
import {
  createIslandEntryRegistration,
  createOnlineIslandEntry,
  getIslandEntryStatus,
  getTourismFee,
} from "@/lib/api/islandEntry";

import type { RegistrationPayload } from "../app/tourist/regis/island_registration/island_registration";

export function useIslandEntryManager() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegistrationPayload>();
  const [fee, setFee] = useState<{ amount: number; is_enabled: boolean } | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const fetchFee = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTourismFee(); 
      setFee(data); 
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (payload: RegistrationPayload) => {
    setLoading(true);
    try {
      if (
        payload.payment_method === "ONLINE" &&
        payload.groupMembers.length < 3
      ) {
        return {
          error: "Online payment is only allowed for groups of 3 or more.",
        };
      }

      if (payload.payment_method === "ONLINE") {
        const res = await createOnlineIslandEntry(payload);
        setResult(res);
        setPaymentLink(res.payment_link);
        return res;
      } else {
        const res = await createIslandEntryRegistration(payload);
        setResult(res);
        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (uniqueCode: string) => {
    try {
      const res = await getIslandEntryStatus(uniqueCode);
      return res;
    } catch (err) {
      console.error("Failed to fetch payment status:", err);
      return null;
    }
  };

  return {
    loading,
    result,
    fee,
    paymentLink,
    fetchFee,
    register,
    checkPaymentStatus,
  };
}
