"use client";
import { useEffect, useState } from "react";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { IncidentReport } from "@/hooks/useIncidentManager";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  FileQuestion,
  CheckCircle,
  Clock,
  Archive,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function IncidentHistoryPage() {
  const router = useRouter();
  const { getMyReports } = useIncidentManager();
  const { loggedInUser } = useAuth();
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Search and pagination state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const reportsPerPage = 6;

  const statusOptions = [
    { value: "ALL", label: "All" },
    { value: "RECEIVED", label: "Received" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const toTitleCase = (str: string) => {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  const toSentenceCase = (str: string) => {
    if (!str) return "";
    // Split by sentence-ending punctuation, keeping the delimiter
    return str
      .split(/([.!?]\s*)/g)
      .map((part) =>
        part.length > 0
          ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          : ""
      )
      .join("")
      .trim();
  };
  useEffect(() => {
    async function getUser() {
      const user = await loggedInUser(router, false);

      if (!user) {
        router.push("/auth/login");
        return;
      }
      return user;
    }
    async function fetchReports() {
      const user = await getUser();
      if (user?.data?.user?.id) {
        const reports = await getMyReports(user.data.user.id);
        setIncidentReports(reports || []);
      }
    }
    fetchReports();
  }, [getMyReports, loggedInUser, router]);

  // Reset page when search or tab changes
  useEffect(() => {
    setPage(1);
  }, [search, activeTab]);

  // Filtering logic
  const filteredReports =
    activeTab === "ALL"
      ? incidentReports
      : incidentReports.filter((r) => r.status === activeTab);

  const searchedReports = filteredReports.filter(
    (r) =>
      r.incident_type.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(searchedReports.length / reportsPerPage)
  );
  const paginatedReports = searchedReports.slice(
    (page - 1) * reportsPerPage,
    page * reportsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fa] to-[#f8fafc] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1c5461]  text-start">
          My Incident Reports
        </h1>
        <p className="text-gray-600 mb-6">
          Here you can view all your incident reports.
        </p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full "
          >
            <TabsList className="space-x-2 w-full overflow-x-auto bg-gray-200">
              {statusOptions.map((option) => (
                <TabsTrigger
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer  rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 "
                >
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] pl-10"
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {paginatedReports.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12 bg-white rounded-xl shadow gap-2">
              <FileQuestion className="w-12 h-12 mb-2" />
              <span>No incident reports found for this status.</span>
              <Button
                variant="secondary"
                className="mt-2"
                onClick={() => {
                  setActiveTab("ALL");
                  setSearch("");
                }}
              >
                Show All Reports
              </Button>
            </div>
          ) : (
            paginatedReports.map((report: IncidentReport) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm transition hover:shadow-lg hover:scale-[1.02] flex flex-col"
              >
                <div className="w-full h-48 border border-gray-200 shadow rounded-lg overflow-hidden relative mb-2">
                  {report.photo_url ? (
                    <Image
                      src={report.photo_url}
                      alt="Incident photo"
                      width={500}
                      height={500}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      priority
                      className="rounded-lg border object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                  ${
                    report.status === "RESOLVED"
                      ? "bg-green-100 text-green-700"
                      : report.status === "RECEIVED"
                      ? "bg-yellow-100 text-yellow-700"
                      : report.status === "ARCHIVED"
                      ? "bg-gray-300 text-gray-700"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
                      >
                        {report.status === "RESOLVED" && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {report.status === "RECEIVED" && (
                          <Clock className="w-4 h-4" />
                        )}
                        {report.status === "ARCHIVED" && (
                          <Archive className="w-4 h-4" />
                        )}
                        {toTitleCase(report.status)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {report.status === "RESOLVED" &&
                        "This incident has been resolved."}
                      {report.status === "RECEIVED" &&
                        "This incident is being processed."}
                      {report.status === "ARCHIVED" &&
                        "This incident is archived."}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <h2 className="text-xl font-semibold text-[#1c5461] mb-1">
                  {toSentenceCase(report.incident_type)}
                </h2>
                <p className="mb-1 text-sm text-gray-600">
                  {new Date(report.incident_date).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" at " +
                    new Date(
                      `1970-01-01T${report.incident_time}`
                    ).toLocaleTimeString("en-PH", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  {toTitleCase(report.location) || "—"}
                </p>
                <div className="h-20 overflow-y-auto mb-2">
                  <p className="mb-1 text-gray-700">
                    {toSentenceCase(report.description) || "—"}
                  </p>
                  <p className="mb-1 text-gray-700">
                    <span className="font-medium text-gray-700">Note:</span>{" "}
                    {report.note || "—"}
                  </p>
                </div>
                <div className="border-t pt-2 mt-2 flex flex-col gap-1 text-xs text-gray-500">
                  <span>
                    <span className="font-medium text-gray-700">
                      Submitted At:
                    </span>{" "}
                    {report.submitted_at
                      ? new Date(report.submitted_at).toLocaleString()
                      : "—"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 self-end"
                  aria-label="View Details"
                  onClick={() => {
                    setSelectedReport(report);
                    setDialogOpen(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="px-2 py-1 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      {/* Dialog for View Details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>
              {selectedReport
                ? toSentenceCase(selectedReport.incident_type)
                : ""}
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-2 mt-2">
              <div className="w-full h-48 rounded-lg overflow-hidden relative mb-2">
                {selectedReport.photo_url ? (
                  <Image
                    src={selectedReport.photo_url}
                    alt="Incident photo"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover  object-top w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <p>
                <span className="font-medium text-gray-700">Date:</span>{" "}
                {new Date(selectedReport.incident_date).toLocaleDateString(
                  "en-PH",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}{" "}
                at{" "}
                {new Date(
                  `1970-01-01T${selectedReport.incident_time}`
                ).toLocaleTimeString("en-PH", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p>
                <span className="font-medium text-gray-700">Location:</span>{" "}
                {toTitleCase(selectedReport.location) || "—"}
              </p>
              <p className="max-h-48 overflow-y-auto text-justify">
                <span className="font-medium text-gray-700">Description:</span>{" "}
                {toSentenceCase(selectedReport.description) || "—"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Note:</span>{" "}
                {selectedReport.note || "—"}
              </p>
              <div className="border-t pt-2 mt-2 flex flex-col gap-1 text-xs text-gray-500">
                <span>
                  <span className="font-medium text-gray-700">
                    Submitted By:
                  </span>{" "}
                  {selectedReport.role} (ID: {selectedReport.submitted_by})
                </span>
                <span>
                  <span className="font-medium text-gray-700">
                    Submitted At:
                  </span>{" "}
                  {selectedReport.submitted_at
                    ? new Date(selectedReport.submitted_at).toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
