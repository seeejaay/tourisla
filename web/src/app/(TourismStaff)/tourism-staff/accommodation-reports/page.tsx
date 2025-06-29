"use client";
import React, { useEffect, useState } from "react";
import { AccommodationLog } from "@/app/static/accommodation/accommodationlogSchema";
import { useAccommodationLogsManager } from "@/hooks/useAccommodationLogsManager";
import DataTable from "@/components/custom/data-table";
import { columns as logColumns } from "@/components/custom/accommodations/accommodation-reports/columns";
import AddAccommodationLog from "@/components/custom/accommodations/addAccomodationLog";
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
    const accommodationId = tourismStaff.data.user.user_id;
    await getLogByAccommodationId(accommodationId);
  };

  useEffect(() => {
    async function getByAccommodationdId() {
      const tourismStaff = await loggedInUser(router);
      if (!tourismStaff) {
        router.push("/login");
        return;
      }
      const accommodationId = tourismStaff.data.user.user_id;
      await getLogByAccommodationId(accommodationId);
    }
    getByAccommodationdId();
  }, [getLogByAccommodationId, loggedInUser, router]);

  // Add
  const handleAdd = async (data: AccommodationLog) => {
    await createLog(data);
    setAddDialogOpen(false);
    refreshLogs();
  };

  // Edit
  const handleEdit = (log: AccommodationLog) => setEditDialogLog(log);
  const handleEditSave = async (data: AccommodationLog) => {
    if (editDialogLog) {
      await updateLog(editDialogLog.id, data);
      setEditDialogLog(null);
      await refreshLogs();
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight mt-4">
          Accommodation Logs
        </h1>
        <p className="mt-2 text-lg text-[#51702c] text-center">
          Record accommodation check-in/out dates, guest counts, and rooms
          occupied for accurate tourism management.
        </p>
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
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-[#1c5461]">
                  Edit Accommodation Log
                </DialogTitle>
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
