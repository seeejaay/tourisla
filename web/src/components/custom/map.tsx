import { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Helper to extract coordinates from a Google Maps URL
function extractLatLng(url: string): { lat: number; lng: number } | null {
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return null;
}

// Map style
const bantayanMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4b6878" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64779e" }],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4b6878" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334e87" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#023e58" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#283d6a" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f9ba5" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#023e58" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3C7680" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#304a7d" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2c6675" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#255763" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#b0d5ce" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#023e58" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [{ color: "#283d6a" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#3a4762" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e6d70" }],
  },
];

const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "1rem",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
};

const bantayanCoords = { lat: 11.1667, lng: 123.7228 };

export default function MapPage() {
  const { touristSpots, fetchTouristSpots, loading, error } =
    useTouristSpotManager();

  const [barangay, setBarangay] = useState<string>("__all_barangays__");
  const [category, setCategory] = useState<string>("__all_categories__");
  const [type, setType] = useState<string>("__all_types__");
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);

  useEffect(() => {
    fetchTouristSpots();
  }, [fetchTouristSpots]);

  const filteredSpots = useMemo(() => {
    return touristSpots.filter((spot) => {
      return (
        (barangay === "__all_barangays__" || spot.barangay === barangay) &&
        (category === "__all_categories__" || spot.category === category) &&
        (type === "__all_types__" || spot.type === type)
      );
    });
  }, [touristSpots, barangay, category, type]);

  const center = bantayanCoords;

  const barangays = Array.from(new Set(touristSpots.map((s) => s.barangay)));
  const categories = Array.from(new Set(touristSpots.map((s) => s.category)));
  const types = Array.from(new Set(touristSpots.map((s) => s.type)));

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label
            htmlFor="barangay"
            className="text-gray-700 text-sm font-semibold"
          >
            Barangay
          </Label>
          <Select value={barangay} onValueChange={setBarangay}>
            <SelectTrigger
              id="barangay"
              className="w-full bg-gray-50 border-gray-200"
            >
              <SelectValue placeholder="All Barangays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all_barangays__">All Barangays</SelectItem>
              {barangays
                .filter((b) => b && b !== "")
                .map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="category"
            className="text-gray-700 text-sm font-semibold"
          >
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              id="category"
              className="w-full bg-gray-50 border-gray-200"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all_categories__">All Categories</SelectItem>
              {categories
                .filter((c) => c && c !== "")
                .map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type" className="text-gray-700 text-sm font-semibold">
            Type
          </Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger
              id="type"
              className="w-full bg-gray-50 border-gray-200"
            >
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all_types__">All Types</SelectItem>
              {types
                .filter((t) => t && t !== "")
                .map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Map */}
      <div className="relative  overflow-hidden shadow-lg border border-gray-200 w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 ">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
            <span className="ml-2 text-lg font-medium">Loading...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-red-50 ">
            <span className="text-red-600 font-semibold">{error}</span>
          </div>
        )}
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
              styles: bantayanMapStyle,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              scrollwheel: false,
            }}
          >
            {/* Bantayan Island Pin */}
            <Marker position={bantayanCoords} title="Bantayan Island" />
            {/* Tourist Spots Pins */}
            {filteredSpots.map((spot) => {
              const coords = extractLatLng(spot.location);
              if (!coords) return null;
              return (
                <Marker
                  key={spot.id}
                  position={coords}
                  onClick={() => setSelectedSpotId(spot.id)}
                >
                  {selectedSpotId === spot.id && (
                    <InfoWindow onCloseClick={() => setSelectedSpotId(null)}>
                      <div className="p-2 min-w-[220px]">
                        <h4 className="font-semibold text-lg mb-1">
                          {spot.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {spot.description}
                        </p>
                        <div className="text-xs mb-2">
                          <span className="block">
                            <span className="font-medium">Barangay:</span>{" "}
                            {spot.barangay}
                          </span>
                          <span className="block">
                            <span className="font-medium">Category:</span>{" "}
                            {spot.category}
                          </span>
                          <span className="block">
                            <span className="font-medium">Type:</span>{" "}
                            {spot.type}
                          </span>
                        </div>
                        <a
                          href={spot.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-1 text-primary underline text-sm"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
