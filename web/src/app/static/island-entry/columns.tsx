"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  full_name: string;
  companion_names: string;
  role: string; // <-- Add role field
  latest_visit_date: string;
  expected_arrival: string;
};

export function columns(): ColumnDef<IslandEntry>[] {
  return [
    {
      accessorKey: "full_name",
      accessorFn: (row) =>
        row.role !== "Tourist"
          ? row.companion_names.split(",")[0].trim()
          : `${row.first_name} ${row.last_name}`,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-48 font-bold text-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-48 pl-8">
          <span className="font-semibold text-[#1c5461]">
            {row.getValue("full_name")}
          </span>
        </div>
      ),
      filterFn: "includesString", // Ensures searching works on computed value
      enableSorting: true,
    },
    // {
    //   accessorKey: "staff_name",
    //   header: "Registered By",
    //   cell: ({ row }) =>
    //     row.original.role === "Tourism Staff" ? (
    //       <span className="font-semibold text-blue-900">
    //         {row.original.first_name} {row.original.last_name}
    //       </span>
    //     ) : (
    //       <span className="italic text-gray-400">—</span>
    //     ),
    // },
    {
      accessorKey: "latest_visit_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-center flex items-center gap-1 px-0 py-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Latest Visit Date
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.latest_visit_date
            ? new Date(row.original.latest_visit_date).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "No entry recorded yet"}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "expected_arrival",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-48 font-bold text-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expected Arrival Date
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.expected_arrival
            ? new Date(row.original.expected_arrival).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : row.original.latest_visit_date
            ? new Date(row.original.latest_visit_date).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : ""}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
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
            w-28 font-semibold p-1 rounded-full text-center
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
            : row.original.status}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "companion_names",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-48 font-bold text-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Companions
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => {
        const companions = row.original.companion_names
          ? row.original.companion_names.split(",").map((n: string) => n.trim())
          : [];
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 px-3 py-1 rounded-full border-blue-200 hover:bg-blue-50 transition cursor-pointer"
              >
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-700">View</span>
                <span className="ml-1 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-bold">
                  {companions.length}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl shadow-2xl p-6 bg-gradient-to-br from-white to-blue-50 border border-blue-100">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-2 flex items-center gap-2 text-blue-800">
                  <Users className="h-5 w-5 text-blue-500" />
                  Companions
                </DialogTitle>
                <div className="h-px bg-blue-100 my-2" />
              </DialogHeader>
              <div className="py-2">
                {companions.length > 0 ? (
                  <ul className="space-y-2">
                    {companions.map((name: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-base text-gray-800 bg-blue-100/60 rounded-lg px-3 py-2 transition hover:bg-blue-200"
                      >
                        <User className="h-4 w-4 text-blue-400" />
                        <span className="font-medium">{name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Users className="mb-2 h-8 w-8 text-blue-200" />
                    <span className="italic text-gray-400 text-base">
                      No companions
                    </span>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        );
      },
      enableSorting: false,
    },
    // Add other columns if needed
  ];
}
