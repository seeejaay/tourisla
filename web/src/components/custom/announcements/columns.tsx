"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { z } from "zod";

// Define the Zod schema for user data
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
//TO MODIFY
export const AnnouncementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date_posted: z.string(),
  location: z.string(),
  image_url: z.string(),
  category: z.string(),
});

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Infer the TypeScript type from the Zod schema
export type Announcement = z.infer<typeof AnnouncementSchema>;
// Define the columns using the schema
export function columns(
  setDialogAnnouncement: (announcement: Announcement | null) => void,
  setEditDialogAnnouncement: (announcement: Announcement | null) => void,
  setDeleteDialogAnnouncement: (announcement: Announcement | null) => void
): ColumnDef<Announcement>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <span>{row.original.title}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <span>{row.original.location}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <span>{row.original.category}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        return (
          <>
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
                  onClick={() => {
                    setDialogAnnouncement(row.original);
                  }}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setEditDialogAnnouncement(row.original);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteDialogAnnouncement(row.original);
                  }}
                  className="text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
