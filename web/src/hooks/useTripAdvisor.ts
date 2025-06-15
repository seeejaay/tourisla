import { useState, useEffect } from "react";
import fetchTripadvisorHotels from "@/lib/api/tripadvisor";

interface HotelDetails {
  name: string;
  link: string;
  thumbnail_url: string;
  latitude: number;
  longitude: number;
}

export const useTripAdvisor = (location = "Bantayan Island") => {
  const [hotels, setHotels] = useState<HotelDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getHotels = async () => {
      setLoading(true);
      try {
        const data: HotelDetails[] = await fetchTripadvisorHotels();
        setHotels(data);
        setError(null);
      } catch (error) {
        setError(error as Error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    getHotels();
  }, [location]);

  return { hotels, loading, error };
};
export default useTripAdvisor;
