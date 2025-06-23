"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAccommodationManager } from "@/hooks/useAccommodationManager";
import { columns } from "@/components/custom/tourism-staff/columns";
import DataTable from "@/components/custom/data-table";
import AssignAccommodation from "@/components/custom/tourism-staff/assignAccomodation";
// import AssignTouristSpot from "@/components/custom/tourism-staff/assignTouristSpot";
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
    <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
          Tourism Staff
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Assign tourism staff to accommodations or tourist spots.
        </p>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="w-full max-w-[90rem]">
          <DataTable
            columns={columns(setAssignTouristSpotUser, setAssignDialogUser)}
            data={staff}
            searchPlaceholder="Search tourism staff..."
            searchColumn="name"
          />

          {/* Assign Accommodation Dialog */}
          <Dialog
            open={!!assignDialogUser}
            onOpenChange={() => setAssignDialogUser(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Accommodation</DialogTitle>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Tourist Spot</DialogTitle>
                <DialogDescription>
                  Assign this tourism staff to a tourist spot.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                {assignTouristSpotUser && (
                  <AssignTouristSpot
                    staff={assignTouristSpotUser}
                    onAssigned={() => setAssignTouristSpotUser(null)}
                    onCancel={() => setAssignTouristSpotUser(null)}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}
