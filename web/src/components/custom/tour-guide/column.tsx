"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export type TourGuide = {
  id?: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  sex: "MALE" | "FEMALE";
  mobile_number: string;
  email: string;
  reason_for_applying: string;
  profile_picture?: File | string;
  application_status?: string;
  user_id?: number;
};
export function columns(
  setDialogTourGuide: (guide: TourGuide | null) => void,
  onViewDocuments: (guide: TourGuide) => void
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
      accessorKey: "application_status",
      header: () => <span className="font-bold w-24 flex">Status</span>,
      cell: ({ row }) => {
        const status = row.original.application_status || "PENDING";
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
