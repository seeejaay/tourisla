"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ApplyTourOperator = {
  id: number;
  operator_name: string;
  email: string;
  mobile_number: string;
  office_address: string;
  application_status?: string; // optional, if you want to show status after applying
};

export function columns(
  onApply: (operator: ApplyTourOperator) => void
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
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const operator = row.original;
        return (
          <Button variant="outline" onClick={() => onApply(operator)}>
            Apply
          </Button>
        );
      },
    },
  ];
}
