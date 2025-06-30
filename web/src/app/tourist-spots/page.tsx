"use client";
import { useEffect, useState } from "react";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
export default function TouristSpotsPage() {
  const { touristSpots, loading, error, fetchTouristSpots } =
    useTouristSpotManager();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTouristSpots();
  }, [fetchTouristSpots]);

  const filteredSpots = touristSpots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(search.toLowerCase()) ||
      (spot.municipality &&
        spot.municipality.toLowerCase().includes(search.toLowerCase())) ||
      (spot.description &&
        spot.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b pt-28 from-[#e6f7fa] to-white flex flex-col items-center py-10 px-2">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-[#e6f7fa] p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-[#1c5461] text-center">
            Tourist Spots
          </h1>
          <input
            type="text"
            placeholder="Search by name, municipality, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-8 px-4 py-2 border border-[#3e979f] rounded-lg focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
          />
          {loading && (
            <div className="text-center text-blue-600 mb-4">
              Loading tourist spots...
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 mb-4">{error}</div>
          )}
          {filteredSpots.length === 0 && !loading ? (
            <div className="text-center text-gray-500">
              No tourist spots found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="flex flex-col bg-[#f8fcfd] border border-[#e6f7fa] rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                    {spot.images &&
                    spot.images.length > 0 &&
                    spot.images[0].image_url ? (
                      <img
                        src={spot.images[0].image_url}
                        alt={spot.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-400">No image available</span>
                    )}
                    {spot.images && spot.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {spot.images.slice(0, 3).map((img, idx) => (
                          <img
                            key={img.id}
                            src={img.image_url}
                            alt={`Preview ${idx + 1}`}
                            className="w-8 h-8 object-cover rounded border border-white shadow"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-bold text-[#1c5461] text-lg mb-1">
                      {spot.name}
                    </div>
                    <div className="text-xs text-[#3e979f] font-semibold mb-1 uppercase tracking-wide">
                      {spot.type} {spot.category && `· ${spot.category}`}
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      {spot.municipality}, {spot.province}
                    </div>
                    {spot.description && (
                      <div className="text-gray-500 text-xs mb-2 line-clamp-3">
                        {spot.description}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {spot.location && (
                        <a
                          href={spot.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-xs"
                        >
                          View on Map
                        </a>
                      )}
                      {spot.facebook_page && spot.facebook_page !== "null" && (
                        <a
                          href={spot.facebook_page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-xs"
                        >
                          Facebook
                        </a>
                      )}
                      {spot.contact_number &&
                        spot.contact_number !== "null" && (
                          <a
                            href={`tel:${spot.contact_number}`}
                            className="text-green-700 underline text-xs"
                          >
                            Call
                          </a>
                        )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {spot.entrance_fee && spot.entrance_fee !== "0" && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          Entrance Fee: ₱{spot.entrance_fee}
                        </span>
                      )}
                      {spot.other_fees && spot.other_fees !== "NONE" && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Other Fees: {spot.other_fees}
                        </span>
                      )}
                    </div>
                    {spot.rules && (
                      <div className="mt-2 text-[11px] text-gray-400 italic">
                        Rules: {spot.rules}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
