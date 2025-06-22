import { useState, useCallback } from "react";
import {
  completeBooking,
  getBookingsByGuide,
  createBooking,
  updateBookingStatus,
  getBookingsByTourist,
  getBookingsByPackage,
  getBookingById,
  getFilteredBookingsByTourist,
  cancelBooking,
} from "@/lib/api/booking";

// Hook for creating a booking
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (bookingData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createBooking(bookingData);
      return result;
    } catch (err) {
      setError(err + "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

// Hook for fetching bookings by guide
export function useBookingsByGuide() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByGuide = useCallback(async (guideId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBookingsByGuide(guideId);
      setData(result);
      return result;
    } catch (err) {
      setError(err + "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, fetchByGuide, loading, error };
}

// Hook for fetching bookings by tourist
export function useBookingsByTourist() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByTourist = useCallback(async (touristId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBookingsByTourist(touristId);
      setData(result);
      return result;
    } catch (err) {
      setError(err + "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, fetchByTourist, loading, error };
}

// Hook for fetching bookings by package
export function useBookingsByPackage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByPackage = useCallback(async (packageId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBookingsByPackage(packageId);
      setData(result);
      return result;
    } catch (err) {
      setError(err + "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, fetchByPackage, loading, error };
}

// Hook for fetching a single booking by ID
export function useBookingById() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchById = useCallback(async (bookingId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBookingById(bookingId);
      setData(result);
      return result;
    } catch (err) {
      setError(err + "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, fetchById, loading, error };
}

// Hook for updating booking status
export function useUpdateBookingStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (bookingId: string | number, status: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateBookingStatus(bookingId, status);
        return result;
      } catch (err) {
        setError(err + "Unknown error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateStatus, loading, error };
}

// Hook for completing a booking
export function useCompleteBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete = useCallback(async (bookingId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await completeBooking(bookingId);
      return result;
    } catch (err) {
      setError(err + "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { complete, loading, error };
}

// Hook for cancelling a booking
export function useCancelBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = useCallback(async (bookingId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cancelBooking(bookingId);
      return result;
    } catch (err) {
      setError(err + "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancel, loading, error };
}

// Hook for fetching filtered bookings by tourist
export function useFilteredBookingsByTourist() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiltered = useCallback(
    async (touristId: string | number, filter: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getFilteredBookingsByTourist(touristId, filter);
        setData(result);
        return result;
      } catch (err) {
        setError(err + "Unknown error");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, fetchFiltered, loading, error };
}
