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

// Improved UI for Tourist Spot columns
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
          className="w-48 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="truncate font-semibold text-[#1c5461]">
          {row.original.name}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="uppercase text-xs tracking-wide text-[#1c5461]">
          {row.original.type}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-56 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => {
        const { barangay, municipality, province } = row.original;
        return (
          <span className="truncate text-[#51702c] text-sm">
            {[barangay, municipality, province].filter(Boolean).join(", ")}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "actions",
      header: () => (
        <span className="font-bold text-center block">Actions</span>
      ),
      cell: ({ row }) => {
        const spot = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 w-8 h-8 flex items-center justify-center hover:bg-[#e6f7fa]"
                aria-label="Open actions"
              >
                <MoreHorizontal className="h-5 w-5 text-[#1c5461]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuLabel className="text-[#1c5461]">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDialogTouristSpot(spot)}
                className="hover:bg-[#e6f7fa] cursor-pointer"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setEditDialogTouristSpot(spot)}
                className="hover:bg-[#e6f7fa] cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogTouristSpot(spot)}
                className="text-red-500 hover:bg-red-50 cursor-pointer"
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
