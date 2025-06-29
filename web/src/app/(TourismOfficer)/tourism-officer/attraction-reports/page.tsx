"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useVisitorLogsManager } from "@/hooks/useVisitorLogsManager";
import DataTable from "@/components/custom/data-table";
import { columns as logColumns } from "@/components/custom/visitor-logs/column";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Define the structure for a visitor log
interface VisitorLog {
  id: number;
  registration_id: number;
  scanned_by_user_id: number;
  tourist_spot_id: number | string;
  tourist_spot_name: string;
  visit_date: string; // ISO date string
  // Add other fields if needed
}

export default function AttractionReports() {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const { fetchAllVisitors, exportLogs, exportSummary, loading, error } =
    useVisitorLogsManager();
  const [logs, setLogs] = useState<VisitorLog[]>([]);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [exportType, setExportType] = useState<"detailed" | "summary">(
    "detailed"
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [touristSpotId, setTouristSpotId] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      const user = await loggedInUser(router);
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const data = await fetchAllVisitors();
      setLogs(data);
    }
    fetchLogs();
  }, [loggedInUser, router, fetchAllVisitors]);

  // Build unique tourist spots from logs
  const uniqueTouristSpots = useMemo(() => {
    const map = new Map();
    logs.forEach((log) => {
      if (log.tourist_spot_id && log.tourist_spot_name) {
        map.set(log.tourist_spot_id, {
          id: log.tourist_spot_id,
          name: log.tourist_spot_name,
        });
      }
    });
    return Array.from(map.values());
  }, [logs]);

  // Export handler with filters
  const handleExport = async () => {
    try {
      const params = {
        from,
        to,
        tourist_spot_id: touristSpotId || undefined,
      };
      const blob =
        exportType === "detailed"
          ? await exportLogs(params)
          : await exportSummary(params);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        exportType === "detailed"
          ? "visitor_logs.xlsx"
          : "visitor_log_summary.xlsx"
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setOpen(false);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            Attraction Reports
          </h1>
          <p className="text-lg text-[#51702c] text-center">
            View and export attraction visitor logs into Excel.
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
              columns={logColumns()}
              data={logs}
              searchPlaceholder="Search by Tourist Spot Name"
              searchColumn="tourist_spot_name"
            />
            <div className="flex justify-end mt-4 gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="font-semibold">
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-[#1c5461]">
                      Export Visitor Logs
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 py-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Export Type
                      </label>
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={exportType}
                        onChange={(e) =>
                          setExportType(
                            e.target.value as "detailed" | "summary"
                          )
                        }
                      >
                        <option value="detailed">Detailed Logs</option>
                        <option value="summary">Summary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        className="border rounded px-2 py-1 w-full"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        className="border rounded px-2 py-1 w-full"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tourist Spot
                      </label>
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={touristSpotId}
                        onChange={(e) => setTouristSpotId(e.target.value)}
                      >
                        <option value="">All</option>
                        {uniqueTouristSpots.map((spot) => (
                          <option key={spot.id} value={spot.id}>
                            {spot.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button variant="outline" onClick={handleExport}>
                      Export
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
