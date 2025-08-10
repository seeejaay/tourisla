"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  useIslandEntryManager,
  IslandEntryExportFilter,
} from "@/hooks/useIslandEntryManager";
import {
  columns as islandEntryColumns,
  IslandEntry,
} from "@/app/static/island-entry/columns";
import DataTable from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function IslandEntryLogsPage() {
  const router = useRouter();
  const [islandEntries, setIslandEntries] = useState<IslandEntry[]>([]);
  const { loggedInUser } = useAuth();
  const { getAllIslandEntries, loading, exportIslandEntryLog } =
    useIslandEntryManager();

  // Export dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<"monthYear" | "range">(
    "monthYear"
  );
  const [exportFilter, setExportFilter] = useState({
    month: "",
    year: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    async function getCurrentUserAndEntries() {
      try {
        const user = await loggedInUser(router);
        if (!user || user.data.user.role !== "Tourism Officer") {
          router.replace("/");
          return;
        }
        const data = await getAllIslandEntries();
        if (data) {
          setIslandEntries(
            data.map((entry: IslandEntry) => ({
              ...entry,
              full_name:
                entry.role !== "Tourist"
                  ? entry.companion_names.split(",")[0].trim()
                  : `${entry.first_name} ${entry.last_name}`,
            }))
          );
        } else {
          console.error("No island entries found");
        }
      } catch (err) {
        console.error("Error fetching island entries:", err);
        router.replace("/");
      }
    }
    getCurrentUserAndEntries();
  }, [router, loggedInUser, getAllIslandEntries]);

  function applyPreset(preset: string) {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1);
    if (preset === "thisMonth") {
      setFilterMode("monthYear");
      setExportFilter((f) => ({
        ...f,
        month,
        year,
        start_date: "",
        end_date: "",
      }));
    } else if (preset === "lastMonth") {
      const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lmMonth = String(d.getMonth() + 1);
      const lmYear = String(d.getFullYear());
      setFilterMode("monthYear");
      setExportFilter((f) => ({
        ...f,
        month: lmMonth,
        year: lmYear,
        start_date: "",
        end_date: "",
      }));
    } else if (preset === "ytd") {
      setFilterMode("range");
      setExportFilter((f) => ({
        ...f,
        month: "",
        year: "",
        start_date: `${year}-01-01`,
        end_date: now.toISOString().slice(0, 10),
      }));
    } else if (preset === "all") {
      setExportFilter({ month: "", year: "", start_date: "", end_date: "" });
    }
  }

  const isMonthYearValid =
    filterMode !== "monthYear" || (exportFilter.month && exportFilter.year);
  const isRangeValid =
    filterMode !== "range" ||
    (exportFilter.start_date && exportFilter.end_date);
  const exportDisabled = loading || !(isMonthYearValid && isRangeValid);

  async function handleExport(e?: React.FormEvent) {
    e?.preventDefault();
    const filter: IslandEntryExportFilter = {};
    if (filterMode === "monthYear" && exportFilter.month && exportFilter.year) {
      filter.month = Number(exportFilter.month);
      filter.year = Number(exportFilter.year);
    } else if (
      filterMode === "range" &&
      exportFilter.start_date &&
      exportFilter.end_date
    ) {
      filter.start_date = exportFilter.start_date;
      filter.end_date = exportFilter.end_date;
    }
    await exportIslandEntryLog(filter);
    setDialogOpen(false);
  }

  return (
    <>
      <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
              Island Entry Logs
            </h1>
            <p className="text-lg text-[#51702c] text-center mb-2">
              View and manage all island entry registrations.
            </p>
          </div>

          <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-4 md:p-8">
            <div className="w-full flex items-center justify-between mb-5">
              <span className="text-lg md:text-xl font-bold text-[#3e979f]">
                Total Logs: {islandEntries.length}
              </span>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="px-5 py-2 font-semibold bg-[#1c5461] text-white hover:bg-[#17434c] shadow rounded">
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg p-0 overflow-hidden rounded-xl border border-blue-100">
                  <div className="bg-gradient-to-br from-white to-blue-50 px-6 py-5">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-[#123f46]">
                        Export Logs
                      </DialogTitle>
                      <DialogDescription className="text-sm text-slate-600">
                        Choose a period to export visitor entries or use a quick
                        preset.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => applyPreset("thisMonth")}
                      >
                        This Month
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => applyPreset("lastMonth")}
                      >
                        Last Month
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => applyPreset("ytd")}
                      >
                        YTD
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyPreset("all")}
                      >
                        All Time
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExportFilter({
                            month: "",
                            year: "",
                            start_date: "",
                            end_date: "",
                          })
                        }
                      >
                        Reset
                      </Button>
                    </div>

                    <Tabs
                      value={filterMode}
                      onValueChange={(v) =>
                        setFilterMode(v as "monthYear" | "range")
                      }
                      className="mt-5"
                    >
                      <TabsList className="grid grid-cols-2 bg-slate-100">
                        <TabsTrigger
                          value="monthYear"
                          className="data-[state=active]:bg-white"
                        >
                          Month / Year
                        </TabsTrigger>
                        <TabsTrigger
                          value="range"
                          className="data-[state=active]:bg-white"
                        >
                          Date Range
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="monthYear" className="mt-4 space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1 space-y-2">
                            <label className="text-xs font-medium text-slate-600">
                              Month
                            </label>
                            <Select
                              value={exportFilter.month}
                              onValueChange={(val) =>
                                setExportFilter((f) => ({
                                  ...f,
                                  month: val,
                                  start_date: "",
                                  end_date: "",
                                }))
                              }
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((m) => (
                                  <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="text-xs font-medium text-slate-600">
                              Year
                            </label>
                            <Select
                              value={exportFilter.year}
                              onValueChange={(val) =>
                                setExportFilter((f) => ({
                                  ...f,
                                  year: val,
                                  start_date: "",
                                  end_date: "",
                                }))
                              }
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 9 }, (_, i) => {
                                  const y = new Date().getFullYear() - 4 + i;
                                  return (
                                    <SelectItem key={y} value={String(y)}>
                                      {y}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {!isMonthYearValid && (
                          <p className="text-xs text-amber-600">
                            Select both month and year or switch to Date Range.
                          </p>
                        )}
                      </TabsContent>

                      <TabsContent value="range" className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-600">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={exportFilter.start_date}
                              onChange={(e) =>
                                setExportFilter((f) => ({
                                  ...f,
                                  start_date: e.target.value,
                                  month: "",
                                  year: "",
                                }))
                              }
                              className="w-full rounded border bg-white px-2 py-1 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-600">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={exportFilter.end_date}
                              onChange={(e) =>
                                setExportFilter((f) => ({
                                  ...f,
                                  end_date: e.target.value,
                                  month: "",
                                  year: "",
                                }))
                              }
                              className="w-full rounded border bg-white px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        {!isRangeValid && (
                          <p className="text-xs text-amber-600">
                            Provide both start and end dates or switch to Month
                            / Year.
                          </p>
                        )}
                      </TabsContent>
                    </Tabs>

                    <div className="mt-7 flex justify-end gap-3 border-t pt-4">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className="px-5"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        disabled={exportDisabled}
                        onClick={() => handleExport()}
                        className="bg-[#1c5461] hover:bg-[#17434c] text-white font-semibold px-6"
                      >
                        {loading ? "Exporting..." : "Export"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <DataTable
              columns={islandEntryColumns()}
              data={islandEntries}
              searchPlaceholder="Search by name or status..."
              searchColumn={["status", "full_name"]}
            />
          </div>
        </div>
      </main>
    </>
  );
}
