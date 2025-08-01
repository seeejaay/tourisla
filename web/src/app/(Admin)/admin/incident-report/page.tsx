"use client";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import ViewIncident from "@/components/custom/incident-report/ViewIncident";
import IncidentTabs from "@/components/custom/incident-report/IncidentTabs";
import { useEffect, useState } from "react";

export default function AdminIncidentPage() {
  const { reports, getAllReports } = useIncidentManager();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  // Only include RECEIVED reports
  const receivedReports = reports.filter((r) => r.status === "RECEIVED");

  const uniqueIncidentTypes = [
    "All",
    ...Array.from(new Set(receivedReports.map((r) => r.incident_type))),
  ];

  const filteredReports = receivedReports.filter((report) => {
    const matchesSearch =
      report.description.toLowerCase().includes(search.toLowerCase()) ||
      report.location.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "All" || report.incident_type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <main className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6">
        {/* Page Title */}
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            Received Incident Reports
          </h1>
        </div>

        {/* Tab Navigation */}
        <IncidentTabs />

        {/* Filter and Search */}
        <div className="w-full flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <input
            type="text"
            placeholder="Search by location or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 border border-[#e6f7fa] px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-1/3 border border-[#e6f7fa] px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition"
          >
            {uniqueIncidentTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>

        {/* Report List */}
        {filteredReports.length === 0 ? (
          <div className="w-full bg-white rounded-xl shadow border border-[#e6f7fa] p-8 text-center text-gray-600">
            No received incident reports found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredReports.map((report) => (
              <ViewIncident
                key={report.id}
                report={{
                  ...report,
                  submitted_by:
                    report.submitted_by === null
                      ? undefined
                      : report.submitted_by,
                  photo_url:
                    report.photo_url === null ? undefined : report.photo_url,
                  submitted_at:
                    report.submitted_at === null
                      ? undefined
                      : report.submitted_at,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
