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
        if (
          !user ||
          !user.data.user.role ||
          user.data.user.role !== "Cultural Director"
        ) {
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
  }, [router, loggedInUser, fetchHotlines]);

  return (
    <>
      <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
              Hotlines
            </h1>
            <p className="text-lg text-[#51702c] text-center">
              Manage all hotlines in the system.
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
                columns={hotlineColumns(
                  setDialogHotline,
                  setEditDialogHotline,
                  setDeleteDialogHotline
                )}
                data={hotlines}
                addDialogTitle="Add Hotline"
                AddDialogComponent={<AddHotline onSuccess={refreshHotlines} />}
                searchPlaceholder="Search hotlines..."
                searchColumn="type"
              />
            </div>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog
          open={!!dialogHotline}
          onOpenChange={() => setDialogHotline(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">
                Hotline Details
              </DialogTitle>
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">Edit Hotline</DialogTitle>
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#c0392b]">
                Delete Hotline
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this hotline? This action cannot
                be undone.
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
      </main>
    </>
  );
}
