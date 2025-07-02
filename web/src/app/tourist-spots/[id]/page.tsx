"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import { Label } from "@/components/ui/label";

export default function TouristSpotPage() {
  const { id } = useParams<{ id: string }>();
  const { viewTouristSpot } = useTouristSpotManager();
  const [touristSpot, setTouristSpot] = useState<TouristSpot | null>(null);

  useEffect(() => {
    const fetchSpot = async () => {
      if (id) {
        const spot = await viewTouristSpot(id.toString());
        setTouristSpot(spot);
      }
    };
    fetchSpot();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f1f1f1]">
        {/* Banner */}
        {touristSpot?.images?.[0]?.image_url && (
          <div className="relative pt-24 w-full h-[350px] md:h-[400px] overflow-hidden rounded-b-3xl shadow">
            <img
              src={touristSpot.images[0].image_url}
              alt={touristSpot.name}
              className="object-cover object-center w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg">
                {touristSpot.name}
              </h2>
              <p className="text-lg md:text-xl text-[#e6f7fa] text-center font-semibold drop-shadow-lg">
                {touristSpot.municipality}, {touristSpot.province}
              </p>
            </div>
          </div>
        )}

        <main className="px-4 py-10 max-w-4xl mx-auto space-y-10">
          {/* Bento Images Section */}
          {touristSpot?.images && touristSpot.images.length > 1 && (
            <section>
              <Label className="text-xs uppercase tracking-wider text-[#3e979f] block mb-4">
                Gallery
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {touristSpot.images
                  .slice(0, 2) // Only get the first two images
                  .map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="overflow-hidden rounded-xl border border-[#e6f7fa] bg-[#f8fcfd] h-72"
                    >
                      <img
                        src={img.image_url}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </section>
          )}
          {/* Info Card */}
          {touristSpot && (
            <section>
              <div className="bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-8 space-y-10">
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Column 1 */}
                  <div className="space-y-6 min-w-0">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Type
                      </Label>
                      <div className="text-[#1c5461] font-semibold">
                        {touristSpot.type || (
                          <span className="italic text-[#bda156]">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Opening Hours
                      </Label>
                      <div className="text-[#1c5461]">
                        {touristSpot.opening_time || (
                          <span className="italic text-[#bda156]">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Closing Hours
                      </Label>
                      <div className="text-[#1c5461]">
                        {touristSpot.closing_time || (
                          <span className="italic text-[#bda156]">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Column 2 */}
                  <div className="space-y-6 min-w-0">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Entrance Fee
                      </Label>
                      <div className="text-[#1c5461]">
                        {touristSpot.entrance_fee || (
                          <span className="italic text-[#bda156]">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Contact Number
                      </Label>
                      <div className="text-[#1c5461]">
                        {touristSpot.contact_number || (
                          <span className="italic text-[#bda156]">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Other Fees
                      </Label>
                      <div className="text-[#1c5461]">
                        {touristSpot.other_fees || (
                          <span className="italic text-[#bda156]">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Column 3 */}
                  <div className="space-y-6 min-w-0">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Address
                      </Label>
                      <div className="text-[#1c5461]">
                        {[
                          touristSpot.barangay,
                          touristSpot.municipality,
                          touristSpot.province,
                        ]
                          .filter(Boolean)
                          .join(", ") || (
                          <span className="italic text-[#bda156]">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Location
                      </Label>
                      <div>
                        {touristSpot.location ? (
                          <a
                            href="#"
                            onClick={async (e) => {
                              e.preventDefault();
                              if (!navigator.geolocation) {
                                window.open(
                                  touristSpot.location?.includes(
                                    "google.com/maps"
                                  )
                                    ? touristSpot.location
                                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                        touristSpot.location || ""
                                      )}`,
                                  "_blank"
                                );
                                return;
                              }
                              navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                  // Try to extract lat/lng from Google Maps URL
                                  let destLat, destLng;
                                  const match = touristSpot.location.match(
                                    /@(-?\d+\.\d+),(-?\d+\.\d+)/
                                  );
                                  if (match) {
                                    destLat = match[1];
                                    destLng = match[2];
                                  }
                                  // If not a Google Maps URL with @lat,lng, just use the address string
                                  const destination =
                                    destLat && destLng
                                      ? `${destLat},${destLng}`
                                      : encodeURIComponent(
                                          touristSpot.location
                                        );
                                  const userLat = pos.coords.latitude;
                                  const userLng = pos.coords.longitude;
                                  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination}&travelmode=driving`;
                                  window.open(directionsUrl, "_blank");
                                },
                                () => {
                                  window.open(
                                    touristSpot.location?.includes(
                                      "google.com/maps"
                                    )
                                      ? touristSpot.location
                                      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                          touristSpot.location || ""
                                        )}`,
                                    "_blank"
                                  );
                                }
                              );
                            }}
                            className="inline-block w-full text-center mt-1 bg-[#1c5461] text-white rounded-full px-4 py-2 text-sm font-semibold shadow hover:bg-[#174d57] transition"
                          >
                            View on Maps
                          </a>
                        ) : (
                          <span className="italic text-[#bda156]">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                        Facebook Page
                      </Label>
                      {touristSpot.facebook_page &&
                      touristSpot.facebook_page !== "null" ? (
                        <a
                          href={touristSpot.facebook_page.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0da6ae] hover:underline break-all"
                        >
                          {touristSpot.facebook_page}
                        </a>
                      ) : (
                        <span className="italic text-[#bda156]">N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Full Width Description */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                    Description
                  </Label>
                  <div className="p-6 bg-[#e6f7fa] rounded-xl min-h-[100px] shadow-sm w-full">
                    <p className="text-base text-[#1c5461] whitespace-pre-line">
                      {touristSpot.description || (
                        <span className="italic text-[#bda156]">N/A</span>
                      )}
                    </p>
                  </div>
                </div>
                {/* Full Width Rules */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
                    Rules
                  </Label>
                  <div className="p-6 bg-[#e6f7fa] rounded-xl min-h-[100px] shadow-sm w-full">
                    <div className="text-base text-[#1c5461] whitespace-pre-line">
                      {touristSpot.rules || (
                        <span className="italic text-[#bda156]">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
