"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Adjust this type to match your TourOperator model
export type TourOperator = {
  id?: number;
  name: string;
  email: string;
  contact_number: string;
  address: string;
  application_status: "pending" | "approved" | "rejected";
  // Add more fields as needed
};

export function columns(
  setDialogTourOperator: (operator: TourOperator | null) => void,
  onViewDocuments: (operator: TourOperator) => void,
  onApprove: (operator: TourOperator) => void,
  onReject: (operator: TourOperator) => void
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
      cell: ({ row }) => <span className="uppercase">{row.original.name}</span>,
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
      accessorKey: "contact_number",
      header: () => <span className="font-bold">Contact Number</span>,
      cell: ({ row }) => <span>{row.original.contact_number}</span>,
    },
    {
      accessorKey: "application_status",
      header: () => <span className="font-bold">Application Status</span>,
      cell: ({ row }) => {
        const status = row.original.application_status || "Pending";
        return (
          <span className="capitalize">
            {status === "approved" ? "Approved" : status}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const operator = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 w-8 h-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDialogTourOperator(operator)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewDocuments(operator)}>
                View Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onApprove(operator)}>
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onReject(operator)}
                className="text-red-500"
              >
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
