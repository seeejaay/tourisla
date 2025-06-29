"use client";

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
          className="w-48 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name of Establishment
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="truncate font-medium text-[#1c5461]">
          {row.original.name_of_establishment}
        </span>
      ),
      enableSorting: true,
    },

    {
      accessorKey: "municipality",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Municipality
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="truncate uppercase text-xs tracking-wide text-[#1c5461]">
          {row.original.municipality}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: () => (
        <span className="font-bold text-center block">Actions</span>
      ),
      cell: ({ row }) => {
        const accommodation = row.original;
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
                onClick={() => setDialogAccommodation(accommodation)}
                className="hover:bg-[#e6f7fa] cursor-pointer"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setEditDialogAccommodation(accommodation)}
                className="hover:bg-[#e6f7fa] cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogAccommodation(accommodation)}
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
