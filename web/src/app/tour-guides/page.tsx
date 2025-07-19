"use client";

import { useEffect, useState } from "react";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import Image from "next/image";
// Define the TourGuide type based on your data structure
type TourGuide = {
  id: string | number;
  first_name: string;
  last_name: string;
  birth_date: string;
  sex: string;
  mobile_number: string;
  email: string;
  profile_picture: string | null;
  reason_for_applying: string;
  application_status: string;
  created_at: string;
  updated_at: string;
  user_id: string | number;
};

export default function TourGuideVerificationPage() {
  const { fetchAllTourGuideApplicants, loading, error } = useTourGuideManager();
  const [tourGuides, setTourGuides] = useState<TourGuide[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<TourGuide[]>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      const data = await fetchAllTourGuideApplicants();
      setTourGuides(data || []);
    };
    fetchGuides();
  }, [fetchAllTourGuideApplicants]);

  useEffect(() => {
    if (!search) {
      setFiltered(tourGuides);
    } else {
      setFiltered(
        tourGuides.filter((g) =>
          `${g.first_name} ${g.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }
  }, [search, tourGuides]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] py-28">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-8">
          <h1 className="text-2xl font-bold mb-6 text-[#1c5461] text-center">
            Tour Guide Accreditation Checker
          </h1>
          <div className="mb-6">
            <Label htmlFor="search" className="text-[#3e979f] mb-2 block">
              Search Tour Guide Name
            </Label>
            <Input
              id="search"
              placeholder="Enter full name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          {loading && <p className="text-[#1c5461] text-center">Loading...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && !error && (
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-500">
                  No tour guides found.
                </p>
              ) : (
                filtered.map((guide) => (
                  <div
                    key={guide.id}
                    className="flex flex-col md:flex-row md:items-center justify-between bg-[#e6f7fa] rounded-xl p-4 border border-[#bde3e7]"
                  >
                    <div>
                      <span className="inline-block align-middle mr-3 ">
                        <Image
                          src={
                            guide.profile_picture || "/images/maleavatar.png"
                          }
                          alt={`${guide.first_name} ${guide.last_name}`}
                          width={64}
                          height={64}
                          className="rounded-full object-cover border-2 border-[#26a2b8] bg-white"
                          style={{ width: 64, height: 64 }}
                        />
                      </span>
                      <span className="font-semibold text-[#1c5461]">
                        {guide.first_name} {guide.last_name}
                      </span>
                      <span className="block text-sm text-[#3e979f]">
                        {guide.email}
                      </span>
                    </div>
                    <div>
                      {guide.application_status?.toLowerCase() ===
                      "approved" ? (
                        <span className="inline-block mt-2 md:mt-0 px-3 py-1  bg-green-700 text-white font-semibold text-xs rounded-bl-lg rounded-tr-lg">
                          Accredited
                        </span>
                      ) : guide.application_status?.toLowerCase() ===
                        "pending" ? (
                        <span className="inline-block mt-2 md:mt-0 px-3 py-1  bg-orange-400 text-white font-semibold text-xs rounded-bl-lg rounded-tr-lg">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-block mt-2 md:mt-0 px-3 py-1  bg-red-700 text-white font-semibold text-xs rounded-bl-lg rounded-tr-lg">
                          Not Accredited
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
