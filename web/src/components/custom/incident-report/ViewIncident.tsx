"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IncidentReport } from "@/app/static/incident-report/useIncidentSchema";
import { useIncidentManager } from "@/hooks/useIncidentManager";

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
    <Card className="p-4 space-y-2">
      {report.photo_url && (
        <img
          src={report.photo_url}
          alt="Incident"
          className="w-full h-40 object-cover rounded"
        />
      )}
      <h3 className="font-semibold text-lg text-gray-800">
        {report.incident_type}
      </h3>
      <p className="text-sm text-gray-600">
        <strong>Location:</strong> {report.location}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Date:</strong> {report.incident_date}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Time:</strong> {report.incident_time}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Submitted By:</strong> {report.submitted_by_name || "Unknown"} (
        {report.submitted_by_role || "Unknown"})
      </p>
      <p className="text-sm text-gray-700 line-clamp-3">{report.description}</p>

      {/* Status Action Buttons */}
      {(report.status === "RECEIVED" || report.status === "RESOLVED") && (
        <div className="flex gap-2 pt-2">
          {report.status === "RECEIVED" && (
            <Button
              variant="default"
              onClick={() => handleStatusUpdate("RESOLVED")}
            >
              Mark as Resolved
            </Button>
          )}
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => handleStatusUpdate("ARCHIVED")}
          >
            Archive
          </Button>
        </div>
      )}
    </Card>
  );
}
