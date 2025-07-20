"use client";

import { useEffect, useState, useCallback } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import { Loader2, MapPin, Calendar, Users, Clock } from "lucide-react";
import { useParams } from "next/navigation";

type TourPackage = {
  id: number;
  touroperator_id: number;
  package_name: string;
  location: string;
  description: string;
  price: string;
  duration_days: number;
  inclusions: string;
  exclusions: string;
  available_slots: number;
  date_start: string;
  date_end: string;
  start_time: string;
  end_time: string;
  cancellation_days: number;
  cancellation_note: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tourguide_id: number | null;
};

export default function AssignedTourPackagesPage() {
  const { fetchTourPackagesByGuide, loading, error } = useTourPackageManager();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const params = useParams();

  // Ensure id is always a string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Centralized load function for reuse
  const loadPackages = useCallback(async () => {
    if (!id) return;
    const data = await fetchTourPackagesByGuide(id);
    setPackages(Array.isArray(data?.tourPackages) ? data.tourPackages : []);
  }, [fetchTourPackagesByGuide, id]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Invalid tour guide ID.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1c5461] tracking-tight">
              Assigned Tour Packages
            </h1>
            <p className="text-[#51702c] mt-2">
              View all tour packages assigned to you as a tour guide.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading assigned tour packages...</p>
          </div>
        ) : packages.length === 0 || error ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900">
              No assigned tour packages found
            </h3>
            <p className="mt-1 text-gray-500 mb-6">
              You currently have no assigned tour packages.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="transition-shadow duration-200 w-[320px] bg-white border border-[#e6f7fa] rounded-2xl shadow-md hover:shadow-xl m-2 flex flex-col"
              >
                <div className="p-5 border-b border-[#e6f7fa]">
                  <h3 className="font-bold capitalize text-[#1c5461] text-lg mb-1">
                    {pkg.package_name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#51702c]">
                    <MapPin className="h-4 w-4" />
                    {pkg.location}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col gap-2">
                  <div className="text-gray-700 mb-1 line-clamp-3">
                    {pkg.description}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#3e979f]">
                    <Users className="h-4 w-4" />
                    Slots: {pkg.available_slots}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#3e979f]">
                    <Calendar className="h-4 w-4" />
                    {new Date(pkg.date_start).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(pkg.date_end).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#3e979f]">
                    <Clock className="h-4 w-4" />
                    {pkg.start_time} - {pkg.end_time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#51702c]">
                    Duration: {pkg.duration_days} day
                    {pkg.duration_days > 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#51702c]">
                    Price: <span className="font-semibold">₱{pkg.price}</span>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-[#e6f7fa] text-xs text-gray-400 bg-[#f8fcfd] rounded-b-2xl">
                  Created: {new Date(pkg.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
