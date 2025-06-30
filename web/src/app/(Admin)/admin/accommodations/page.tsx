"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAccommodationManager } from "@/hooks/useAccommodationManager";

import { columns as accommodationColumns } from "@/components/custom/accommodations/columns";
import { Accommodation } from "@/app/static/accommodation/accommodationSchema";
import DataTable from "@/components/custom/data-table";
import AddAccommodation from "@/components/custom/accommodations/addAccommodation";
import ViewAccommodation from "@/components/custom/accommodations/viewAccommodation";
import EditAccommodation from "@/components/custom/accommodations/editAccommodation";
import DeleteAccommodation from "@/components/custom/accommodations/deleteAccommodation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AccommodationsPage() {
  const router = useRouter();
  const [dialogAccommodation, setDialogAccommodation] =
    useState<Accommodation | null>(null);
  const [editDialogAccommodation, setEditDialogAccommodation] =
    useState<Accommodation | null>(null);
  const [deleteDialogAccommodation, setDeleteDialogAccommodation] =
    useState<Accommodation | null>(null);

  const { loggedInUser } = useAuth();
  const {
    accommodations,
    fetchAccommodations,
    editAccommodation,
    deleteAccommodation,
    loading,
    error,
  } = useAccommodationManager();

  // Refresh accommodations after add/edit/delete
  const refreshAccommodations = async () => {
    await fetchAccommodations();
  };

  useEffect(() => {
    async function getCurrentUserAndAccommodations() {
      try {
        const user = await loggedInUser(router);
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        await fetchAccommodations();
      } catch (error) {
        router.replace("/");
        console.error("Error fetching accommodations:", error);
      }
    }
    getCurrentUserAndAccommodations();
  }, [router, loggedInUser, fetchAccommodations]);

  return (
    <>
      <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
              Accommodations
            </h1>
            <p className="text-lg text-[#51702c] text-center">
              Manage all accommodations in the system.
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
                columns={accommodationColumns(
                  setDialogAccommodation,
                  setEditDialogAccommodation,
                  setDeleteDialogAccommodation
                )}
                data={accommodations}
                addDialogTitle="Add Accommodation"
                AddDialogComponent={
                  <AddAccommodation onSuccess={refreshAccommodations} />
                }
                searchPlaceholder="Search accommodations..."
                searchColumn="name_of_establishment"
              />
            </div>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog
          open={!!dialogAccommodation}
          onOpenChange={() => setDialogAccommodation(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">
                Accommodation Details
              </DialogTitle>
              <DialogDescription>
                Here are the details of the accommodation.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {dialogAccommodation && (
                <ViewAccommodation accommodation={dialogAccommodation} />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editDialogAccommodation}
          onOpenChange={() => setEditDialogAccommodation(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">
                Edit Accommodation
              </DialogTitle>
              <DialogDescription>
                Edit the details of the accommodation.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {editDialogAccommodation && (
                <EditAccommodation
                  accommodation={editDialogAccommodation}
                  onSave={async (updatedAccommodation) => {
                    await editAccommodation(
                      Number(editDialogAccommodation?.id),
                      updatedAccommodation
                    );
                    await refreshAccommodations();
                    setEditDialogAccommodation(null);
                  }}
                  onCancel={() => setEditDialogAccommodation(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={!!deleteDialogAccommodation}
          onOpenChange={() => setDeleteDialogAccommodation(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#c0392b]">
                Delete Accommodation
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this accommodation? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {deleteDialogAccommodation && (
                <DeleteAccommodation
                  accommodation={deleteDialogAccommodation}
                  onDelete={async (accommodationId) => {
                    await deleteAccommodation(Number(accommodationId));
                    await refreshAccommodations();
                    setDeleteDialogAccommodation(null);
                  }}
                  onCancel={() => setDeleteDialogAccommodation(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
