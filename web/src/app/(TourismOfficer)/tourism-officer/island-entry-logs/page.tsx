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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

  // Chart filter state (add nextWeek, nextMonth, dateRange)
  const [chartFilter, setChartFilter] = useState<
    | "daily"
    | "lastWeek"
    | "month"
    | "year"
    | "all"
    | "nextWeek"
    | "nextMonth"
    | "dateRange"
  >("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    String(new Date().getFullYear())
  );
  // Date range state for chart
  const [chartStartDate, setChartStartDate] = useState<string>("");
  const [chartEndDate, setChartEndDate] = useState<string>("");

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

  // --- Chart Data Aggregation with Filtering ---
  // Helper to format date to YYYY-MM-DD
  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toISOString().slice(0, 10) : null;

  // Next week dates
  const today = new Date();
  const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  // Next month dates
  const nextMonthDates = (() => {
    const arr: string[] = [];
    const d = new Date(today);
    for (let i = 0; i < 31; i++) {
      arr.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 1);
    }
    return arr;
  })();

  // Expected visitors for next week
  const expectedNextWeek = islandEntries.filter((entry) => {
    const expectedDate = formatDate(entry.expected_arrival);
    return expectedDate && nextWeekDates.includes(expectedDate);
  }).length;

  // Expected visitors for next month
  const expectedNextMonth = islandEntries.filter((entry) => {
    const expectedDate = formatDate(entry.expected_arrival);
    return expectedDate && nextMonthDates.includes(expectedDate);
  }).length;

  const chartData = (() => {
    // Aggregate expected visitors by expected_arrival
    const expectedMap: Record<string, number> = {};
    islandEntries.forEach((entry) => {
      const expectedDate = formatDate(entry.expected_arrival);
      if (expectedDate) {
        expectedMap[expectedDate] = (expectedMap[expectedDate] || 0) + 1;
      }
    });

    // Aggregate actual visitors by latest_visit_date
    const actualMap: Record<string, number> = {};
    islandEntries.forEach((entry) => {
      const actualDate = formatDate(entry.latest_visit_date);
      if (actualDate) {
        actualMap[actualDate] = (actualMap[actualDate] || 0) + 1;
      }
    });

    // Combine all dates
    const allDates = Array.from(
      new Set([...Object.keys(expectedMap), ...Object.keys(actualMap)])
    ).sort();

    // Filter logic
    const todayStr = today.toISOString().slice(0, 10);
    const lastWeekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().slice(0, 10);
    });

    let filteredDates = allDates;
    if (chartFilter === "daily") {
      filteredDates = allDates.filter((d) => d === todayStr);
    } else if (chartFilter === "lastWeek") {
      filteredDates = allDates.filter((d) => lastWeekDates.includes(d));
    } else if (chartFilter === "month" && selectedMonth && selectedYear) {
      filteredDates = allDates.filter((d) => {
        const [year, month] = d.split("-");
        return (
          year === selectedYear && month === selectedMonth.padStart(2, "0")
        );
      });
    } else if (chartFilter === "year" && selectedYear) {
      filteredDates = allDates.filter((d) => d.startsWith(selectedYear + "-"));
    } else if (chartFilter === "nextWeek") {
      filteredDates = allDates.filter((d) => nextWeekDates.includes(d));
    } else if (chartFilter === "nextMonth") {
      filteredDates = allDates.filter((d) => nextMonthDates.includes(d));
    } else if (chartFilter === "dateRange" && chartStartDate && chartEndDate) {
      filteredDates = allDates.filter(
        (d) => d >= chartStartDate && d <= chartEndDate
      );
    }

    return filteredDates.map((date) => ({
      date,
      expected: expectedMap[date] || 0,
      actual: actualMap[date] || 0,
    }));
  })();

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

          <Tabs defaultValue="table" className="w-full">
            <TabsList>
              <TabsTrigger value="table">Logs Table</TabsTrigger>
              <TabsTrigger value="chart">Visitor Chart</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="max-w-7xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-4 md:p-8">
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
                            Choose a period to export visitor entries or use a
                            quick preset.
                          </DialogDescription>
                        </DialogHeader>

                        {/* Presets */}
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

                        {/* Tabs for filter mode */}
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

                          <TabsContent
                            value="monthYear"
                            className="mt-4 space-y-4"
                          >
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
                                    {Array.from({ length: 10 }, (_, i) => {
                                      const y = new Date().getFullYear() - i;
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
                                Select both month and year or switch to Date
                                Range.
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
                                Provide both start and end dates or switch to
                                Month / Year.
                              </p>
                            )}
                          </TabsContent>
                        </Tabs>

                        {/* Footer */}
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
            </TabsContent>

            <TabsContent value="chart">
              <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-4 md:p-8 mt-4">
                <h2 className="text-2xl font-bold text-[#1c5461] mb-4">
                  Expected vs Actual Visitors
                </h2>
                {/* Summary boxes for next week/month */}
                <div className="flex gap-6 mb-4">
                  <div>
                    <span className="font-semibold text-[#1c5461]">
                      Expected Visitors (Next 7 Days):{" "}
                    </span>
                    <span className="font-bold">{expectedNextWeek}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1c5461]">
                      Expected Visitors (Next 31 Days):{" "}
                    </span>
                    <span className="font-bold">{expectedNextMonth}</span>
                  </div>
                </div>
                {/* Chart Filters */}
                <div className="flex gap-3 mb-4">
                  <Select value={chartFilter} onValueChange={setChartFilter}>
                    <SelectTrigger className="min-w-[120px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Today</SelectItem>
                      <SelectItem value="lastWeek">Last 7 Days</SelectItem>
                      <SelectItem value="nextWeek">Next 7 Days</SelectItem>
                      <SelectItem value="nextMonth">Next 31 Days</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="dateRange">Date Range</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                  {chartFilter === "month" && (
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger className="min-w-[120px]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {(chartFilter === "month" || chartFilter === "year") && (
                    <Select
                      value={selectedYear}
                      onValueChange={setSelectedYear}
                    >
                      <SelectTrigger className="min-w-[120px]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
                          const y = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                  {chartFilter === "dateRange" && (
                    <>
                      <input
                        type="date"
                        value={chartStartDate}
                        onChange={(e) => setChartStartDate(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={chartEndDate}
                        onChange={(e) => setChartEndDate(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="End Date"
                      />
                    </>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="expected"
                      fill="#3e979f"
                      name="Expected Visitors"
                    />
                    <Bar
                      dataKey="actual"
                      fill="#51702c"
                      name="Actual Visitors"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
