import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// TYPE BADGE COLORS
const typeBadgeColors: Record<string, string> = {
  BEACH: "bg-blue-100 text-blue-700",
  ADVENTURE: "bg-orange-100 text-orange-700",
  CAMPING: "bg-green-100 text-green-700",
  CULTURAL: "bg-purple-100 text-purple-700",
  HISTORICAL: "bg-yellow-100 text-yellow-700",
  NATURAL: "bg-emerald-100 text-emerald-700",
  RECREATIONAL: "bg-cyan-100 text-cyan-700",
  RELIGIOUS: "bg-rose-100 text-rose-700",
  OTHERS: "bg-gray-100 text-gray-600",
};

function SpotPopupContent({
  spot,
  destLat,
  destLng,
}: {
  spot: string;
  destLat: number;
  destLng: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetDirections = () => {
    if (!navigator.geolocation) {
      // Fallback: open destination only
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`,
        "_blank",
      );
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const { latitude, longitude } = position.coords;
        window.open(
          `https://www.google.com/maps/dir/${latitude},${longitude}/${destLat},${destLng}`,
          "_blank",
        );
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access denied. Opening destination only.");
          setTimeout(() => setError(""), 3000);
        }
        // Fallback: open destination only
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`,
          "_blank",
        );
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const imageUrl = spot.images?.[0]?.image_url;
  const badgeClass = typeBadgeColors[spot.type] ?? typeBadgeColors["OTHERS"];

  return (
    <div className="font-sans w-56 overflow-hidden">
      {/* Spot image */}
      {imageUrl && (
        <div className="relative -mx-[12px] -mt-[12px] mb-3 h-32 overflow-hidden rounded-t-md">
          <img
            src={imageUrl}
            alt={spot.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Type badge */}
      {spot.type && (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide mb-1 ${badgeClass}`}
        >
          {spot.type}
        </span>
      )}

      {/* Name */}
      <h4 className="font-bold text-[#1c5461] text-sm leading-snug mb-0.5">
        {spot.name}
      </h4>

      {/* Barangay */}
      {spot.barangay && (
        <p className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
          <svg
            className="inline w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {spot.barangay}
        </p>
      )}

      {/* Description */}
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        {spot.description?.slice(0, 80)}
        {spot.description?.length > 80 ? "…" : ""}
      </p>

      {/* Error message */}
      {error && (
        <p className="text-[10px] text-amber-600 bg-amber-50 rounded px-2 py-1 mb-2">
          {error}
        </p>
      )}

      {/* Get Directions button */}
      <button
        onClick={handleGetDirections}
        disabled={loading}
        className="w-full flex items-center justify-center gap-1.5 bg-[#1c5461] hover:bg-[#154250] active:scale-95 text-white rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Getting location…
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
            </svg>
            Get Directions
          </>
        )}
      </button>
    </div>
  );
}

export default function MapDisplay({ touristSpots = [] }) {
  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const bantayanCoords: [number, number] = [11.1667, 123.7167];

  const extractLatLng = (url: string) => {
    if (!url) return null;
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = url.match(regex);
    return match
      ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
      : null;
  };

  return (
    <MapContainer
      center={bantayanCoords}
      zoom={13}
      style={{ height: "600px", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {touristSpots.map((spot) => {
        const coords = extractLatLng(spot.location);
        if (!coords) return null;

        return (
          <Marker key={spot.id} position={[coords.lat, coords.lng]}>
            <Popup minWidth={224}>
              <SpotPopupContent
                spot={spot}
                destLat={coords.lat}
                destLng={coords.lng}
              />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
