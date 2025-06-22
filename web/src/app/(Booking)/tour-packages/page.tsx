"use client";

import React from "react";
import { useState, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";

import Header from "@/components/custom/header";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function TourPackagesPage() {
  // Ensure this is a client component
  // This component is used to display all tour packages available for booking
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
  };

  const { loggedInUser } = useAuth();
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const { fetchAllTourPackages } = useTourPackageManager();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("auth/login");
    async function checkUserRole() {
      const checkUserLoggedIn = await loggedInUser(router);
      if (!checkUserLoggedIn || !checkUserLoggedIn.data.user.role) {
        console.log("User not logged in, redirecting to login page...");

        router.push("auth/login");
      }
    }
    async function fetchTourPackages() {
      try {
        console.log("Fetching tour packages...");
        const tourPackages = await fetchAllTourPackages();
        setTourPackages(Array.isArray(tourPackages) ? tourPackages : []);
        console.log("Tour packages fetched successfully:", tourPackages);
      } catch (error) {
        console.error("Error fetching tour packages:", error);
      }
    }
    checkUserRole();
    fetchTourPackages();
  }, [loggedInUser, router, fetchAllTourPackages]);

  return (
    <>
      <Header />
      <main className="w-full min-h-screen flex flex-col items-center justify-start">
        <div>
          <h3 className="font-bold text-2xl text-center mt-4 mb-2">
            Explore Tour Packages
          </h3>
          <p className="text-center text-gray-600 mb-4">
            Discover our exclusive tour packages designed for unforgettable
            experiences.
          </p>
        </div>
        <div className="w-full max-w-4xl px-4">
          <div className="flex flex-wrap gap-6 justify-center">
            {tourPackages.map((pkg, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full mb-6 w-full sm:w-[48%] lg:w-[31%] min-w-[260px] max-w-xs"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {pkg.package_name}
                  </CardTitle>
                  <CardDescription className="uppercase text-xs tracking-wide">
                    {pkg.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-h-32 flex flex-col gap-2">
                  <p className="text-gray-600 font-semibold">
                    Price: &#8369; {pkg.price}
                  </p>
                  <p className="text-gray-500">
                    {pkg.description.charAt(0).toUpperCase() +
                      pkg.description.slice(1).toLowerCase()}
                  </p>
                </CardContent>
                <CardFooter className="pt-2">
                  <button
                    onClick={() => router.push(`/tour-packages/${index}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 w-full font-medium"
                  >
                    View Details
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {tourPackages.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              No tour packages available at the moment.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
