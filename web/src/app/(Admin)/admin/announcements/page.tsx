"use client";

import Sidebar from "@/components/custom/sidebar";
// import {
//   Announcement,
//   columns,
// } from "@/components/custom/announcements/columns";
import {
  Announcement,
  columns as announcementColumns,
} from "@/components/custom/announcements/columns";
import DataTable from "@/components/custom/data-table";
import AddAnnouncement from "@/components/custom/announcements/addAnnouncement";

import { useEffect, useState } from "react";
import { currentUser } from "@/lib/api";

import {
  fetchAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/lib/api/announcements";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import ViewAnnouncement from "@/components/custom/announcements/viewAnnouncement";
import EditAnnouncement from "@/components/custom/announcements/editAnnouncement";
import DeleteAnnouncement from "@/components/custom/announcements/deleteAnnouncement";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const router = useRouter();
  const [dialogAnnouncement, setDialogAnnouncement] =
    useState<Announcement | null>(null);
  const [editDialogAnnouncement, setEditDialogAnnouncement] =
    useState<Announcement | null>(null);
  const [deleteDialogAnnouncement, setDeleteDialogAnnouncement] =
    useState<Announcement | null>(null);

  const refreshAnnouncements = async () => {
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    async function getCurrentUserAndAnnouncements() {
      try {
        const user = await currentUser();
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        router.replace("/");
        console.error("Error fetching announcements:", error);
      }
    }
    getCurrentUserAndAnnouncements();
  }, [router]);

  return (
    <>
      <Sidebar />
      <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
            Announcements
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Manage all announcements in the system.
          </p>
          <div className="w-full max-w-[90rem]">
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
            {/* View Dialog */}
            <Dialog
              open={!!dialogAnnouncement}
              onOpenChange={() => setDialogAnnouncement(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Announcement Details</DialogTitle>
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Announcement</DialogTitle>
                  <DialogDescription>
                    Edit the details of the announcement.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {editDialogAnnouncement && (
                    <EditAnnouncement
                      announcement={editDialogAnnouncement}
                      onSave={async (updatedAnnouncement) => {
                        await updateAnnouncement(updatedAnnouncement);
                        setAnnouncements((prev) =>
                          prev.map((a) =>
                            a.id === updatedAnnouncement.id
                              ? updatedAnnouncement
                              : a
                          )
                        );
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Announcement</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this announcement? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {deleteDialogAnnouncement && (
                    <DeleteAnnouncement
                      announcement={deleteDialogAnnouncement}
                      onDelete={async (announcementId) => {
                        await deleteAnnouncement(announcementId);
                        setAnnouncements((prev) =>
                          prev.filter((a) => a.id !== announcementId)
                        );
                        setDeleteDialogAnnouncement(null);
                      }}
                      onCancel={() => setDeleteDialogAnnouncement(null)}
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
