"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IncidentReport } from "@/app/static/incident-report/useIncidentSchema";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
interface Props {
  report: IncidentReport;
}

const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function ViewIncident({ report }: Props) {
  const { changeStatus } = useIncidentManager();
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleStatusUpdate = async (
    newStatus: "RESOLVED" | "ARCHIVED",
    actionTaken?: string
  ) => {
    try {
      await changeStatus(report.id, newStatus, actionTaken);
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setIsSubmitting(false);
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
            {report.incident_date
              ? new Date(report.incident_date).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "Asia/Manila", // Force PH time
                })
              : "Unknown"}
          </span>
          <span>
            <span className="font-semibold text-[#3e979f]">Time:</span>{" "}
            {report.incident_date && report.incident_time
              ? new Date(
                  `${report.incident_date.split("T")[0]}T${
                    report.incident_time
                  }+08:00`
                ).toLocaleTimeString("en-PH", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Manila",
                })
              : "Unknown"}
          </span>
          <span>
            <span className="font-semibold text-[#3e979f]">Submitted By:</span>{" "}
            {toSentenceCase(report.submitted_by_name || "Unknown")} (
            {toSentenceCase(report.submitted_by_role || "Unknown")})
          </span>
        </div>
        <div className="text-gray-800 text-sm mt-2 line-clamp-3">
          {toSentenceCase(report.description)}
        </div>

        {/* Status Action Buttons */}
        {(report.status === "RECEIVED" || report.status === "RESOLVED") && (
          <div className="flex gap-2 pt-3 mt-auto">
            {report.status === "RECEIVED" && (
              <>
                <Button
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
                  onClick={() => setOpenDialog(true)}
                >
                  Mark as Resolved
                </Button>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Resolve Incident</DialogTitle>
                    </DialogHeader>
                    {/* Add your form or textarea for action taken here */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Action Taken
                      </label>
                      <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        placeholder="Describe the action taken..."
                        id="actionTaken"
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        disabled={isSubmitting}
                        onClick={() => {
                          handleStatusUpdate(
                            "RESOLVED",
                            (
                              document.getElementById(
                                "actionTaken"
                              ) as HTMLTextAreaElement
                            )?.value
                          );
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Submitting Action...
                          </>
                        ) : (
                          "Submit Action"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setOpenDialog(false)}
                        disabled={isSubmitting}
                        className="text-gray-600 border-gray-300 hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {report.status === "RESOLVED" && (
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
                onClick={() => handleStatusUpdate("ARCHIVED")}
              >
                Archive
              </Button>
            )}

            {/* {report.status === "RECEIVED" && (
              <Button
                variant="default"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
                onClick={() => handleStatusUpdate("RESOLVED")}
              >
                Mark as Resolved
              </Button>
            )} */}
          </div>
        )}
      </div>
    </Card>
  );
}
