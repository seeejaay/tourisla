import { useState, useCallback } from "react";
import {
  completeBooking,
  // getBookingsByGuide,
  createBooking,
  updateBookingStatus,
  getBookingsByTourist,
  // getBookingsByPackage,
  getBookingById,
  // getFilteredBookingsByTourist,
  cancelBooking,
  getBookingsByOperator as apigetBookingsByOperator,
} from "@/lib/api/booking";
export interface BookingCreateInput {
  scheduled_date: string; // ISO date string
  number_of_guests: number; // number of guests
  total_price: number; // total price
  proof_of_payment: File; // uploaded file
  notes: string; // optional notes
  package_id: string; // package ID (string, could be number if backend expects)
  operator_qr_id: string; // operator QR ID (string, could be number if backend expects)
  payment_method: string; // e.g. "QR"
}
export interface Booking {
  id: number;
  tourist_id: number;
  tour_package_id: number;
  touroperator_id: number;
  package_name: string;
  scheduled_date: string; // ISO date string
  number_of_guests: number;
  total_price: string; // e.g. "800.00"
  proof_of_payment: string; // URL to file
  notes: string;
  status: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  tour_operator_name?: string;
  tour_guides?: { first_name: string; last_name: string }[];
}
// Hook for creating a booking
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (bookingData: BookingCreateInput) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Creating booking with data:", bookingData);
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

// // Hook for fetching bookings by guide
// export function useBookingsByGuide() {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchByGuide = useCallback(async (guideId: string | number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await getBookingsByGuide(guideId);
//       console.log("Fetched bookings by guide:", result);
//       setData(result);
//       return result;
//     } catch (err) {
//       setError(err + "Unknown error");
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { data, fetchByGuide, loading, error };
// }

// Hook for fetching bookings by tourist
export function useBookingsByTourist() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByTourist = useCallback(async (touristId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching bookings for tourist ID:", touristId);
      const result = await getBookingsByTourist(touristId);
      console.log("Fetched bookings by tourist:", result);
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
// export function useBookingsByPackage() {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchByPackage = useCallback(async (packageId: string | number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await getBookingsByPackage(packageId);
//       console.log("Fetched bookings by package:", result);
//       setData(result);
//       return result;
//     } catch (err) {
//       setError(err + "Unknown error");
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { data, fetchByPackage, loading, error };
// }

// Hook for fetching a single booking by ID
export function useBookingById() {
  const [data, setData] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchById = useCallback(async (bookingId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBookingById(bookingId);
      console.log("Fetched booking by ID:", result);
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
// export function useFilteredBookingsByTourist() {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchFiltered = useCallback(
//     async (touristId: string | number, filter: string) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const result = await getFilteredBookingsByTourist(touristId, filter);
//         console.log("Fetched filtered bookings by tourist:", result);
//         setData(result);
//         return result;
//       } catch (err) {
//         setError(err + "Unknown error");
//         setData([]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   return { data, fetchFiltered, loading, error };
// }

export function useBookingsByOperator() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByOperator = useCallback(async (operatorId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apigetBookingsByOperator(operatorId);
      console.log("Fetched bookings by operator:", result);
      setData(result);
      return result;
    } catch (err) {
      setError(err + "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, fetchByOperator, loading, error };
}
