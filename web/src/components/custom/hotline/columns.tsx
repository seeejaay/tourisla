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
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Municipality
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.original.municipality;
        return (
          <span>
            {value ? (
              value.replace("_", " ")
            ) : (
              <span className="italic text-muted-foreground">N/A</span>
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
          className="w-32 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.original.type;
        return (
          <span>
            {value ? (
              value.replace("_", " ")
            ) : (
              <span className="italic text-muted-foreground">N/A</span>
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
          className="w-32 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.contact_number}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.address || (
            <span className="italic text-muted-foreground">N/A</span>
          )}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const hotline = row.original;
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
              <DropdownMenuItem onClick={() => setDialogHotline(hotline)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditDialogHotline(hotline)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogHotline(hotline)}
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
