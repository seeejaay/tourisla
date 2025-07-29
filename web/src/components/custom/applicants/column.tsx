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

export type Applicant = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  reason_for_applying: string;
  application_status: string;
  user_id: string;
};

export function columns(
  onApprove: (applicant: Applicant) => void,
  onReject: (applicant: Applicant) => void,
  onViewDocuments: (applicant: Applicant) => void,
  tab: "pending" | "approved" | "rejected"
): ColumnDef<Applicant>[] {
  const baseColumns: ColumnDef<Applicant>[] = [
    {
      accessorKey: "first_name",
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
        <span className="uppercase">
          {row.original.first_name} {row.original.last_name}
        </span>
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
      accessorKey: "mobile_number",
      header: () => <span className="font-bold">Mobile</span>,
      cell: ({ row }) => <span>{row.original.mobile_number}</span>,
    },
    {
      accessorKey: "reason_for_applying",
      header: () => <span className="font-bold">Reason</span>,
      cell: ({ row }) => <span>{row.original.reason_for_applying}</span>,
    },
    {
      accessorKey: "application_status",
      header: () => <span className="font-bold">Status</span>,
      cell: ({ row }) => {
        const status = row.original.application_status.toUpperCase();
        const color =
          status === "PENDING"
            ? "bg-yellow-100 text-yellow-800"
            : status === "APPROVED"
            ? "bg-green-100 text-green-800"
            : status === "REJECTED"
            ? "bg-red-100 text-red-800"
            : "bg-gray-200 text-gray-800";
        return (
          <span
            className={`capitalize px-3 py-1 rounded-full text-xs font-semibold ${color}`}
          >
            {status.toLowerCase()}
          </span>
        );
      },
    },
  ];

  const actionsColumn: ColumnDef<Applicant> = {
    accessorKey: "actions",
    header: () => <span className="font-bold">Actions</span>,
    cell: ({ row }) => {
      const applicant = row.original;

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
            {tab === "pending" && (
              <>
                <DropdownMenuItem
                  onClick={() => onApprove(applicant)}
                  className="cursor-pointer"
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onReject(applicant)}
                  className="cursor-pointer text-red-600"
                >
                  Reject
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              onClick={() => onViewDocuments(applicant)}
              className="cursor-pointer"
            >
              View Documents
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  // Only include actions column if not rejected
  return tab === "rejected" ? baseColumns : [...baseColumns, actionsColumn];
}
