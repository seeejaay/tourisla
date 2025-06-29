"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IncidentReport } from "@/app/static/incident-report/useIncidentSchema";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import Image from "next/image";
interface Props {
  report: IncidentReport;
}

export default function ViewIncident({ report }: Props) {
  const { changeStatus } = useIncidentManager();

  const handleStatusUpdate = async (newStatus: "RESOLVED" | "ARCHIVED") => {
    try {
      await changeStatus(report.id, newStatus);
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  return (
    <Card className="p-0 overflow-hidden shadow-lg border border-[#e6f7fa] rounded-xl bg-white flex flex-col h-full">
      {report.photo_url ? (
        <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          <Image
            src={report.photo_url}
            alt="Incident"
            width={400}
            height={160}
            loading="lazy"
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-2 left-2 z-20 text-white font-semibold bg-black/50 px-2 py-1 rounded">
            Incident Photo
          </div>
        </div>
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-semibold rounded-t-xl">
          No Image Available
        </div>
      )}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <h3 className="font-bold text-lg text-[#1c5461] mb-1">
          {report.incident_type}
        </h3>
        <div className="flex flex-col gap-1 text-sm text-gray-700">
          <span>
            <span className="font-semibold text-[#3e979f]">Location:</span>{" "}
            {report.location}
          </span>
          <span>
            <span className="font-semibold text-[#3e979f]">Date:</span>{" "}
            {report.incident_date}
          </span>
          <span>
            <span className="font-semibold text-[#3e979f]">Time:</span>{" "}
            {report.incident_time}
          </span>
          <span>
            <span className="font-semibold text-[#3e979f]">Submitted By:</span>{" "}
            {report.submitted_by_name || "Unknown"} (
            {report.submitted_by_role || "Unknown"})
          </span>
        </div>
        <div className="text-gray-800 text-sm mt-2 line-clamp-3">
          {report.description}
        </div>

        {/* Status Action Buttons */}
        {(report.status === "RECEIVED" || report.status === "RESOLVED") && (
          <div className="flex gap-2 pt-3 mt-auto">
            {report.status === "RECEIVED" && (
              <Button
                variant="default"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
                onClick={() => handleStatusUpdate("RESOLVED")}
              >
                Mark as Resolved
              </Button>
            )}
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
              onClick={() => handleStatusUpdate("ARCHIVED")}
            >
              Archive
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
