"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TourPackagesPage() {
  type TourGuide = {
    tourguide_id: number;
    first_name: string;
    last_name: string;
  };

  type TourPackage = {
    package_name: string;
    location: string;
    price: number;
    description: string;
    inclusions: string;
    exclusions: string;
    available_slots: number;
    date_start: string;
    date_end: string;
    guide_name?: string; // for backward compatibility
    image_url?: string;
    tour_guides?: TourGuide[];
  };

  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [filteredGuide, setFilteredGuide] = useState<string>("All");
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const { fetchAllTourPackages } = useTourPackageManager();
  const router = useRouter();

  useEffect(() => {
    async function fetchTourPackages() {
      try {
        const tourPackages = await fetchAllTourPackages();
        setTourPackages(Array.isArray(tourPackages) ? tourPackages : []);
        // Extract unique tour guides for filter
        const allGuides: TourGuide[] = [];
        (tourPackages || []).forEach((pkg: TourPackage) => {
          if (pkg.tour_guides && Array.isArray(pkg.tour_guides)) {
            pkg.tour_guides.forEach((g) => {
              if (
                g &&
                g.tourguide_id &&
                !allGuides.some((ag) => ag.tourguide_id === g.tourguide_id)
              ) {
                allGuides.push(g);
              }
            });
          } else if (pkg.guide_name) {
            // fallback for old data
            if (
              !allGuides.some(
                (ag) => ag.first_name + " " + ag.last_name === pkg.guide_name
              )
            ) {
              allGuides.push({
                tourguide_id: -1,
                first_name: pkg.guide_name,
                last_name: "",
              });
            }
          }
        });
        setGuides(allGuides);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching tour packages:", error);
      }
    }

    fetchTourPackages();
  }, [fetchAllTourPackages]);

  // Filtered packages by guide
  const displayedPackages =
    filteredGuide === "All"
      ? tourPackages
      : tourPackages.filter(
          (pkg) =>
            pkg.tour_guides &&
            pkg.tour_guides.some(
              (g) => `${g.first_name} ${g.last_name}` === filteredGuide
            )
        );

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
              Explore Tour Packages
            </h1>
            <p className="text-lg md:text-xl text-[#e6f7fa] drop-shadow-md max-w-2xl mx-auto">
              Discover exclusive Bantayan Island adventures with our trusted
              tour guides.
            </p>
          </div>
        </section>

        {/* Filter by Tour Guide */}
        <section className="max-w-4xl mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <span className="text-[#1c5461] font-semibold">
              Filter by Tour Guide:
            </span>
            <button
              className={`px-4 py-2 rounded-full border font-medium transition ${
                filteredGuide === "All"
                  ? "bg-[#3e979f] text-white border-[#3e979f]"
                  : "bg-white text-[#3e979f] border-[#3e979f] hover:bg-[#e6f7fa]"
              }`}
              onClick={() => setFilteredGuide("All")}
            >
              All
            </button>
            {guides.map((guide) => {
              const guideFullName =
                `${guide.first_name} ${guide.last_name}`.trim();
              return (
                <button
                  key={guide.tourguide_id + guideFullName}
                  className={`px-4 py-2 rounded-full border font-medium transition ${
                    filteredGuide === guideFullName
                      ? "bg-[#3e979f] text-white border-[#3e979f]"
                      : "bg-white text-[#3e979f] border-[#3e979f] hover:bg-[#e6f7fa]"
                  }`}
                  onClick={() => setFilteredGuide(guideFullName)}
                >
                  {guideFullName}
                </button>
              );
            })}
          </div>
        </section>

        {/* Packages Grid */}
        <section className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-8 justify-center">
            {displayedPackages.map((pkg, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between h-full mb-6 w-full sm:w-[48%] lg:w-[31%] min-w-[260px] max-w-xs bg-white/90 border border-[#e6f7fa] rounded-2xl overflow-hidden pt-0 pb-4"
              >
                {/* Package Image */}
                <div className="relative h-40 w-full">
                  <Image
                    src="/images/article_image.webp"
                    alt={pkg.package_name}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                  <div className="absolute top-2 left-2 bg-[#3e979f]/80 text-white text-xs px-3 py-1 rounded-full shadow">
                    {pkg.tour_guides && pkg.tour_guides.length > 0
                      ? pkg.tour_guides
                          .map((g) => `${g.first_name} ${g.last_name}`.trim())
                          .join(", ")
                      : pkg.guide_name || "Tour Guide"}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#1c5461]">
                    {pkg.package_name}
                  </CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide text-[#3e979f]">
                    {pkg.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-h-32 flex flex-col gap-2">
                  <p className="text-[#51702c] font-semibold">
                    Price:{" "}
                    <span className="text-[#1c5461]">&#8369; {pkg.price}</span>
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {pkg.description.charAt(0).toUpperCase() +
                      pkg.description.slice(1).toLowerCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-4 h-4 text-[#3e979f]" />
                    <span className="text-xs text-[#3e979f]">
                      {pkg.available_slots} slots available
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <button
                    onClick={() => router.push(`/tour-packages/${index}`)}
                    className="bg-[#3e979f] text-white px-4 py-2 rounded-lg hover:bg-[#1c5461] transition-colors duration-300 w-full font-semibold"
                  >
                    View Details
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {displayedPackages.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              No tour packages available at the moment.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
