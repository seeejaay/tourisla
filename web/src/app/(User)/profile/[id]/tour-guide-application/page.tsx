"use client";

import React, { useEffect, useState } from "react";
import { columns, Applicant } from "@/components/custom/applicants/column";
import DataTable from "@/components/custom/data-table";
import { useApplyOperatorManager } from "@/hooks/useApplyOperatorManager";
import { Loader2, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";

export default function TourGuideApplicationsPage() {
  const [data, setData] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  const { fetchApplications, approve, reject } = useApplyOperatorManager();
  const params = useParams();
  const router = useRouter();

  const operatorId = params?.id?.toString();

  // Handlers for actions
  const handleApprove = async (applicant: Applicant) => {
    try {
      await approve(applicant.id.toString());
      setData((prev) =>
        prev.map((a) =>
          a.id === applicant.id ? { ...a, application_status: "APPROVED" } : a
        )
      );
    } catch (error) {
      alert("Failed to approve application." + error);
    }
  };

  const handleReject = async (applicant: Applicant) => {
    try {
      await reject(applicant.id.toString());
      setData((prev) =>
        prev.map((a) =>
          a.id === applicant.id ? { ...a, application_status: "REJECTED" } : a
        )
      );
    } catch (error) {
      alert("Failed to reject application." + error);
    }
  };

  const handleViewDocuments = (applicant: Applicant) => {
    router.push(
      `/profile/${operatorId}/tour-guide-application/documents?guideId=${applicant.user_id}`
    );
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const applications = await fetchApplications(operatorId || "");
        setData(applications || []);
      } catch (error) {
        setError("Failed to load applications." + error);
      } finally {
        setLoading(false);
      }
    }
    if (operatorId) fetchData();
  }, [fetchApplications, operatorId]);

  // Filter applications by status
  const pendingApps = data.filter(
    (a) => a.application_status?.toLowerCase() === "pending"
  );
  const approvedApps = data.filter(
    (a) => a.application_status?.toLowerCase() === "approved"
  );
  const rejectedApps = data.filter(
    (a) => a.application_status?.toLowerCase() === "rejected"
  );

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1c5461] tracking-tight">
              Tour Guide Applications
            </h1>
            <p className="text-[#51702c] mt-2">
              Review, approve, or reject tour guide applications.
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-gray-600">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-red-800">
                  Loading Error
                </h3>
                <p className="mt-2 text-red-600">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            ) : pendingApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No pending applications
                </h3>
                <p className="mt-1 text-gray-500 mb-6">
                  There are currently no pending applications.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-4">
                <DataTable<Applicant, unknown>
                  columns={columns(
                    handleApprove,
                    handleReject,
                    handleViewDocuments,
                    "pending"
                  )}
                  data={pendingApps}
                  searchPlaceholder="Search by name..."
                  searchColumn="first_name"
                />
              </div>
            )}
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-gray-600">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-red-800">
                  Loading Error
                </h3>
                <p className="mt-2 text-red-600">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            ) : approvedApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No approved applications
                </h3>
                <p className="mt-1 text-gray-500 mb-6">
                  There are currently no approved applications.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-4">
                <DataTable<Applicant, unknown>
                  columns={columns(
                    handleApprove,
                    handleReject,
                    handleViewDocuments,
                    "approved"
                  )}
                  data={approvedApps}
                  searchPlaceholder="Search by name..."
                  searchColumn="first_name"
                />
              </div>
            )}
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value="rejected">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-gray-600">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-red-800">
                  Loading Error
                </h3>
                <p className="mt-2 text-red-600">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            ) : rejectedApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No rejected applications
                </h3>
                <p className="mt-1 text-gray-500 mb-6">
                  There are currently no rejected applications.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-4">
                <DataTable<Applicant, unknown>
                  columns={columns(
                    handleApprove,
                    handleReject,
                    handleViewDocuments,
                    "rejected"
                  )}
                  data={rejectedApps}
                  searchPlaceholder="Search by name..."
                  searchColumn="first_name"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
