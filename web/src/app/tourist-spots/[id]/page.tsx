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
  const { viewTouristSpot, loading, error } = useTouristSpotManager();
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
      <main className="min-h-screen bg-[#f1f1f1] flex flex-col items-center py-10">
        {loading ? (
          <p className="text-lg text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : touristSpot ? (
          <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-10">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Name
              </Label>
              <span className="text-3xl md:text-4xl font-extrabold text-blue-800 tracking-tight break-words">
                {touristSpot.name}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Column 1 */}
              <div className="space-y-6 min-w-0">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Type
                  </Label>
                  <div>
                    {touristSpot.type || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Opening Hours
                  </Label>
                  <div>
                    {touristSpot.opening_time || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Closing Hours
                  </Label>
                  <div>
                    {touristSpot.closing_time || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              </div>
              {/* Column 2 */}
              <div className="space-y-6 min-w-0">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Entrance Fee
                  </Label>
                  <div>
                    {touristSpot.entrance_fee || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Contact Number
                  </Label>
                  <div>
                    {touristSpot.contact_number || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Other Fees
                  </Label>
                  <div>
                    {touristSpot.other_fees || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              </div>
              {/* Column 3 */}
              <div className="space-y-6 min-w-0">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Address
                  </Label>
                  <div>
                    {[
                      touristSpot.barangay,
                      touristSpot.municipality,
                      touristSpot.province,
                    ]
                      .filter(Boolean)
                      .join(", ") || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Location
                  </Label>
                  <div>
                    {touristSpot.location ? (
                      <a
                        href={touristSpot.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on map
                      </a>
                    ) : (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Facebook Page
                  </Label>
                  {touristSpot.facebook_page ? (
                    <a
                      href={touristSpot.facebook_page.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {touristSpot.facebook_page}
                    </a>
                  ) : (
                    <span className="italic text-muted-foreground">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Description
                </Label>
                <div className="p-6 bg-gray-50 rounded-xl min-h-[100px] shadow-sm">
                  <p className="text-base text-gray-700 whitespace-pre-line">
                    {touristSpot.description || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Rules
                </Label>
                <div className="p-6 bg-gray-50 rounded-xl min-h-[100px] shadow-sm">
                  <div className="text-base text-gray-700 whitespace-pre-line">
                    {touristSpot.rules || (
                      <span className="italic text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Tourist spot not found.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
