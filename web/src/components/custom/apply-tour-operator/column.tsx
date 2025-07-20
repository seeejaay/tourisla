"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourGuideApplication } from "@/app/(User)/profile/[id]/apply-to-tour-operator/page";

export type ApplyTourOperator = {
  id: number;
  operator_name: string;
  email: string;
  mobile_number: string;
  office_address: string;
  application_status?: string; // optional, if you want to show status after applying
};

export function columns(
  handleApply: (operator: ApplyTourOperator) => void,
  hasAcceptedOperator: boolean,
  myApplications: TourGuideApplication[]
): ColumnDef<ApplyTourOperator>[] {
  return [
    {
      accessorKey: "operator_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="uppercase">{row.original.operator_name}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-48 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.email}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "office_address",
      header: () => <span className="font-bold">Office Address</span>,
      cell: ({ row }) => <span>{row.original.office_address}</span>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const operatorId = row.original.id;
        const alreadyApplied = myApplications.some(
          (app) =>
            String(app.touroperator_id) === String(operatorId) &&
            app.application_status.toUpperCase().trim() !== "REJECTED"
        );
        return (
          <Button
            onClick={() => handleApply(row.original)}
            disabled={hasAcceptedOperator || alreadyApplied}
          >
            Apply
          </Button>
        );
      },
    },
  ];
}
