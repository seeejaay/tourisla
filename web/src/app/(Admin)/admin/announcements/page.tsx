"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";

import {
  Announcement,
  columns as announcementColumns,
} from "@/components/custom/announcements/columns";
import DataTable from "@/components/custom/data-table";
import AddAnnouncement from "@/components/custom/announcements/addAnnouncement";
import ViewAnnouncement from "@/components/custom/announcements/viewAnnouncement";
import EditAnnouncement from "@/components/custom/announcements/editAnnouncement";
import DeleteAnnouncement from "@/components/custom/announcements/deleteAnnouncement";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [dialogAnnouncement, setDialogAnnouncement] =
    useState<Announcement | null>(null);
  const [editDialogAnnouncement, setEditDialogAnnouncement] =
    useState<Announcement | null>(null);
  const [deleteDialogAnnouncement, setDeleteDialogAnnouncement] =
    useState<Announcement | null>(null);

  const { loggedInUser } = useAuth();
  const {
    announcements,
    fetchAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    loading,
    error,
  } = useAnnouncementManager();

  // Refresh announcements after add/edit/delete
  const refreshAnnouncements = async () => {
    await fetchAnnouncements();
  };

  useEffect(() => {
    async function getCurrentUserAndAnnouncements() {
      try {
        const user = await loggedInUser(router);
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        await fetchAnnouncements();
      } catch (error) {
        router.replace("/");
        console.error("Error fetching announcements:", error);
      }
    }
    getCurrentUserAndAnnouncements();
  }, [router, loggedInUser, fetchAnnouncements]);

  return (
    <>
      <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
              Announcements
            </h1>
            <p className="text-lg text-[#51702c] text-center">
              Manage all announcements in the system.
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
                columns={announcementColumns(
                  setDialogAnnouncement,
                  setEditDialogAnnouncement,
                  setDeleteDialogAnnouncement
                )}
                data={announcements}
                addDialogTitle="Add Announcement"
                AddDialogComponent={
                  <AddAnnouncement onSuccess={refreshAnnouncements} />
                }
                searchPlaceholder="Search announcements..."
                searchColumn="title"
              />
            </div>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog
          open={!!dialogAnnouncement}
          onOpenChange={() => setDialogAnnouncement(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">
                Announcement Details
              </DialogTitle>
              <DialogDescription>
                Here are the details of the announcement.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {dialogAnnouncement && (
                <ViewAnnouncement announcement={dialogAnnouncement} />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editDialogAnnouncement}
          onOpenChange={() => setEditDialogAnnouncement(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">
                Edit Announcement
              </DialogTitle>
              <DialogDescription>
                Edit the details of the announcement.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {editDialogAnnouncement && (
                <EditAnnouncement
                  announcement={editDialogAnnouncement}
                  onSave={async (updatedAnnouncement) => {
                    const id = editDialogAnnouncement.id;
                    await updateAnnouncement(id, updatedAnnouncement);
                    await refreshAnnouncements();
                    setEditDialogAnnouncement(null);
                  }}
                  onCancel={() => setEditDialogAnnouncement(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={!!deleteDialogAnnouncement}
          onOpenChange={() => setDeleteDialogAnnouncement(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#c0392b]">
                Delete Announcement
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this announcement? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {deleteDialogAnnouncement && (
                <DeleteAnnouncement
                  announcement={deleteDialogAnnouncement}
                  onDelete={async (announcementId) => {
                    await deleteAnnouncement(announcementId);
                    await refreshAnnouncements();
                    setDeleteDialogAnnouncement(null);
                  }}
                  onCancel={() => setDeleteDialogAnnouncement(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
