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
import { z } from "zod";

// Define the Zod schema for tourism staff user data
export const TourismStaffSchema = z.object({
  user_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  role: z.literal("Tourism Staff"),
  last_login_at: z.string().nullable(),
  status: z.enum(["Active", "Inactive"]),
  accommodation_id: z.string().nullable().optional(),
  attraction_id: z.string().nullable().optional(),
});

// Infer the TypeScript type from the Zod schema
export type TourismStaff = z.infer<typeof TourismStaffSchema>;

export function columns(
  setAssignTouristSpotUser: (user: TourismStaff | null) => void,
  setAssignDialogUser: (user: TourismStaff | null) => void
): ColumnDef<TourismStaff>[] {
  return [
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-56 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name (A-Z)
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="truncate font-medium text-[#1c5461]">
          {row.original.first_name + " " + row.original.last_name}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "accommodation_id",
      header: () => <span className="font-bold">Accommodation</span>,
      cell: ({ row }) => (
        <span className="truncate text-[#1c5461]">
          {row.original.accommodation_id ? (
            row.original.accommodation_id
          ) : (
            <span className="italic text-gray-400">Unassigned</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "attraction_id",
      header: () => <span className="font-bold">Tourist Spot</span>,
      cell: ({ row }) => (
        <span className="truncate text-[#1c5461]">
          {row.original.attraction_id ? (
            row.original.attraction_id
          ) : (
            <span className="italic text-gray-400">Unassigned</span>
          )}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => (
        <span className="font-bold text-center block">Actions</span>
      ),
      cell: ({ row }) => {
        const user = row.original;
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
            <DropdownMenuContent align="end" className="min-w-[170px]">
              <DropdownMenuLabel className="text-[#1c5461]">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setAssignDialogUser(user)}
                className="text-[#1c5461] hover:bg-[#e6f7fa] cursor-pointer"
              >
                Assign Accommodation
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAssignTouristSpotUser(user)}
                className="text-[#e6a700] hover:bg-[#fff8e1] cursor-pointer"
              >
                Assign Tourist Spot
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
