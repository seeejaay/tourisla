"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { z } from "zod";

// Define the Zod schema for user data
export const UserSchema = z.object({
  user_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  role: z.enum([
    "Tourist",
    "Tour Guide",
    "Tour Operator",
    "Admin",
    "Cultural Director",
    "Tourism Officer",
    "Tourism Staff",
  ]),
  last_login_at: z.string().nullable(),
  status: z.enum(["Active", "Inactive"]),
});

// Infer the TypeScript type from the Zod schema
export type User = z.infer<typeof UserSchema>;
// Define the columns using the schema
export function columns(
  setDialogUser: (user: User | null) => void,
  setEditDialogUser: (user: User | null) => void,
  setDeleteDialogUser: (user: User | null) => void
): ColumnDef<User>[] {
  return [
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-32 p-0 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name (A-Z)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const fullName = row.original.first_name + " " + row.original.last_name;
        return <span>{fullName}</span>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <span>{row.original.email}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <span>{row.original.role}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "last_login_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Login
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span>{row.original.last_login_at || "Never logged in"}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span
          className={`${
            row.original.status === "Active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {row.original.status}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: ({ row }) => {
        const user = row.original;
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
                <DropdownMenuItem onClick={() => setDialogUser(user)}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditDialogUser(user)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDialogUser(user)}
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
