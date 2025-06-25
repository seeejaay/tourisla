"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the type for a visitor log row
export type VisitorLog = {
  id: number;
  scanned_by_user_id: number;
  visit_date: string;
  tourist_spot_id: number;
  tourist_spot_name: string;
  registration_id: number;
};

export function columns(): ColumnDef<VisitorLog>[] {
  return [
    {
      accessorKey: "tourist_spot_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tourist Spot Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.tourist_spot_name}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "scanned_by_user_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Scanned By (User ID)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.scanned_by_user_id}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "visit_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Visit Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.visit_date ? (
            new Date(row.original.visit_date).toLocaleDateString()
          ) : (
            <span className="italic text-muted-foreground">N/A</span>
          )}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "registration_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.registration_id}</span>,
      enableSorting: true,
    },
  ];
}
