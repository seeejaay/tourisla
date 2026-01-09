"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAccommodationManager } from "@/hooks/useAccommodationManager";
import { columns } from "@/components/custom/tourism-staff/columns";
import DataTable from "@/components/custom/data-table";
import AssignAccommodation from "@/components/custom/tourism-staff/assignAccomodation";
import AssignTouristSpot from "@/components/custom/tourism-staff/assignTouristSpot";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TourismStaff } from "@/components/custom/tourism-staff/columns";

export default function TourismStaffPage() {
  const router = useRouter();

  const [assignTouristSpotUser, setAssignTouristSpotUser] =
    useState<TourismStaff | null>(null);
  const [assignDialogUser, setAssignDialogUser] = useState<TourismStaff | null>(
    null
  );

  const { loggedInUser } = useAuth();
  const { getTourismStaff, loading, error } = useAccommodationManager();

  const [staff, setStaff] = useState<TourismStaff[]>([]);
  const refreshStaff = async () => {
    try {
      const staffList = await getTourismStaff();
      setStaff(staffList || []);
    } catch (error) {
      console.error("Error fetching tourism staff:", error);
    }
  };

  useEffect(() => {
    async function getCurrentUserAndStaff() {
      try {
        const user = await loggedInUser(router);
        if (
          !user ||
          !user.data.user.role ||
          user.data.user.role !== "Tourism Officer"
        ) {
          router.replace("/");
          return;
        }
        const staffList = await getTourismStaff();
        setStaff(staffList || []);
      } catch (error) {
        router.replace("/");
        console.error("Error fetching tourism staff:", error);
      }
    }
    getCurrentUserAndStaff();
  }, [router, loggedInUser, getTourismStaff]);

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            Tourism Staff
          </h1>
          <p className="text-lg text-[#51702c] text-center">
            Assign tourism staff to accommodations or tourist spots.
          </p>
        </div>
        <div className="w-full flex flex-col items-center">
          {loading && (
            <div className="flex items-center gap-2 py-4">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3e979f]"></span>
              <span className="text-[#3e979f] font-medium">Loading...</span>
            </div>
          )}
          {error && (
            <div className="text-[#c0392b] bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-center w-full max-w-lg">
              {error}
            </div>
          )}
          <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-4 md:p-8">
            <DataTable
              columns={columns(setAssignTouristSpotUser, setAssignDialogUser)}
              data={staff}
              searchPlaceholder="Search tourism staff..."
              searchColumn="name"
            />
          </div>
        </div>
      </div>

      {/* Assign Accommodation Dialog */}
      <Dialog
        open={!!assignDialogUser}
        onOpenChange={() => setAssignDialogUser(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1c5461]">
              Assign Accommodation
            </DialogTitle>
            <DialogDescription>
              Assign this tourism staff to an accommodation.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {assignDialogUser && (
              <AssignAccommodation
                staff={assignDialogUser}
                onAssigned={async () => {
                  await refreshStaff();
                  setAssignDialogUser(null);
                }}
                onCancel={() => setAssignDialogUser(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Tourist Spot Dialog */}
      <Dialog
        open={!!assignTouristSpotUser}
        onOpenChange={() => setAssignTouristSpotUser(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1c5461]">
              Assign Tourist Spot
            </DialogTitle>
            <DialogDescription>
              Assign this tourism staff to a tourist spot.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {assignTouristSpotUser && (
              <AssignTouristSpot
                staff={assignTouristSpotUser}
                onAssigned={async () => {
                  await refreshStaff();
                  setAssignTouristSpotUser(null);
                }}
                onCancel={() => setAssignTouristSpotUser(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
