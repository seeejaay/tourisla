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
  accommodation_id: z.string().nullable().optional(), // Add if you want to show assigned accommodation
});

// Infer the TypeScript type from the Zod schema
export type TourismStaff = z.infer<typeof TourismStaffSchema>;

export function columns(
  setAssignTouristSpotUser: (user: TourismStaff | null) => void,

  setAssignDialogUser: (user: TourismStaff | null) => void // for assignment
): ColumnDef<TourismStaff>[] {
  return [
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name (A-Z)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{row.original.first_name + " " + row.original.last_name}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex justify-start"
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
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className={
            row.original.status === "Active" ? "text-green-500" : "text-red-500"
          }
        >
          {row.original.status}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "accommodation_id",
      header: () => <span className="font-bold">Accommodation</span>,
      cell: ({ row }) => (
        <span>
          {row.original.accommodation_id
            ? row.original.accommodation_id
            : "Unassigned"}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const user = row.original;
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

              <DropdownMenuItem
                onClick={() => setAssignDialogUser(user)}
                className="text-blue-500"
              >
                Assign Accommodation
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAssignTouristSpotUser(user)}
                className="text-yellow-500"
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
