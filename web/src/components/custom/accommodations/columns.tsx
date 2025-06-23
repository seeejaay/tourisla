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
import type { Accommodation } from "@/app/static/accommodation/accommodationSchema";

export function columns(
  setDialogAccommodation: (accommodation: Accommodation | null) => void,
  setEditDialogAccommodation: (accommodation: Accommodation | null) => void,
  setDeleteDialogAccommodation: (accommodation: Accommodation | null) => void
): ColumnDef<Accommodation>[] {
  return [
    {
      accessorKey: "name_of_establishment",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-48 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name of Establishment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.name_of_establishment}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "no_of_rooms",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. of Rooms
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.no_of_rooms}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "Year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.Year}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "municipality",
      header: () => (
        <span className="w-40 font-bold text-left flex justify-start">
          Municipality
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      ),
      cell: ({ row }) => <span>{row.original.municipality}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const accommodation = row.original;
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
                onClick={() => setDialogAccommodation(accommodation)}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setEditDialogAccommodation(accommodation)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogAccommodation(accommodation)}
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
