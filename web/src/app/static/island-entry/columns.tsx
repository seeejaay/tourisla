"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const toSentenceCase = (str: string) => {
    return str.charAt(0) + str.slice(1).toLowerCase();
  };

  return [
    {
      accessorKey: "full_name",
      // header: "Full Name" ,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-48 font-bold text-center  cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className=" w-48 pl-8">
          <span className="font-semibold text-[#1c5461]">
            {row.original.first_name} {row.original.last_name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "registration_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-center flex items-center gap-1 px-0 py-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration Date
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {new Date(row.original.registration_date).toLocaleString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      // header: "Status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex items-center gap-1 px-0 py-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge
          className={`
            w-28 font-semibold  p-1 rounded-full text-center
            ${
              row.original.status === "PAID"
                ? "text-green-600 bg-green-100"
                : row.original.status === "UNPAID"
                ? "text-red-600 bg-red-100"
                : row.original.status === "NOT_REQUIRED"
                ? "text-gray-600 bg-gray-100"
                : "text-yellow-600 bg-yellow-100"
            }`}
        >
          {row.original.status === "NOT_REQUIRED"
            ? "Not Required"
            : toSentenceCase(row.original.status)}
        </Badge>
      ),
      enableSorting: true,
    },
    // {
    //   accessorKey: "unique_code",
    //   header: ({ column }) => (
    //     <Button
    //       variant="ghost"
    //       className="w-32 font-bold text-left flex items-center gap-1 px-0 py-1"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Code
    //       <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
    //     </Button>
    //   ),
    //   cell: ({ row }) => (
    //     <span className="font-mono text-[#1c5461]">
    //       {row.original.unique_code}
    //     </span>
    //   ),
    //   enableSorting: true,
    // },
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
