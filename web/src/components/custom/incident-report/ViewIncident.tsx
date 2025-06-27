"use client";

import { Card } from "@/components/ui/card";
import type { IncidentReport } from "@/app/static/incident-report/useIncidentSchema";

interface Props {
  report: IncidentReport;
}

export default function ViewIncident({ report }: Props) {
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
        <strong>Submitted By:</strong>{" "}
        {report.submitted_by_name || "Unknown"}{" "}
        ({report.submitted_by_role || "Unknown"})
      </p>
      <p className="text-sm text-gray-700 line-clamp-3">
        {report.description}
      </p>
    </Card>
  );
}
