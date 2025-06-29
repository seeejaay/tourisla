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
import type { Rule } from "@/app/static/rules/useRuleManagerSchema";

export function columns(
  setDialogRule: (rule: Rule | null) => void,
  setEditDialogRule: (rule: Rule | null) => void,
  setDeleteDialogRule: (rule: Rule | null) => void
): ColumnDef<Rule>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-56 font-bold text-left flex items-center gap-1 px-0 py-1"
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
          {row.original.category}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-32 font-bold text-left flex items-center gap-1 px-0 py-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-1 h-4 w-4 text-[#3e979f]" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className={`${
            row.original.is_active
              ? "text-green-600 font-semibold"
              : "text-red-500 font-semibold"
          }`}
        >
          {row.original.is_active ? "Active" : "Inactive"}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => (
        <span className="font-bold text-center block">Actions</span>
      ),
      cell: ({ row }) => {
        const rule = row.original;
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
                onClick={() => setDialogRule(rule)}
                className="hover:bg-[#e6f7fa] cursor-pointer"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setEditDialogRule(rule)}
                className="hover:bg-[#e6f7fa] cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogRule(rule)}
                className="text-red-500 hover:bg-[#fbe9e7] cursor-pointer"
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
