"use client";

import React, { useState, useEffect } from "react";
import {
  columns,
  TourOperator,
} from "@/components/custom/tour-operator/column";
import DataTable from "@/components/custom/data-table";
import { useTourOperatorManager } from "@/hooks/useTourOperatorManager";
import { useRouter } from "next/navigation";
import ViewTourOperator from "@/components/custom/tour-operator/viewTourOperator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TourOperatorListPage() {
  const [data, setData] = useState<TourOperator[]>([]);
  const [dialogTourOperator, setDialogTourOperator] =
    useState<TourOperator | null>(null);

  const { fetchApplicants, fetchApplicant, approveApplicant, rejectApplicant } =
    useTourOperatorManager();
  const router = useRouter();

  useEffect(() => {
    async function fetchOperators() {
      const operators = await fetchApplicants();
      setData(
        (operators || []).map((op) => ({
          id: op.id,
          operator_name: op.operator_name,
          email: op.email,
          mobile_number: op.mobile_number,
          office_address: op.office_address,
          application_status: (
            op.application_status || "pending"
          ).toLowerCase(),
          user_id: Number(op.user_id ?? op.id ?? 0),
        }))
      );
    }
    fetchOperators();
  }, [fetchApplicants]);

  // Handler for viewing a tour operator (fetches latest data)
  const handleViewTourOperator = async (operator: TourOperator | null) => {
    if (!operator?.user_id) return;
    const freshOperator = await fetchApplicant(operator.user_id);
    if (!freshOperator) {
      setDialogTourOperator(null);
      return;
    }
    setDialogTourOperator({
      id: freshOperator.id,
      operator_name: freshOperator.operator_name,
      email: freshOperator.email,
      mobile_number: freshOperator.mobile_number,
      office_address: freshOperator.office_address,
      application_status: (
        freshOperator.application_status || "pending"
      ).toLowerCase(),
      user_id: Number(freshOperator.user_id ?? freshOperator.id ?? 0),
    });
  };

  // Handler for viewing documents (if applicable)
  const handleViewDocuments = (operator: TourOperator) => {
    router.push(`tour-operators/${operator.user_id}/documents`);
  };

  // Handler for approving a tour operator
  const handleApprove = async (operator: TourOperator) => {
    await approveApplicant(operator.id);
    const operators = await fetchApplicants();
    setData(
      (operators || []).map((op) => ({
        id: op.id,
        operator_name: op.operator_name,
        email: op.email,
        mobile_number: op.mobile_number,
        office_address: op.office_address,
        application_status: (op.application_status || "pending").toLowerCase(),
        user_id: Number(op.user_id ?? op.id ?? 0),
      })) as TourOperator[]
    );
  };

  // Handler for rejecting a tour operator
  const handleReject = async (operator: TourOperator) => {
    await rejectApplicant(operator.id);
    const operators = await fetchApplicants();
    setData(
      (operators || []).map((op) => ({
        id: op.id,
        operator_name: op.operator_name,
        email: op.email,
        mobile_number: op.mobile_number,
        office_address: op.office_address,
        application_status: (op.application_status || "pending").toLowerCase(),
        user_id: Number(op.user_id ?? op.id ?? 0),
      })) as TourOperator[]
    );
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            Tour Operators
          </h1>
          <p className="text-lg text-[#51702c] text-center">
            Review, approve, or reject tour operator applications.
          </p>
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-4 md:p-8">
            <DataTable<TourOperator, unknown>
              columns={columns(
                handleViewTourOperator,
                handleViewDocuments,
                handleApprove,
                handleReject
              )}
              data={data}
              searchPlaceholder="Search by name..."
              searchColumn="operator_name"
            />
          </div>
        </div>
      </div>
      {/* View Dialog */}
      <Dialog
        open={!!dialogTourOperator}
        onOpenChange={() => setDialogTourOperator(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1c5461]">
              Tour Operator Details
            </DialogTitle>
            <DialogDescription>
              View and manage tour operator details.
            </DialogDescription>
          </DialogHeader>
          {dialogTourOperator && (
            <ViewTourOperator tourOperator={dialogTourOperator} />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
