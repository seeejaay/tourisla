"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useHotlineManager } from "@/hooks/useHotlineManager";

import { columns as hotlineColumns } from "@/components/custom/hotline/columns";
import { Hotline } from "@/app/static/hotline/useHotlineManagerSchema";
import DataTable from "@/components/custom/data-table";
import AddHotline from "@/components/custom/hotline/addHotline";
import ViewHotline from "@/components/custom/hotline/viewHotline";
import EditHotline from "@/components/custom/hotline/editHotline";
import DeleteHotline from "@/components/custom/hotline/deleteHotline";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function HotlinesPage() {
  const router = useRouter();
  const [dialogHotline, setDialogHotline] = useState<Hotline | null>(null);
  const [editDialogHotline, setEditDialogHotline] = useState<Hotline | null>(
    null
  );
  const [deleteDialogHotline, setDeleteDialogHotline] =
    useState<Hotline | null>(null);

  const { loggedInUser } = useAuth();
  const {
    hotlines,
    fetchHotlines,
    updateHotline,
    deleteHotline,
    loading,
    error,
  } = useHotlineManager();

  // Refresh hotlines after add/edit/delete
  const refreshHotlines = async () => {
    await fetchHotlines();
  };

  useEffect(() => {
    async function getCurrentUserAndHotlines() {
      try {
        const user = await loggedInUser(router);
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        await fetchHotlines();
      } catch (error) {
        router.replace("/");
        console.error("Error fetching hotlines:", error);
      }
    }
    getCurrentUserAndHotlines();
  }, [router, loggedInUser]);

  return (
    <>
      <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
            Hotlines
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Manage all hotlines in the system.
          </p>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="w-full max-w-[90rem]">
            <DataTable
              columns={hotlineColumns(
                setDialogHotline,
                setEditDialogHotline,
                setDeleteDialogHotline
              )}
              data={hotlines}
              addDialogTitle="Add Hotline"
              AddDialogComponent={<AddHotline onSuccess={refreshHotlines} />}
              searchPlaceholder="Search hotlines..."
              searchColumn="contact_number"
            />
            {/* View Dialog */}
            <Dialog
              open={!!dialogHotline}
              onOpenChange={() => setDialogHotline(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hotline Details</DialogTitle>
                  <DialogDescription>
                    Here are the details of the hotline.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {dialogHotline && <ViewHotline hotline={dialogHotline} />}
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
              open={!!editDialogHotline}
              onOpenChange={() => setEditDialogHotline(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Hotline</DialogTitle>
                  <DialogDescription>
                    Edit the details of the hotline.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {editDialogHotline && (
                    <EditHotline
                      hotline={editDialogHotline}
                      onSave={async (updatedHotline) => {
                        await updateHotline(updatedHotline);
                        await refreshHotlines();
                        setEditDialogHotline(null);
                      }}
                      onCancel={() => setEditDialogHotline(null)}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
              open={!!deleteDialogHotline}
              onOpenChange={() => setDeleteDialogHotline(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Hotline</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this hotline? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {deleteDialogHotline && (
                    <DeleteHotline
                      hotline={deleteDialogHotline}
                      onDelete={async (hotlineId) => {
                        await deleteHotline(Number(hotlineId));
                        await refreshHotlines();
                        setDeleteDialogHotline(null);
                      }}
                      onCancel={() => setDeleteDialogHotline(null)}
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
