import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Cloud, Loader2 } from "lucide-react";
import { useWeather } from "@/hooks/useWeather"; // your custom hook

export default function WeatherWidget() {
  const { weather, loading, error } = useWeather("Bantayan");

  if (loading)
    return (
      <div className="w-full flex justify-center items-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500 mr-2" />
      </div>
    );

  if (error || !weather)
    return (
      <div className="w-full flex justify-center items-center py-8">
        <span className="text-red-500">Weather data not available.</span>
      </div>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full h-10 w-10 p-0 relative hover:bg-white transition-colors group"
        >
          <Cloud className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 bg-transparent border-none shadow-none">
        <div className="bg-white/90 rounded-xl p-4 sm:p-6 min-w-[180px] sm:min-w-[220px] flex flex-col items-center w-full max-w-xs mx-auto border border-blue-200 shadow-lg backdrop-blur-md">
          <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-2 text-center">
            Weather in {weather.location.name}
          </h3>
          <img
            src={weather.current.condition.icon}
            alt="weather icon"
            className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
          />
          <div className="text-sm sm:text-base font-medium mb-1 text-center">
            {weather.current.condition.text}
          </div>
          <div className="text-xs sm:text-sm text-gray-700 mb-1 text-center">
            <span className="font-semibold">Temperature:</span>{" "}
            {weather.current.temp_c}°C
          </div>
          <div className="text-xs sm:text-sm text-gray-700 mb-1 text-center">
            <span className="font-semibold">Humidity:</span>{" "}
            {weather.current.humidity}%
          </div>
          <div className="text-xs sm:text-sm text-gray-700 text-center">
            <span className="font-semibold">Wind:</span>{" "}
            {weather.current.wind_kph} kph
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
