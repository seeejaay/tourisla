"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
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

// Zod schema for announcement
export const AnnouncementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date_posted: z.string(),
  location: z.string(),
  image_url: z.string(),
  category: z.string(),
  is_pinned: z.boolean().default(false), // New field for pinning announcements
});

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
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="truncate font-medium text-[#1c5461]">
          {row.original.title}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="truncate text-[#3e979f]">{row.original.location}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="truncate uppercase text-xs tracking-wide text-[#1c5461]">
          {row.original.category.replace(/_/g, " ")}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: () => (
        <span className="font-bold text-center block">Actions</span>
      ),
      cell: ({ row }) => (
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
              onClick={() => setDialogAnnouncement(row.original)}
              className="hover:bg-[#e6f7fa] cursor-pointer"
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setEditDialogAnnouncement(row.original)}
              className="hover:bg-[#e6f7fa] cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteDialogAnnouncement(row.original)}
              className="text-red-500 hover:bg-red-50 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
