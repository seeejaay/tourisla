"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import Header from "@/components/custom/header";
import { useAuth } from "@/hooks/useAuth";
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
  const { loggedInUser } = useAuth();
  const { fetchAllTourPackages } = useTourPackageManager();
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      const user = await loggedInUser(router);
      if (!user || !user.data.user.role) {
        console.log("User not logged in, redirecting to login page...");
        router.push("auth/login");
      }
    }

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
    checkUserRole();
    fetchPackage();
  }, [params.id, fetchAllTourPackages, loggedInUser, router]);

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
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
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
      <main className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 mt-12 border border-blue-100">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-2 flex items-center gap-2">
            <svg
              className="w-7 h-7 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
            {tourPackage.package_name}
            {tourPackage.id}
          </h2>
          <p className="text-blue-600 font-medium mb-4 uppercase tracking-wide">
            {tourPackage.location}
          </p>
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
              <span className="font-semibold text-blue-700">Inclusions:</span>
              <p className="text-gray-600 text-sm mt-1">
                {tourPackage.inclusions}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <span className="font-semibold text-red-700">Exclusions:</span>
              <p className="text-gray-600 text-sm mt-1">
                {tourPackage.exclusions}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <span className="font-semibold text-green-700">
                Available Slots:
              </span>
              <p className="text-gray-600 text-sm mt-1">
                {tourPackage.available_slots}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <span className="font-semibold text-yellow-700">Schedule:</span>
              <p className="text-gray-600 text-sm mt-1">
                {tourPackage.date_start} &rarr; {tourPackage.date_end}
              </p>
            </div>
          </div>
          <button
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue
            700 text-white rounded-lg font-semibold shadow transition"
            onClick={() => router.push(`/tour-packages/${tourPackage.id}/book`)}
          >
            Book Now
          </button>

          <button
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
            onClick={() => router.back()}
          >
            ← Back to Packages
          </button>
        </div>
      </main>
    </>
  );
}
