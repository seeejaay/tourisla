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
          className="w-56 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.title}</span>,
      enableSorting: true,
    },

    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.category}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "effective_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-40 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Effective Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.effective_date
          ? new Date(row.original.effective_date).toLocaleDateString()
          : "-";
        return <span>{date}</span>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-24 font-bold text-left flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className={
            row.original.is_active
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {row.original.is_active ? "Active" : "Inactive"}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const rule = row.original;
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
              <DropdownMenuItem onClick={() => setDialogRule(rule)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditDialogRule(rule)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogRule(rule)}
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
