"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addDialogTitle?: string;
  AddDialogComponent?: React.ReactNode;
  searchPlaceholder?: string;
  searchColumn?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  addDialogTitle,
  AddDialogComponent,
  searchPlaceholder = "Search...",
  searchColumn = "name",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return (
    <>
      <div className="space-y-6 w-full">
        {/* Filter and Column Management */}
        <div className="flex flex-col w-full items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 w-full justify-between">
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-md w-full"
            />
            {AddDialogComponent && (
              <Button
                variant={"default"}
                className="bg-zinc-700 text-white hover:bg-zinc-800"
                onClick={() => {
                  setTimeout(() => setDialogOpen(true), 0);
                }}
              >
                {addDialogTitle ?? "Add"}
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto w-full sm:w-auto">
                Manage Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table for Larger Screens */}
        <div className="rounded-lg w-full border shadow-sm overflow-x-auto hidden md:block">
          <Table>
            <TableHeader className="bg-zinc-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="h-14 border-b border-zinc-200"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs sm:text-sm font-semibold text-zinc-700 px-4 py-2 bg-zinc-50 uppercase tracking-wide"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-sm sm:text-base max-w-[200px] truncate overflow-hidden whitespace-nowrap"
                      >
                        <span className="block truncate">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Cards for Smaller Screens */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="mb-2">
                    <strong className="block text-sm font-medium text-gray-700">
                      {typeof cell.column.columnDef.header === "function"
                        ? cell.column.columnDef.header(
                            table.getHeaderGroups()[0].headers[0].getContext()
                          )
                        : cell.column.columnDef.header}
                    </strong>
                    <span className="text-sm text-gray-600">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No results found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-md px-4 py-2"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-md px-4 py-2"
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page{" "}
              <strong className="text-zinc-800">
                {table.getState().pagination.pageIndex + 1}
              </strong>{" "}
              of{" "}
              <strong className="text-zinc-800">{table.getPageCount()}</strong>
            </span>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm text-gray-600">Go to page:</span>
            <Input
              type="number"
              min={1}
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 h-8 px-2 py-1 text-center border rounded"
            />
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      {AddDialogComponent && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className=" bg-[#f8fcfd] w-full min-h-[35rem] overflow-y-auto">
            <DialogHeader className="p-0 m-0  h-16 flex items-start justify-center">
              <DialogTitle className="text-lg font-semibold text-[#1c5461]">
                {addDialogTitle ?? "Add"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Fill in the details to add a new entry.
              </DialogDescription>
            </DialogHeader>
            {AddDialogComponent}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default DataTable;
