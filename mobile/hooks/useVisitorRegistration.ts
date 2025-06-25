import { useState, useCallback } from "react";
import type { Visitor } from "@/static/visitor-registration/visitorSchema.js";
import {
  getVisitorGroupMembers as apiGetVisitorGroupMembers,
  registerVisitor as apiRegisterVisitor,
  manualCheckIn as apiManualCheckIn,
  walkInVisitor as apiWalkInVisitor,
  getVisitorResult as apiGetVisitorResult,
  getQRCodebyUserId as apiGetQRCodebyUserId,
} from "@/lib/api/visitorRegistration";

export const useVisitorRegistration = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch group members by groupId
  const fetchVisitorGroupMembers = useCallback(
    async (groupId: number | string): Promise<Visitor[] | null> => {
      setLoading(true);
      setError("");
      try {
        const data = await apiGetVisitorGroupMembers(groupId);
        setVisitors(data);
        return data;
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

  // Register a new visitor
  const createVisitor = useCallback(
    async (
      visitors: Partial<Visitor>[]
    ): Promise<{ visitors: Visitor[] } | null> => {
      setLoading(true);
      setError("");
      try {
        console.log("Creating visitors with data:", visitors);
        const response = await apiRegisterVisitor(visitors); // expects array

        if (response.visitors && Array.isArray(response.visitors)) {
          setVisitors((prev) => [...prev, ...response.visitors]);
        }
        return response;
      } catch (error) {
        setError(
          "An error occurred while registering the visitor." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Manual check-in for a visitor
  const checkInVisitor = useCallback(
    async (visitorId: number): Promise<boolean> => {
      setLoading(true);
      setError("");
      try {
        await apiManualCheckIn(visitorId);
        return true;
      } catch (error) {
        setError(
          "An error occurred while checking in the visitor." +
            (error instanceof Error ? error.message : String(error))
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Register a walk-in visitor
  const registerWalkInVisitor =
    useCallback(async (): Promise<Visitor | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiWalkInVisitor();
        setVisitors((prev) => [...prev, response]);
        return response;
      } catch (error) {
        setError(
          "An error occurred while registering a walk-in visitor." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  const getVisitorResultByCode = useCallback(async (uniqueCode: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await apiGetVisitorResult(uniqueCode);
      return result;
    } catch (err) {
      setError(
        "Error fetching registration result: " +
          (err instanceof Error ? err.message : String(err))
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQRCodebyUserId = useCallback(
    async (
      userId: number
    ): Promise<{ qr_code_url: string; unique_code?: string } | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiGetQRCodebyUserId(userId);
        console.log(response); // If response is just a string, return as qr_code_url

        if (typeof response === "string") {
          return { qr_code_url: response };
        }
        // If response is an object with qr_code_url and maybe unique_code
        if (response && response.qr_code_url) {
          return {
            qr_code_url: response.qr_code_url,
            unique_code: response.unique_code, // will be undefined if not present
          };
        }
        setError("QR code not found.");
        return null;
      } catch (err) {
        setError(
          "Error fetching QR code: " +
            (err instanceof Error ? err.message : String(err))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    visitors,
    loading,
    error,
    fetchVisitorGroupMembers,
    createVisitor,
    checkInVisitor,
    registerWalkInVisitor,
    setVisitors,
    getVisitorResultByCode,
    getQRCodebyUserId,
  };
};
