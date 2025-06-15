import { useState, useEffect } from "react";
import { fetchTripadvisorHotels } from "@/lib/api/tripadvisor";

interface HotelPhoto {
  id: number;
  caption: string;
  images: {
    thumbnail: { url: string };
    small: { url: string };
    medium: { url: string };
    large: { url: string };
    original?: { url: string };
  };
}

interface HotelDetails {
  location_id: string;
  name: string;
  link: string;
  address_obj: {
    street1: string;
    city: string;
    state: string;
    country: string;
    postalcode: string;
    address_string: string;
  };
  photos?: HotelPhoto[]; // Add this line
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
