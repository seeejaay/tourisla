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
      await fetchLogs(); // Fetch all logs, no accommodationId filter
    }
    fetchAllLogs();
  }, [fetchLogs, loggedInUser, router]);

  // Export
  const handleExport = async () => {
    await exportLogs();
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
          Accommodation Reports
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          View and Export Accommodation Logs into Excel.
        </p>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="w-full max-w-[90rem]">
          <DataTable
            columns={logColumns()}
            data={logs}
            searchPlaceholder="Search logs..."
            searchColumn="log_date"
          />
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
