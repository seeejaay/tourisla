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

export function columns(
  setEditLog: (log: AccommodationLog) => void
): ColumnDef<AccommodationLog>[] {
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
    {
      accessorKey: "rooms_occupied",
      header: "Rooms Occupied",
      cell: ({ row }) =>
        Array.isArray(row.original.rooms_occupied)
          ? row.original.rooms_occupied.join(", ")
          : String(row.original.rooms_occupied ?? ""),
      enableSorting: true,
    },
    {
      accessorKey: "number_of_guests_check_in",
      header: "Guests Check-in",
      cell: ({ row }) => row.original.number_of_guests_check_in,
      enableSorting: true,
    },
    {
      accessorKey: "number_of_guests_overnight",
      header: "Guests Overnight",
      cell: ({ row }) => row.original.number_of_guests_overnight,
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const log = row.original;
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
              <DropdownMenuItem onClick={() => setEditLog(log)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
