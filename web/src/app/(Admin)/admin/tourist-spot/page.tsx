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
  const {
    touristSpots,
    fetchTouristSpots,
    updateTouristSpot,
    deleteTouristSpot,
    loading,
    error,
  } = useTouristSpotManager();

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
      <main className="flex flex-col items-center justify-start min-h-screen gap-12  bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <div className="flex  w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
            Tourist Spots
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Manage all tourist spots in the system.
          </p>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="w-full max-w-[90rem]">
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
          {/* View Dialog */}
          <Dialog
            open={!!dialogTouristSpot}
            onOpenChange={() => setDialogTouristSpot(null)}
          >
            <DialogContent className="min-w-[300px] md:max-w-4xl lg:max-w-5xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Tourist Spot Details
                </DialogTitle>
                <DialogDescription>
                  Detailed information about the tourist spot
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-y-auto max-h-[80vh]">
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
            <DialogContent className=" min-w-[300px] md:max-w-3xl lg:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Tourist Spot</DialogTitle>
                <DialogDescription>
                  Edit the details of the tourist spot.
                </DialogDescription>
              </DialogHeader>
              <div className=" overflow-y-auto max-h-[80vh]">
                {editDialogTouristSpot && (
                  <EditTouristSpot
                    touristSpot={editDialogTouristSpot}
                    onSave={async (updatedTouristSpot) => {
                      // Support FormData or object
                      let id: number | undefined;
                      if (updatedTouristSpot instanceof FormData) {
                        id = editDialogTouristSpot?.id;
                      } else {
                        id = updatedTouristSpot.id;
                      }
                      if (typeof id !== "number") return;
                      await updateTouristSpot(id, updatedTouristSpot);
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Tourist Spot</DialogTitle>
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
        </div>
      </main>
    </>
  );
}
