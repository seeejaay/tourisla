"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";

import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { columns as touristSpotColumns } from "@/components/custom/tourist-spot/columns";
import DataTable from "@/components/custom/data-table";
import AddTouristSpot from "@/components/custom/tourist-spot/addTouristSpot";
import ViewTouristSpot from "@/components/custom/tourist-spot/viewTouristSpot";
import EditTouristSpot from "@/components/custom/tourist-spot/editTouristSpot";
import DeleteTouristSpot from "@/components/custom/tourist-spot/deleteTouristSpot";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function TouristSpotPage() {
  const router = useRouter();
  const [dialogTouristSpot, setDialogTouristSpot] =
    useState<TouristSpot | null>(null);
  const [editDialogTouristSpot, setEditDialogTouristSpot] =
    useState<TouristSpot | null>(null);
  const [deleteDialogTouristSpot, setDeleteDialogTouristSpot] =
    useState<TouristSpot | null>(null);

  const { loggedInUser } = useAuth();
  const { touristSpots, fetchTouristSpots, deleteTouristSpot, loading, error } =
    useTouristSpotManager();

  // Refresh tourist spots after add/edit/delete
  const refreshTouristSpots = async () => {
    await fetchTouristSpots();
  };

  useEffect(() => {
    async function getCurrentUserAndTouristSpots() {
      try {
        const user = await loggedInUser(router);
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        await fetchTouristSpots();
      } catch (error) {
        router.replace("/");
        console.error("Error fetching tourist spots:", error);
      }
    }
    getCurrentUserAndTouristSpots();
  }, [router, loggedInUser, fetchTouristSpots]);

  return (
    <>
      <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
              Tourist Spots
            </h1>
            <p className="text-lg text-[#51702c] text-center">
              Manage all tourist spots in the system.
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
                columns={touristSpotColumns(
                  setDialogTouristSpot,
                  setEditDialogTouristSpot,
                  setDeleteDialogTouristSpot
                )}
                data={touristSpots}
                addDialogTitle="Add Tourist Spot"
                AddDialogComponent={
                  <AddTouristSpot onSuccess={refreshTouristSpots} />
                }
                searchPlaceholder="Search tourist spots..."
                searchColumn="name"
              />
            </div>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog
          open={!!dialogTouristSpot}
          onOpenChange={() => setDialogTouristSpot(null)}
        >
          <DialogContent className="lg:max-w-6xl h-[500px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">
                Tourist Spot Details
              </DialogTitle>
              <DialogDescription>
                Here are the details of the tourist spot.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {dialogTouristSpot && (
                <ViewTouristSpot touristSpot={dialogTouristSpot} />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editDialogTouristSpot}
          onOpenChange={() => setEditDialogTouristSpot(null)}
        >
          <DialogContent className="lg:max-w-6xl">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">
                Edit Tourist Spot
              </DialogTitle>
              <DialogDescription>
                Edit the details of the tourist spot.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {editDialogTouristSpot && (
                <EditTouristSpot
                  touristSpot={editDialogTouristSpot}
                  onSuccess={async () => {
                    await refreshTouristSpots();
                    setEditDialogTouristSpot(null);
                  }}
                  onCancel={() => setEditDialogTouristSpot(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={!!deleteDialogTouristSpot}
          onOpenChange={() => setDeleteDialogTouristSpot(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#c0392b]">
                Delete Tourist Spot
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this tourist spot? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {deleteDialogTouristSpot && (
                <DeleteTouristSpot
                  touristSpot={deleteDialogTouristSpot}
                  onDelete={async (touristSpotId) => {
                    if (!touristSpotId) return;
                    await deleteTouristSpot(Number(touristSpotId));
                    await refreshTouristSpots();
                    setDeleteDialogTouristSpot(null);
                  }}
                  onCancel={() => setDeleteDialogTouristSpot(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
