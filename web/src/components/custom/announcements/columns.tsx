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
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <span>{row.original.description}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "date_posted",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=" w-32 font-bold text-left flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Posted
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <span>{row.original.date_posted}</span>,
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
      accessorKey: "image_url",
      header: () => <span className="font-bold">Image URL</span>,
      cell: ({ row }) => <span>{row.original.image_url}</span>,
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

  // return [
  //   {
  //     accessorFn: (row) => `${row.first_name} ${row.last_name}`,
  //     id: "name",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           className="w-32 p-0 font-bold text-left flex justify-start"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Name (A-Z)
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       const fullName = row.original.first_name + " " + row.original.last_name;
  //       return <span>{fullName}</span>;
  //     },
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: "email",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           className=" w-32 font-bold text-left flex justify-start"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Email
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => <span>{row.original.email}</span>,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: "role",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           className=" w-32 font-bold text-left flex justify-start"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Role
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => <span>{row.original.role}</span>,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: "last_login_at",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           className=" w-32 font-bold text-left flex justify-start"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Last Login
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => (
  //       <span>{row.original.last_login_at || "Never logged in"}</span>
  //     ),
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: "status",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           className=" w-32 font-bold text-left flex justify-start"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Status
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => (
  //       <span
  //         className={`${
  //           row.original.status === "Active" ? "text-green-500" : "text-red-500"
  //         }`}
  //       >
  //         {row.original.status}
  //       </span>
  //     ),
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: "actions",
  //     header: () => <span className="font-bold">Actions</span>,
  //     cell: ({ row }) => {
  //       const user = row.original;
  //       return (
  //         <>
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="ghost" className="p-0 w-8 h-8">
  //                 <MoreHorizontal className="h-4 w-4" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent align="end">
  //               <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //               <DropdownMenuSeparator />
  //               <DropdownMenuItem onClick={() => setDialogUser(user)}>
  //                 View
  //               </DropdownMenuItem>
  //               <DropdownMenuItem onClick={() => setEditDialogUser(user)}>
  //                 Edit
  //               </DropdownMenuItem>
  //               <DropdownMenuItem
  //                 onClick={() => setDeleteDialogUser(user)}
  //                 className="text-red-500"
  //               >
  //                 Delete
  //               </DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </>
  //       );
  //     },
  //   },
  // ];
}
