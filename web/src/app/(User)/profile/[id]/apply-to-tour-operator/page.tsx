"use client";

import React, { useState, useEffect } from "react";
import {
  columns,
  ApplyTourOperator,
} from "@/components/custom/apply-tour-operator/column";
import DataTable from "@/components/custom/data-table";
import { useTourOperatorManager } from "@/hooks/useTourOperatorManager";
import ApplyToTourOperatorForm from "@/components/custom/apply-tour-operator/applyToTourOperator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ApplyTourOperatorPage() {
  const [data, setData] = useState<ApplyTourOperator[]>([]);
  const [selectedOperator, setSelectedOperator] =
    useState<ApplyTourOperator | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchApplicants } = useTourOperatorManager();
  const { loggedInUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentGuideId, setCurrentGuideId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    async function fetchOperators() {
      setLoading(true);
      setError(null);
      try {
        const user = await loggedInUser(router);
        setCurrentGuideId(user.data.user.user_id?.toString());
        const operators = await fetchApplicants();
        setData(
          (operators || []).map((op) => ({
            id: op.id,
            operator_name: op.operator_name,
            email: op.email,
            mobile_number: op.mobile_number,
            office_address: op.office_address,
            application_status:
              op.application_status?.toLowerCase() || undefined,
          }))
        );
      } catch (error) {
        setError(
          "Failed to load tour operators. " +
            (error instanceof Error ? error.message : String(error))
        );
      } finally {
        setLoading(false);
      }
    }
    fetchOperators();
  }, [fetchApplicants, loggedInUser, router]);

  // Handler for opening the apply dialog
  const handleApply = (operator: ApplyTourOperator) => {
    setSelectedOperator(operator);
    setDialogOpen(true);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1c5461] tracking-tight">
              Apply to Tour Operators
            </h1>
            <p className="text-[#51702c] mt-2">
              Browse and apply to join approved tour operators.
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading tour operators...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Loading Error</h3>
            <p className="mt-2 text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No tour operators available
            </h3>
            <p className="mt-1 text-gray-500 mb-6">
              There are currently no approved tour operators to apply to.
            </p>
          </div>
        ) : (
          <DataTable<ApplyTourOperator, unknown>
            columns={columns(handleApply)}
            data={data}
            searchPlaceholder="Search by name..."
            searchColumn="operator_name"
          />
        )}

        {/* Apply Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-lg">
            <DialogHeader>
              <DialogTitle>
                Apply to {selectedOperator?.operator_name}
              </DialogTitle>
            </DialogHeader>
            {selectedOperator && (
              <ApplyToTourOperatorForm
                tourguide_id={currentGuideId}
                touroperator_id={selectedOperator.id.toString()}
                onSuccess={() => setDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
