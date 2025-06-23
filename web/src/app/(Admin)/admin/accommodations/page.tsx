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
  }, [router, loggedInUser]);

  return (
    <>
      <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
            Accommodations
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Manage all accommodations in the system.
          </p>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="w-full max-w-[90rem]">
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
            {/* View Dialog */}
            <Dialog
              open={!!dialogAccommodation}
              onOpenChange={() => setDialogAccommodation(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Accommodation Details</DialogTitle>
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Accommodation</DialogTitle>
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
                          Number(updatedAccommodation.id),
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Accommodation</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this accommodation? This
                    action cannot be undone.
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
          </div>
        </div>
      </main>
    </>
  );
}
