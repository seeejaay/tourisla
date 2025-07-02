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
import Image from "next/image";
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
  // General background
  { elementType: "geometry", stylers: [{ color: "#e0f7fa" }] }, // light turquoise
  { elementType: "labels.text.fill", stylers: [{ color: "#008080" }] }, // teal
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },

  // Water
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0077b6" }], // deep cyan blue
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#005f6b" }],
  },

  // Parks and nature
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#b6f5c9" }], // soft mint green
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#388e3c" }],
  },

  // Roads
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#b2ebf2" }], // pale teal
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00897b" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4dd0e1" }], // bright turquoise
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#00bcd4" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#006064" }],
  },

  // Points of Interest
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#b6f5c9" }], // soft mint green
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00796b" }],
  },

  // Landscape
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#009688" }], // rainforest teal-green
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#a7ffeb" }], // spring green
  },

  // Administrative
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#00838f" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#00bcd4" }],
  },

  // Transit
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#b2ebf2" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#80deea" }],
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
            zoom={13}
            options={{
              styles: bantayanMapStyle,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              scrollwheel: false,
              mapTypeId: "terrain",
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
                      <div className="min-w-[240px]">
                        <Image
                          src={spot.images[0].image_url}
                          alt={spot.name}
                          width={240}
                          height={120}
                          className="w-full h-28 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-bold text-lg text-[#1c5461] mb-1">
                          {spot.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-3">
                          {spot.description.length > 60
                            ? spot.description.slice(0, 60) + "..."
                            : spot.description}
                        </p>
                        <div className="bg-gray-50 rounded-md p-2 mb-3 border text-xs">
                          <div>
                            <span className="font-semibold text-gray-700">
                              Barangay:
                            </span>{" "}
                            <span className="text-gray-900">
                              {spot.barangay}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">
                              Category:
                            </span>{" "}
                            <span className="text-[#00aeac] font-semibold">
                              {spot.category}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">
                              Type:
                            </span>{" "}
                            <span className="text-green-700 font-semibold">
                              {spot.type}
                            </span>
                          </div>
                        </div>
                        <a
                          href="#"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!navigator.geolocation) {
                              window.open(spot.location, "_blank");
                              return;
                            }
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                const match = spot.location.match(
                                  /@(-?\d+\.\d+),(-?\d+\.\d+)/
                                );
                                if (!match) {
                                  window.open(spot.location, "_blank");
                                  return;
                                }
                                const destLat = match[1];
                                const destLng = match[2];
                                const userLat = pos.coords.latitude;
                                const userLng = pos.coords.longitude;
                                const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=driving`;
                                window.open(directionsUrl, "_blank");
                              },
                              () => {
                                window.open(spot.location, "_blank");
                              }
                            );
                          }}
                          className="inline-block w-full text-center mt-1 bg-[#1c5461] text-white rounded-full px-4 py-2 text-sm font-semibold shadow hover:bg-[#174d57] transition"
                        >
                          View Route on Google Maps
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
