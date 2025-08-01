"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccommodationLog } from "@/app/static/accommodation/accommodationlogSchema";

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function columns(): ColumnDef<AccommodationLog>[] {
  return [
    {
      accessorKey: "log_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Log Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.log_date),
      enableSorting: true,
    },
    {
      accessorKey: "checkout_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Checkout Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.checkout_date),
      enableSorting: true,
    },
    {
      accessorKey: "day_of_week",
      header: "Day of Week",
      cell: ({ row }) => row.original.day_of_week,
      enableSorting: true,
    },
  ];
}
