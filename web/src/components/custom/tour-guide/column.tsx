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

export type TourGuide = {
  id?: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  sex: "MALE" | "FEMALE";
  mobile_number: string;
  email: string;
  reason_for_applying: string;
  profile_picture?: File;
  application_status?: "pending" | "approved" | "rejected";
  user_id?: number;
};
import { useRouter } from "next/navigation";
export function columns(
  setDialogTourGuide: (guide: TourGuide | null) => void,
  onViewDocuments: (guide: TourGuide) => void,
  onApprove: (guide: TourGuide) => void,
  onReject: (guide: TourGuide) => void,
  router: ReturnType<typeof useRouter>
): ColumnDef<TourGuide>[] {
  return [
    {
      accessorKey: "first_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="uppercase">{row.original.first_name}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "last_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="uppercase">{row.original.last_name}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "applicaiton_status",
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
        const guide = row.original;
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
              <DropdownMenuItem onClick={() => setDialogTourGuide(guide)}>
                View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onViewDocuments(guide)}>
                View Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onApprove(guide)}>
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onReject(guide)}
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
