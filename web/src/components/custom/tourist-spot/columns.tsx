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
import type { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
// Define the TouristSpot type (adjust as needed or import from your schema)

export function columns(
  setDialogTouristSpot: (spot: TouristSpot | null) => void,
  setEditDialogTouristSpot: (spot: TouristSpot | null) => void,
  setDeleteDialogTouristSpot: (spot: TouristSpot | null) => void
): ColumnDef<TouristSpot>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.name}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.type}</span>,
      enableSorting: true,
    },
    {
      id: "address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-56 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const { barangay, municipality, province } = row.original;
        return (
          <span>
            {[barangay, municipality, province].filter(Boolean).join(", ")}
          </span>
        );
      },
      enableSorting: false,
    },

    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const spot = row.original;
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
              <DropdownMenuItem onClick={() => setDialogTouristSpot(spot)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditDialogTouristSpot(spot)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogTouristSpot(spot)}
                className="text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
