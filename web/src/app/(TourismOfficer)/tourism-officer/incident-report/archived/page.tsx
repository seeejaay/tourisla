"use client";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import ViewIncident from "@/components/custom/incident-report/ViewIncident";
import IncidentTabs from "@/components/custom/incident-report/IncidentTabs";
import { useEffect, useState } from "react";

export default function ArchivedIncidentPage() {
  const { reports, getAllReports } = useIncidentManager();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  const archivedReports = reports.filter((r) => r.status === "ARCHIVED");

  const uniqueIncidentTypes = [
    "All",
    ...Array.from(new Set(archivedReports.map((r) => r.incident_type))),
  ];

  const filteredReports = archivedReports.filter((report) => {
    const matchesSearch =
      report.description.toLowerCase().includes(search.toLowerCase()) ||
      report.location.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      typeFilter === "All" || report.incident_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-4 text-yellow-700 text-center">
        Archived Incident Reports
      </h1>

      {/* Tab Navigation */}
      <IncidentTabs />

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="Search by location or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-lg"
        >
          {uniqueIncidentTypes.map((type) => (
            <option key={type} value={type}>
              {type === "All" ? "All Types" : type}
            </option>
          ))}
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-center text-gray-600">
          No archived incident reports found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
