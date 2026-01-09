"use client";
import React, { useEffect } from "react";
import { useAccommodationLogsManager } from "@/hooks/useAccommodationLogsManager";
import DataTable from "@/components/custom/data-table";
import { columns as logColumns } from "@/components/custom/accommodations/accommodation-reports/columns";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AccommodationReports() {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const { logs, fetchLogs, exportLogs, loading, error } =
    useAccommodationLogsManager();

  useEffect(() => {
    async function fetchAllLogs() {
      const user = await loggedInUser(router);
      if (!user) {
        router.push("/login");
        return;
      }
      await fetchLogs();
    }
    fetchAllLogs();
  }, [fetchLogs, loggedInUser, router]);

  // Export
  const handleExport = async () => {
    await exportLogs();
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            Accommodation Reports
          </h1>
          <p className="text-lg text-[#51702c] text-center">
            View and export accommodation logs into Excel.
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
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
              <span className="text-lg font-semibold text-[#3e979f]">
                Total Logs: {logs.length}
              </span>
              <Button
                variant="outline"
                className="border-[#e6f7fa] text-[#1c5461] font-semibold"
                onClick={handleExport}
                disabled={loading}
              >
                {loading ? "Exporting..." : "Export"}
              </Button>
            </div>
            <DataTable
              columns={logColumns()}
              data={logs}
              searchPlaceholder="Search logs..."
              searchColumn="log_date"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
