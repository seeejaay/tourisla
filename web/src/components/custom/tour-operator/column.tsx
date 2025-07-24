"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Adjust this type to match your TourOperator model
export type TourOperator = {
  id: number;
  operator_name: string;
  email: string;
  mobile_number: string;
  office_address: string;
  application_status: string;
  user_id: number;
};

export function columns(
  setDialogTourOperator: (operator: TourOperator | null) => void,
  onViewDocuments: (operator: TourOperator) => void
): ColumnDef<TourOperator>[] {
  return [
    {
      accessorKey: "name",
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
      accessorKey: "application_status",
      header: () => <span className="font-bold w-24 flex">Status</span>,
      cell: ({ row }) => {
        const status =
          row.original.application_status.toUpperCase() || "PENDING";
        const statusClass =
          status === "APPROVED"
            ? "text-green-600 bg-green-100"
            : status === "REJECTED"
            ? "text-red-600 bg-red-100"
            : "text-yellow-600 bg-yellow-100";
        return (
          <span className="w-full flex justify-start">
            <Badge
              className={`rounded-full w-1/2   text-sm ${statusClass}`}
              variant={"default"}
            >
              {status
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </Badge>
          </span>
        );
      },
    },

    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const guide = row.original;
        return (
          <div className="flex items-center gap-2">
            <a
              onClick={() => onViewDocuments(guide)}
              className="text-blue-600 rounded-sm hover:underline text-center cursor-pointer font-semibold"
            >
              View
            </a>
          </div>
        );
      },
    },
  ];
}
