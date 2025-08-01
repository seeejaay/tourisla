import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Cloud, Loader2, Ban } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import Image from "next/image";
export default function WeatherWidget() {
  const { weather, loading, error } = useWeather("Bantayan");

  if (loading)
    return (
      <div className="w-full flex justify-center items-center">
        <Loader2 className="animate-spin w-6 h-6 text-[#3e979f] mr-2" />
      </div>
    );

  if (error || !weather)
    return (
      <div className="rounded-full h-10 w-10 p-0 relative flex items-center justify-center bg-red-100">
        <Ban className="text-red-600 w-4 h-4" />
      </div>
    );
  function fixImageUrl(url: string) {
    if (url.startsWith("//")) {
      return "https:" + url;
    }
    return url;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full h-10 w-10 p-0 relative hover:bg-[#3e979f]/10 transition-colors group"
        >
          <Cloud className="w-4 h-4 text-[#1c5461] group-hover:text-[#3e979f] transition" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 bg-transparent border-none shadow-none">
        <div className="bg-white rounded-xl p-4 sm:p-6 min-w-[180px] sm:min-w-[220px] flex flex-col items-center w-full max-w-xs mx-auto border border-[#3e979f] shadow-lg backdrop-blur-md">
          <h3 className="text-base sm:text-lg font-semibold text-[#1c5461] mb-2 text-center">
            Weather in {weather.location.name}
          </h3>
          <Image
            width={50}
            height={50}
            src={fixImageUrl(weather.current.condition.icon)}
            alt="weather icon"
            className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
          />
          <div className="text-sm sm:text-base font-semibold mb-1 text-center text-[#3e979f]">
            {weather.current.condition.text}
          </div>
          <div className="text-xs sm:text-sm text-[#1c5461] mb-1 text-center">
            <span className="font-semibold">Temperature:</span>{" "}
            {weather.current.temp_c}°C
          </div>
          <div className="text-xs sm:text-sm text-[#1c5461] mb-1 text-center">
            <span className="font-semibold">Humidity:</span>{" "}
            {weather.current.humidity}%
          </div>
          <div className="text-xs sm:text-sm text-[#1c5461] text-center">
            <span className="font-semibold">Wind:</span>{" "}
            {weather.current.wind_kph} kph
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
