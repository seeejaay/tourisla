"use client";
import React, { useEffect, useState } from "react";
import { AccommodationLog } from "@/app/static/accommodation/accommodationlogSchema";
import { useAccommodationLogsManager } from "@/hooks/useAccommodationLogsManager";
import DataTable from "@/components/custom/data-table";
import { columns as logColumns } from "@/components/custom/accommodations/accommodation-reports/columns";
import AddAccommodationLog from "@/components/custom/accommodations/addAccomodationLog";
import DeleteAccommodationLog from "@/components/custom/accommodations/deleteAccommodationLog";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
export default function AccommodationReports() {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const {
    logs,
    createLog,
    updateLog,

    loading,
    error,
    getLogByAccommodationId,
  } = useAccommodationLogsManager();

  const [editDialogLog, setEditDialogLog] = useState<AccommodationLog | null>(
    null
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Refresh logs after add/edit/delete

  const refreshLogs = async () => {
    const tourismStaff = await loggedInUser(router);
    if (!tourismStaff) {
      router.push("/login");
      return;
    }
    // console.log("Refreshing logs for accommodation ID:", tourismStaff);
    const accommodationId = tourismStaff.id;
    await getLogByAccommodationId(accommodationId);
  };
  useEffect(() => {
    async function getByAccommodationdId() {
      const tourismStaff = await loggedInUser(router);
      if (!tourismStaff) {
        router.push("/login");
        return;
      }
      // console.log("Fetching logs for accommodation ID:", tourismStaff);
      const accommodationId = tourismStaff.data.user.user_id;
      const restul = await getLogByAccommodationId(accommodationId);
      console.log("Fetched logs:", restul);
    }
    getByAccommodationdId();
  }, [getLogByAccommodationId, loggedInUser, router]);

  // Add
  const handleAdd = async (data: any) => {
    await createLog(data);
    setAddDialogOpen(false);
    refreshLogs();
  };

  // Edit
  const handleEdit = (log: AccommodationLog) => setEditDialogLog(log);
  const handleEditSave = async (data: any) => {
    if (editDialogLog) {
      await updateLog(editDialogLog.id, data);
      setEditDialogLog(null);
      await refreshLogs();
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
          Accommodation Logs
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Record accommodation check-in/out dates, guest counts, and rooms
          occupied for accurate tourism management.
        </p>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="w-full max-w-[90rem]">
          <DataTable
            columns={logColumns(handleEdit)}
            data={logs}
            addDialogTitle="Add Log"
            AddDialogComponent={
              <AddAccommodationLog
                onClose={() => setAddDialogOpen(false)}
                onSubmit={handleAdd}
                loading={loading}
              />
            }
            onAddClick={() => setAddDialogOpen(true)}
            addDialogOpen={addDialogOpen}
            searchPlaceholder="Search logs..."
            searchColumn="log_date"
          />

          {/* Edit Dialog */}
          <Dialog
            open={!!editDialogLog}
            onOpenChange={(open) => {
              if (!open) setEditDialogLog(null);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Accommodation Log</DialogTitle>
                <DialogDescription>
                  Edit the details of this accommodation log.
                </DialogDescription>
              </DialogHeader>
              {editDialogLog && (
                <AddAccommodationLog
                  open={true}
                  onClose={() => setEditDialogLog(null)}
                  onSubmit={handleEditSave}
                  editingLog={editDialogLog}
                  loading={loading}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}
