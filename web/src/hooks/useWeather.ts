import { useState, useEffect } from "react";
import { fetchWeather } from "@/lib/api/weather";

// Define TypeScript interfaces based on the WeatherAPI.com response
interface WeatherCondition {
  text: string;
  icon: string;
}

interface WeatherCurrent {
  temp_c: number;
  humidity: number;
  wind_kph: number;
  condition: WeatherCondition;
}

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
}

export interface WeatherData {
  location: WeatherLocation;
  current: WeatherCurrent;
}

export const useWeather = (location = "Bantayan") => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      try {
        const data: WeatherData = await fetchWeather(location);
        setWeather(data);
        setError(null);
      } catch (err: any) {
        setError(err);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, [location]);

  return { weather, loading, error };
};
