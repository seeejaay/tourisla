"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define your type
export type IslandEntry = {
  id: number;
  unique_code: string;
  qr_code_url: string;
  registration_date: string;
  payment_method: string;
  total_fee: string;
  user_id: number;
  status: string;
  first_name: string;
  last_name: string;
};

export function columns(): ColumnDef<IslandEntry>[] {
  //   setDialogEntry: (entry: IslandEntry | null) => void,
  //   setEditDialogEntry: (entry: IslandEntry | null) => void,
  //   setDeleteDialogEntry: (entry: IslandEntry | null) => void
  return [
    {
      accessorKey: "full_name",
      header: "Full Name",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </span>
      ),
    },
    {
      accessorKey: "unique_code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-[#1c5461]">
          {row.original.unique_code}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "registration_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration Date
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{new Date(row.original.registration_date).toLocaleString()}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={
            row.original.status === "PAID"
              ? "text-green-600 font-bold"
              : "text-red-600 font-bold"
          }
        >
          {row.original.status}
        </span>
      ),
    },
    // {
    //   accessorKey: "actions",
    //   header: () => (
    //     <span className="font-bold text-center block">Actions</span>
    //   ),
    //   cell: ({ row }) => {
    //     const entry = row.original;
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             className="p-0 w-8 h-8 flex items-center justify-center hover:bg-[#e6f7fa]"
    //             aria-label="Open actions"
    //           >
    //             <MoreHorizontal className="h-5 w-5 text-[#1c5461]" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end" className="min-w-[140px]">
    //           <DropdownMenuLabel className="text-[#1c5461]">
    //             Actions
    //           </DropdownMenuLabel>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem
    //             onClick={() => setDialogEntry(entry)}
    //             className="hover:bg-[#e6f7fa] cursor-pointer"
    //           >
    //             View
    //           </DropdownMenuItem>
    //           <DropdownMenuItem
    //             onClick={() => setEditDialogEntry(entry)}
    //             className="hover:bg-[#e6f7fa] cursor-pointer"
    //           >
    //             Edit
    //           </DropdownMenuItem>
    //           <DropdownMenuItem
    //             onClick={() => setDeleteDialogEntry(entry)}
    //             className="text-red-500 hover:bg-red-50 cursor-pointer"
    //           >
    //             Delete
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];
}
