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
import { Hotline } from "@/app/static/hotline/useHotlineManagerSchema";

export function columns(
  setDialogHotline: (hotline: Hotline | null) => void,
  setEditDialogHotline: (hotline: Hotline | null) => void,
  setDeleteDialogHotline: (hotline: Hotline | null) => void
): ColumnDef<Hotline>[] {
  return [
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
      cell: ({ row }) => {
        const value = row.original.municipality;
        return (
          <span className="truncate font-medium text-[#1c5461]">
            {value ? (
              value.replace(/_/g, " ")
            ) : (
              <span className="italic text-gray-400">N/A</span>
            )}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.original.type;
        return (
          <span className="truncate uppercase text-xs tracking-wide text-[#1c5461]">
            {value ? (
              value.replace(/_/g, " ")
            ) : (
              <span className="italic text-gray-400">N/A</span>
            )}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "contact_number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact Number
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="truncate text-[#3e979f]">
          {row.original.contact_number}
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
        const hotline = row.original;
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
                onClick={() => setDialogHotline(hotline)}
                className="hover:bg-[#e6f7fa] cursor-pointer"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setEditDialogHotline(hotline)}
                className="hover:bg-[#e6f7fa] cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogHotline(hotline)}
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
