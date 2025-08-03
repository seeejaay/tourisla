"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define the type for a visitor log row
export type VisitorLog = {
  id: number;
  scanned_by_user_id: number;
  visit_date: string;
  tourist_spot_id: number;
  tourist_spot_name: string;
  registration_id: number;
  scanned_by_name: string;
  total_visitors: string;
  visitor_names: string;
};

export function columns(): ColumnDef<VisitorLog>[] {
  return [
    {
      accessorKey: "tourist_spot_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tourist Spot
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.original.tourist_spot_name || "";
        const maxLen = 15;
        return (
          <span title={name}>
            {name.length > maxLen ? name.slice(0, maxLen) + "..." : name}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "scanned_by_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Scanned By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-blue-900">
          {row.original.scanned_by_name}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "visit_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Visit Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.visit_date ? (
            new Date(row.original.visit_date).toLocaleDateString()
          ) : (
            <span className="italic text-muted-foreground">N/A</span>
          )}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "total_visitors",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="flex justify-center items-center w-full font-semibold text-blue-700">
          {row.original.total_visitors ? (
            row.original.total_visitors
          ) : (
            <span className="italic text-muted-foreground">N/A</span>
          )}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "visitor_names",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 p-0 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Companions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const names = row.original.visitor_names
          ? row.original.visitor_names.split(",").map((n) => n.trim())
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
                  {names.length}
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
                {names.length > 0 ? (
                  <ul className="space-y-2">
                    {names.map((name, idx) => (
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
    },
  ];
}
