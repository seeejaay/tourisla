"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import Header from "@/components/custom/header";
import Image from "next/image";
import { Users } from "lucide-react";
import Footer from "@/components/custom/footer";
type TourPackage = {
  id: number;
  package_name: string;
  location: string;
  price: number;
  description: string;
  inclusions: string;
  exclusions: string;
  available_slots: number;
  date_start: string;
  date_end: string;
  // Add other fields if needed
};

export default function ViewTourPackagePage() {
  const router = useRouter();
  const params = useParams();

  const { fetchAllTourPackages } = useTourPackageManager();
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackage() {
      setLoading(true);
      try {
        const allPackages = await fetchAllTourPackages();
        const pkg = allPackages[parseInt(params.id as string, 10)];

        setTourPackage(pkg || null);
      } catch (error) {
        console.error("Error fetching tour package:", error);
        setTourPackage(null);
      }
      setLoading(false);
    }

    fetchPackage();
  }, [params.id, fetchAllTourPackages]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen flex flex-col items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      </>
    );
  }

  if (!tourPackage) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen flex flex-col items-center justify-center">
          <p className="text-gray-500">Tour package not found.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 cursor-pointer text-white rounded"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full pt-20 min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#fffff1] to-[#b6e0e4] pb-20">
        {/* Hero Section */}
        <section className="relative h-72 flex items-center justify-center overflow-hidden mb-10">
          <Image
            src="/images/article_image.webp"
            alt="Tour Packages Hero"
            fill
            className="object-cover object-center brightness-[40%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c5461]/80 via-[#1c5461]/40 to-transparent z-10" />
          <div className="relative z-20 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl mb-3">
              {tourPackage.package_name}
            </h1>
            <p className="text-lg md:text-xl text-[#e6f7fa] drop-shadow-md max-w-2xl mx-auto">
              {tourPackage.location}
            </p>
          </div>
        </section>

        {/* Details Card */}
        <section className="flex justify-center items-start w-full px-4">
          <div className="max-w-xl w-full bg-white/90 rounded-2xl shadow-2xl border border-[#e6f7fa] overflow-hidden">
            {/* Package Image */}
            <div className="relative w-full h-56 sm:h-72">
              <Image
                src="/images/article_image.webp"
                alt={tourPackage.package_name}
                fill
                className="object-cover object-center rounded-t-2xl"
                priority
              />
              <div className="absolute top-2 left-2 bg-[#3e979f]/80 text-white text-xs px-3 py-1 rounded-full shadow">
                {tourPackage.tour_guides && tourPackage.tour_guides.length > 0
                  ? tourPackage.tour_guides
                      .map((g) => `${g.first_name} ${g.last_name}`.trim())
                      .join(", ")
                  : "Tour Guide"}
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ₱
                  {Number(tourPackage.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-gray-400 text-sm">per person</span>
              </div>
              <p className="text-gray-700 mb-6">{tourPackage.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <span className="font-semibold text-blue-700">
                    Inclusions:
                  </span>
                  <p className="text-gray-600 text-sm mt-1">
                    {tourPackage.inclusions}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <span className="font-semibold text-red-700">
                    Exclusions:
                  </span>
                  <p className="text-gray-600 text-sm mt-1">
                    {tourPackage.exclusions}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <span className="font-semibold text-green-700">
                    Available Slots:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-[#3e979f]" />
                    <span className="text-gray-600 text-sm">
                      {tourPackage.available_slots}
                    </span>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <span className="font-semibold text-yellow-700">
                    Schedule:
                  </span>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(tourPackage.date_start).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" }
                    )}{" "}
                    &rarr;{" "}
                    {new Date(tourPackage.date_end).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                </div>
              </div>
              {/* Tour Guides Section */}
              {tourPackage.tour_guides &&
                tourPackage.tour_guides.length > 0 && (
                  <div className="mb-6">
                    <span className="font-semibold text-[#1c5461]">
                      Assigned Tour Guide
                      {tourPackage.tour_guides.length > 1 ? "s" : ""}:
                    </span>
                    <p className="text-gray-800 mt-1">
                      {tourPackage.tour_guides
                        .map((g) => `${g.first_name} ${g.last_name}`.trim())
                        .join(", ")}
                    </p>
                  </div>
                )}
              <button
                className={`w-full px-6 py-3 rounded-lg font-semibold shadow transition mb-2 ${
                  tourPackage.available_slots === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3e979f] cursor-pointer hover:bg-[#1c5461] text-white"
                }`}
                onClick={() =>
                  router.push(`/tour-packages/${tourPackage.id}/book`)
                }
                disabled={tourPackage.available_slots === 0}
              >
                {tourPackage.available_slots === 0
                  ? "Fully Booked"
                  : "Book Now"}
              </button>
              <button
                className="w-full px-6 py-2 cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-semibold shadow transition"
                onClick={() => router.back()}
              >
                ← Back to Packages
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
