"use client";

import { useEffect, useState, useCallback } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import { Loader2, AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";

export default function AssignedTourPackagesPage() {
  const { fetchTourPackagesByGuide, loading, error } = useTourPackageManager();
  const [packages, setPackages] = useState<any[]>([]);
  const params = useParams();

  // Ensure id is always a string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Centralized load function for reuse
  const loadPackages = useCallback(async () => {
    if (!id) return;
    const data = await fetchTourPackagesByGuide(id);
    // Use the tourPackages property if it exists
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-12 px-4 sm:px-6 w-full">
      <div className="w-full pl-0 md:pl-24 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Assigned Tour Packages
            </h1>
            <p className="text-gray-500 mt-2">
              View all tour packages assigned to you as a tour guide.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading assigned tour packages...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Loading Error</h3>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">
              No assigned tour packages found
            </h3>
            <p className="mt-1 text-gray-500 mb-6">
              You currently have no assigned tour packages.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="hover:shadow-md transition-shadow duration-200 w-[300px] bg-white border border-gray-200 rounded-lg shadow-sm m-2 flex flex-col"
              >
                <div className="p-4 border-b">
                  <h3 className="font-medium capitalize">{pkg.package_name}</h3>
                </div>
                <div className="p-4 flex-1">
                  <div className="text-gray-700 mb-2">{pkg.description}</div>
                  <div className="text-sm text-gray-500">
                    Location: {pkg.location}
                  </div>
                  <div className="text-sm text-gray-500">
                    Price: ₱{pkg.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    Duration: {pkg.duration_days} days
                  </div>
                  <div className="text-sm text-gray-500">
                    Slots: {pkg.available_slots}
                  </div>
                </div>
                <div className="p-4 border-t text-xs text-gray-400">
                  {pkg.date_start} - {pkg.date_end}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
