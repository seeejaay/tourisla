"use client";

import { useEffect, useState, useMemo } from "react";
import { TrendingUp, Calendar, Package, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  Bar,
  BarChart,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  useTotalEarnings,
  useMonthlyEarningsByTourOperator,
  useEarningsByPackage,
} from "@/hooks/useBookingManager";
import { Skeleton } from "@/components/ui/skeleton";

// Types
type DailyEarning = {
  month: string; // date string: "YYYY-MM-DD"
  earnings: number;
};
// type MonthlyEarning = {
//   month: string; // "YYYY-MM"
//   earnings: number;
// };

// Preset range options
const rangeOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last 3 Months", value: "last3m" },
  { label: "Last 6 Months", value: "last6m" },
  { label: "Last 1 Year", value: "1y" },
  { label: "Year to Date", value: "ytd" },
];

const formatDate = (dateString: string) => {
  const parts = dateString.split("-");
  if (parts.length === 2) {
    const [year, month] = parts;
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } else if (parts.length === 3) {
    const [year, month, day] = parts;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return dateString;
};

export default function EarningsPage() {
  const [rangeValue, setRangeValue] = useState("1y");
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  // Custom date range
  const [startDate, setStartDate] = useState<string>(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>(""); // YYYY-MM-DD
  const customActive = !!startDate && !!endDate;

  const clearCustomRange = () => {
    setStartDate("");
    setEndDate("");
  };

  // Hooks
  const {
    data: totalEarnings,
    fetchTotalEarnings,
    loading: loadingTotal,
  } = useTotalEarnings();
  const { data: monthlyEarnings, fetchMonthlyEarnings } =
    useMonthlyEarningsByTourOperator();
  const { data: earningsByPackage, fetchEarningsByPackage } =
    useEarningsByPackage();

  useEffect(() => {
    fetchTotalEarnings();
    fetchMonthlyEarnings();
    fetchEarningsByPackage();
  }, [fetchTotalEarnings, fetchMonthlyEarnings, fetchEarningsByPackage]);

  // Raw daily-like data (server gives daily rows)
  const dailyChartData: DailyEarning[] = (monthlyEarnings || []).map(
    (item) => ({
      ...item,
      earnings: Number(item.earnings),
    })
  );

  const toTitleCase = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

  // Aggregate to monthly
  // const monthlyAggregated: MonthlyEarning[] = useMemo(
  //   () =>
  //     Object.values(
  //       dailyChartData.reduce((acc, item) => {
  //         const month = item.month.slice(0, 7);
  //         if (!acc[month]) acc[month] = { month, earnings: 0 };
  //         acc[month].earnings += item.earnings;
  //         return acc;
  //       }, {} as Record<string, MonthlyEarning>)
  //     ).sort((a, b) => a.month.localeCompare(b.month)),
  //   [dailyChartData]
  // );

  // Package earnings
  const packageChartData = (earningsByPackage || []).map((item) => ({
    ...item,
    earnings: Number(item.earnings),
    packageName: toTitleCase(item.packagename),
  }));
  const packageNames = Array.from(
    new Set(packageChartData.map((item) => item.packageName))
  );

  // Helpers
  const parseISO = (d: string) => {
    const parts = d.split("-");
    if (parts.length === 3) {
      const [y, m, day] = parts.map(Number);
      return new Date(y, m - 1, day);
    }
    if (parts.length === 2) {
      const [y, m] = parts.map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(d);
  };

  function inCustomRange(dateStr: string) {
    if (!customActive) return true;
    const d = parseISO(dateStr);
    const s = parseISO(startDate);
    const e = parseISO(endDate);
    return d >= s && d <= e;
  }

  function filterDailyByRange(data: DailyEarning[], rv: string) {
    if (!data.length) return data;

    // Custom range overrides preset
    if (customActive) {
      return data
        .filter((d) => inCustomRange(d.month))
        .sort((a, b) => a.month.localeCompare(b.month));
    }

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(startOfToday.getTime() + 86400000 - 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const startPrevMonth = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth(),
      1
    );
    const endPrevMonth = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth() + 1,
      0
    );

    const checks: Record<string, (d: Date) => boolean> = {
      today: (d) => d >= startOfToday && d <= endOfToday,
      yesterday: (d) => {
        const yStart = new Date(startOfToday.getTime() - 86400000);
        const yEnd = new Date(startOfToday.getTime() - 1);
        return d >= yStart && d <= yEnd;
      },
      last7: (d) =>
        d >= new Date(startOfToday.getTime() - 6 * 86400000) && d <= endOfToday,
      lastMonth: (d) => d >= startPrevMonth && d <= endPrevMonth,
      last3m: (d) =>
        d >= new Date(today.getFullYear(), today.getMonth() - 3, 1),
      last6m: (d) =>
        d >= new Date(today.getFullYear(), today.getMonth() - 6, 1),
      "1y": (d) =>
        d >=
        new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      ytd: (d) => d >= startOfYear && d <= endOfToday,
    };

    const fn = checks[rv];
    if (!fn) return data;

    return data
      .filter((item) => fn(parseISO(item.month)))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  // function filterMonthlyByRange(data: MonthlyEarning[], rv: string) {
  //   if (!data.length) return data;

  //   if (customActive) {
  //     return data
  //       .filter((m) => inCustomRange(m.month + "-01"))
  //       .sort((a, b) => a.month.localeCompare(b.month));
  //   }

  //   const today = new Date();
  //   const startOfYear = new Date(today.getFullYear(), 0, 1);

  //   if (rv === "lastMonth") {
  //     const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  //     const key = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(
  //       2,
  //       "0"
  //     )}`;
  //     return data.filter((m) => m.month === key);
  //   }
  //   if (rv === "last3m") {
  //     const cutoff = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  //     return data.filter(
  //       (m) => parseISO(m.month + "-01").getTime() >= cutoff.getTime()
  //     );
  //   }
  //   if (rv === "last6m") {
  //     const cutoff = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  //     return data.filter(
  //       (m) => parseISO(m.month + "-01").getTime() >= cutoff.getTime()
  //     );
  //   }
  //   if (rv === "1y") {
  //     const cutoff = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  //     return data.filter(
  //       (m) => parseISO(m.month + "-01").getTime() >= cutoff.getTime()
  //     );
  //   }
  //   if (rv === "ytd") {
  //     return data.filter(
  //       (m) => parseISO(m.month + "-01").getTime() >= startOfYear.getTime()
  //     );
  //   }
  //   if (["today", "yesterday", "last7"].includes(rv)) {
  //     const cutoff = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  //     return data.filter(
  //       (m) => parseISO(m.month + "-01").getTime() >= cutoff.getTime()
  //     );
  //   }
  //   return data;
  // }

  const filteredDailyData = useMemo(
    () => filterDailyByRange(dailyChartData, rangeValue),
    [dailyChartData, rangeValue, customActive, startDate, endDate]
  );
  // const filteredMonthlyData = useMemo(
  //   () => filterMonthlyByRange(monthlyAggregated, rangeValue),
  //   [monthlyAggregated, rangeValue, customActive, startDate, endDate]
  // );
  const filteredPackageData = packageChartData;

  const barColors = [
    "#1c8773",
    "#ce5f27",
    "#bda156",
    "#2a7b8d",
    "#e8babc",
    "#0da6ae",
  ];

  const currentRangeLabel = customActive
    ? `Custom (${startDate} → ${endDate})`
    : rangeOptions.find((r) => r.value === rangeValue)?.label || "Last 1 Year";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 w-full">
        <CardContent className="p-6 flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">Total Earnings</span>
          {loadingTotal ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <span className="text-4xl font-bold text-primary">
              ₱{Number(totalEarnings?.totalEarnings ?? 0).toLocaleString()}
            </span>
          )}
        </CardContent>
      </Card>

      {/* Daily Earnings */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Earnings - {currentRangeLabel}</span>
                </CardTitle>
                <CardDescription>
                  {filteredDailyData.length > 0
                    ? `${formatDate(filteredDailyData[0].month)} - ${formatDate(
                        filteredDailyData[filteredDailyData.length - 1].month
                      )}`
                    : "No data available"}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <select
                  value={rangeValue}
                  disabled={customActive}
                  onChange={(e) => setRangeValue(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm bg-background disabled:opacity-50"
                >
                  {rangeOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                  />
                  {customActive && (
                    <button
                      type="button"
                      onClick={clearCustomRange}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-muted/70 text-xs"
                    >
                      <X className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredDailyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => formatDate(value)}
              />
              <YAxis />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-3 border rounded-lg shadow-sm">
                        <p className="font-medium">
                          {formatDate(payload[0].payload.month)}
                        </p>
                        <p className="text-primary">
                          ₱{payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 items-center font-medium">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Daily earnings - {currentRangeLabel}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Monthly Earnings */}
      {/* <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Monthly earnings - {currentRangeLabel}</span>
              </CardTitle>
              <CardDescription>
                {filteredMonthlyData.length > 0
                  ? `${formatDate(filteredMonthlyData[0].month)} - ${formatDate(
                      filteredMonthlyData[filteredMonthlyData.length - 1].month
                    )}`
                  : "No data available"}
              </CardDescription>
              {customActive && (
                <p className="text-xs text-muted-foreground mt-1">
                  Custom range applied to monthly aggregation.
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => formatDate(value)}
              />
              <YAxis />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-3 border rounded-lg shadow-sm">
                        <p className="font-medium">
                          {formatDate(payload[0].payload.month)}
                        </p>
                        <p className="text-primary">
                          ₱{payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 items-center font-medium">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Monthly earnings - {currentRangeLabel}</span>
          </div>
        </CardFooter>
      </Card> */}

      {/* Package Earnings */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Earnings by Package
              </CardTitle>
              <CardDescription>
                {filteredPackageData.length > 0
                  ? `Showing ${filteredPackageData.length} packages`
                  : "No data available"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm bg-background"
              >
                <option value="">All Packages</option>
                {packageNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={
                selectedPackage
                  ? filteredPackageData.filter(
                      (item) => item.packageName === selectedPackage
                    )
                  : filteredPackageData
              }
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis type="number" />
              <YAxis
                dataKey="packageName"
                type="category"
                width={120}
                tickFormatter={(value) =>
                  value.length > 15 ? `${value.substring(0, 15)}...` : value
                }
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-3 border rounded-lg shadow-sm">
                        <p className="font-medium">
                          {toTitleCase(payload[0].payload.packageName)}
                        </p>
                        <p className="text-gray-700">
                          ₱{payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="earnings" radius={[0, 4, 4, 0]}>
                {(selectedPackage
                  ? filteredPackageData.filter(
                      (item) => item.packageName === selectedPackage
                    )
                  : filteredPackageData
                ).map((entry, idx) => (
                  <Cell
                    key={entry.packageName}
                    fill={barColors[idx % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
