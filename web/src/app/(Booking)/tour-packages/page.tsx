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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

export default function TourPackagesPage() {
  type TourGuide = {
    tourguide_id: number;
    first_name: string;
    last_name: string;
  };

  type TourPackage = {
    id?: number;
    package_name: string;
    location: string;
    price: number;
    description: string;
    inclusions: string;
    exclusions: string;
    available_slots: number;
    date_start: string;
    date_end: string;
    start_time?: string;
    end_time?: string;
    guide_name?: string;
    image_url?: string;
    assigned_guides?: TourGuide[];
    operator_name?: string;
    is_active?: boolean;
  };

  type RawTourGuide = string | TourGuide;

  type RawTourPackage = Omit<TourPackage, "assigned_guides"> & {
    assigned_guides?: RawTourGuide[];
  };

  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [filteredGuide, setFilteredGuide] = useState<string>("All");
  const [filteredLocation, setFilteredLocation] = useState<string>("All");
  const [filteredOperator, setFilteredOperator] = useState<string>("All");
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const packagesPerPage = 6;
  const { fetchAllTourPackages } = useTourPackageManager();
  const router = useRouter();

  useEffect(() => {
    async function fetchTourPackages() {
      try {
        const rawPackages: RawTourPackage[] = await fetchAllTourPackages();
        // Map assigned_guides from string[] to TourGuide[]
        const tourPackages: TourPackage[] = (rawPackages || []).map((pkg) => ({
          ...pkg,
          assigned_guides: Array.isArray(pkg.assigned_guides)
            ? pkg.assigned_guides.map((g, idx) =>
                typeof g === "string"
                  ? {
                      tourguide_id: idx, // or another unique value
                      first_name: g,
                      last_name: "",
                    }
                  : g
              )
            : [],
        }));
        setTourPackages(tourPackages);

        // Extract unique guides for filter buttons
        const allGuides: TourGuide[] = [];
        tourPackages.forEach((pkg) => {
          pkg.assigned_guides?.forEach((g) => {
            if (
              g.first_name &&
              !allGuides.some(
                (ag) =>
                  ag.first_name === g.first_name && ag.last_name === g.last_name
              )
            ) {
              allGuides.push(g);
            }
          });
        });
        setGuides(allGuides);
      } catch (error) {
        console.error("Error fetching tour packages:", error);
      }
    }

    fetchTourPackages();
  }, [fetchAllTourPackages]);

  // Extract unique locations and operators for filters
  const locations = Array.from(
    new Set(tourPackages.map((pkg) => pkg.location))
  );
  const operators = Array.from(
    new Set(tourPackages.map((pkg) => pkg.operator_name).filter(Boolean))
  );

  // Filtered packages by guide, location, and operator
  const today = new Date();
  const displayedPackages = tourPackages.filter((pkg) => {
    const guideMatch =
      filteredGuide === "All" ||
      (pkg.assigned_guides &&
        pkg.assigned_guides.some(
          (g) => `${g.first_name} ${g.last_name}`.trim() === filteredGuide
        ));
    const locationMatch =
      filteredLocation === "All" || pkg.location === filteredLocation;
    const operatorMatch =
      filteredOperator === "All" || pkg.operator_name === filteredOperator;
    const searchMatch =
      searchTerm.trim() === "" ||
      pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Only show active packages that haven't passed the current date
    const isActive = pkg.is_active === true;
    const endDate = new Date(pkg.date_end);
    const notExpired = endDate >= today;

    return (
      guideMatch &&
      locationMatch &&
      operatorMatch &&
      searchMatch &&
      isActive &&
      notExpired
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(displayedPackages.length / packagesPerPage);
  const paginatedPackages = displayedPackages.slice(
    (currentPage - 1) * packagesPerPage,
    currentPage * packagesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredGuide, filteredLocation, filteredOperator, searchTerm]);

  const toTitleCase = (str: string) => {
    return str
      .split(" ")
      .map((word) =>
        word.length > 0
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : ""
      )
      .join(" ");
  };

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

        <section className="w-full flex flex-col  items-center justify-center px-4  ">
          {/* Search Bar */}
          <div className=" flex justify-center w-full max-w-md sm:max-w-2xl  ">
            <input
              type="text"
              placeholder="Search tour packages..."
              className="w-full  px-4 py-2 rounded-lg border border-[#3e979f] text-[#1c5461] bg-white focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center py-6">
            {/* Location Filter */}
            <div className="w-56">
              <label
                className="block text-[#1c5461] font-semibold mb-1"
                htmlFor="location-filter"
              >
                Filter by Location:
              </label>
              <select
                id="location-filter"
                className="w-full px-4 py-2 rounded-lg border border-[#3e979f] text-[#1c5461] bg-white focus:outline-none"
                value={filteredLocation}
                onChange={(e) => setFilteredLocation(e.target.value)}
              >
                <option value="All">All</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Operator Filter */}
            <div className="w-56">
              <label
                className="block text-[#1c5461] font-semibold mb-1"
                htmlFor="operator-filter"
              >
                Filter by Operator:
              </label>
              <select
                id="operator-filter"
                className="w-full px-4 py-2 rounded-lg border border-[#3e979f] text-[#1c5461] bg-white focus:outline-none"
                value={filteredOperator}
                onChange={(e) => setFilteredOperator(e.target.value)}
              >
                <option value="All">All</option>
                {operators.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>

            {/* Tour Guide Filter */}
            <div className="w-56">
              <label
                className="block text-[#1c5461] font-semibold mb-1"
                htmlFor="guide-filter"
              >
                Filter by Tour Guide:
              </label>
              <select
                id="guide-filter"
                className="w-full px-4 py-2 rounded-lg border border-[#3e979f] text-[#1c5461] bg-white focus:outline-none"
                value={filteredGuide}
                onChange={(e) => setFilteredGuide(e.target.value)}
              >
                <option value="All">All</option>
                {guides.map((guide) => {
                  const guideFullName =
                    `${guide.first_name} ${guide.last_name}`.trim();
                  return (
                    <option
                      key={guide.tourguide_id + guideFullName}
                      value={guideFullName}
                    >
                      {guideFullName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </section>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center my-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Packages Grid */}
        <section className="w-full flex items-center justify-center px-4">
          <div className="max-w-7xl w-full">
            <div className="flex flex-wrap gap-8 justify-center ">
              {paginatedPackages.map((pkg, index) => (
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
                    <div className="absolute top-2 left-2 bg-[#3e979f] text-white text-sm px-3 py-1 rounded-full shadow">
                      {toTitleCase(pkg.operator_name || "Operator")}
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
                    {pkg.assigned_guides && pkg.assigned_guides.length > 0 && (
                      <div className="flex flex-wrap gap-2 items-center mb-2">
                        <span className="text-xs text-[#3e979f] font-semibold">
                          Guides:
                        </span>
                        {pkg.assigned_guides.map((g, i) => (
                          <span
                            key={g.tourguide_id || i}
                            className="bg-[#e6f7fa] text-[#1c5461] px-2 py-0.5 rounded-full text-xs font-medium"
                          >
                            {`${g.first_name} ${g.last_name}`.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[#51702c] font-semibold">
                      Price:{" "}
                      <span className="text-[#1c5461]">
                        &#8369; {pkg.price}
                      </span>
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
                      onClick={() => router.push(`/tour-packages/${pkg.id}`)}
                      className="bg-[#3e979f] text-white px-4 py-2 rounded-lg hover:bg-[#1c5461] transition-colors duration-300 w-full font-semibold"
                    >
                      View Details
                    </button>
                  </CardFooter>
                </Card>
              ))}
              {paginatedPackages.length === 0 && (
                <p className="text-center flex items-center justify-center text-gray-500 mt-6">
                  No tour packages available at the moment.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
