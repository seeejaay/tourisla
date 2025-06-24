"use client";

import { useEffect, useState, useCallback } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import AddTourPackage from "@/components/custom/tour-package/addTourPackage";
import DeleteTourPackage from "@/components/custom/tour-package/deleteTourPackage";
import { Loader2, AlertTriangle, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type AssignedGuide = {
  tourguide_id: number;
  first_name: string;
  last_name: string;
  // Add other fields if present in your assigned_guides objects
};

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
  assigned_guides: AssignedGuide[];
};

export default function TourPackagesPage() {
  const { fetchAll, loading, error } = useTourPackageManager();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const params = useParams();

  // Ensure id is always a string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Centralized load function for reuse
  const loadPackages = useCallback(async () => {
    if (!id) return;
    const data = await fetchAll();
    setPackages(Array.isArray(data) ? data : []);
  }, [fetchAll, id]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Handle create success
  const handleCreateSuccess = async () => {
    setDialogOpen(false);
    await loadPackages();
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Invalid tour operator ID.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-12 px-4 sm:px-6 w-full">
      <div className="w-full pl-0 md:pl-24 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tour Packages</h1>
            <p className="text-gray-500 mt-2">
              View and manage your tour packages.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Tour Package
          </Button>
        </div>

        {/* Dialog for Creating Tour Package */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px] lg:max-w-7xl overflow-y-scroll h-[80svh] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Create Tour Package
              </DialogTitle>
            </DialogHeader>
            <AddTourPackage
              onSuccess={handleCreateSuccess}
              onCancel={() => setDialogOpen(false)}
              operatorId={id}
            />
          </DialogContent>
        </Dialog>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading tour packages...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Loading Error</h3>
            <p className="mt-2 text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">
              No tour packages found
            </h3>
            <p className="mt-1 text-gray-500 mb-6">
              Get started by creating your first tour package.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              Create Tour Package
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="hover:shadow-md transition-shadow duration-200 w-[300px] bg-white border border-gray-200 rounded-lg shadow-sm m-2 flex flex-col"
              >
                <CardHeader>
                  <h3 className="font-medium capitalize">{pkg.package_name}</h3>
                </CardHeader>
                <CardContent>
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
                  <div className="text-sm text-gray-500">
                    Tour Guide:
                    {pkg.assigned_guides.length === 0
                      ? " None"
                      : pkg.assigned_guides.map((g, i) => (
                          <span key={g.tourguide_id}>
                            {i > 0 && ", "}
                            {g.first_name} {g.last_name}
                          </span>
                        ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-400">
                    {pkg.date_start} - {pkg.date_end}
                  </span>
                  <DeleteTourPackage id={pkg.id} onDeleted={loadPackages} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
