"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Calendar, Package } from "lucide-react";
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
  month: string; // actually a date string: "YYYY-MM-DD"
  earnings: number;
};
type MonthlyEarning = {
  month: string; // "YYYY-MM"
  earnings: number;
};

const dateRanges = [
  { label: "1 Month", value: "1m", months: 1 },
  { label: "6 Months", value: "6m", months: 6 },
  { label: "1 Year", value: "1y", months: 12 },
];

const formatDate = (dateString: string) => {
  // Handles both "YYYY-MM" and "YYYY-MM-DD"
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
  const [monthlyRange, setMonthlyRange] = useState("1y");
  const [selectedPackage, setSelectedPackage] = useState<string>("");

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

  // Process daily data
  const dailyChartData: DailyEarning[] = (monthlyEarnings || []).map(
    (item) => ({
      ...item,
      earnings: Number(item.earnings),
    })
  );
  const toTitleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  // Aggregate daily data to monthly
  const monthlyAggregated: MonthlyEarning[] = Object.values(
    dailyChartData.reduce((acc, item) => {
      const month = item.month.slice(0, 7); // "YYYY-MM"
      if (!acc[month]) acc[month] = { month, earnings: 0 };
      acc[month].earnings += item.earnings;
      return acc;
    }, {} as Record<string, MonthlyEarning>)
  );

  // Package earnings
  const packageChartData = (earningsByPackage || []).map((item) => ({
    ...item,
    earnings: Number(item.earnings),
    packageName: toTitleCase(item.packagename),
  }));

  const packageNames = Array.from(
    new Set(packageChartData.map((item) => item.packageName))
  );

  // Filter helpers
  function filterDailyByRange(data: DailyEarning[], rangeValue: string) {
    const range = dateRanges.find((r) => r.value === rangeValue);
    if (!range) return data;
    const now = new Date();
    const cutoff = new Date(
      now.getFullYear(),
      now.getMonth() - range.months + 1,
      1
    );
    return data.filter((item) => {
      const d = new Date(item.month);
      return d >= cutoff;
    });
  }
  function filterMonthlyByRange(data: MonthlyEarning[], rangeValue: string) {
    const range = dateRanges.find((r) => r.value === rangeValue);
    if (!range) return data;
    // Get last N months as "YYYY-MM"
    const now = new Date();
    const months: string[] = [];
    for (let i = 0; i < range.months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      months.push(monthStr);
    }
    return data.filter((item) => months.includes(item.month));
  }

  const filteredDailyData = filterDailyByRange(dailyChartData, monthlyRange);
  const filteredMonthlyData = filterMonthlyByRange(
    monthlyAggregated,
    monthlyRange
  );
  const filteredPackageData = packageChartData;

  const barColors = [
    "#1c8773", // Accent green
    "#ce5f27", // Sun (deep)
    "#bda156", // Sand (deep)
    "#2a7b8d", // Accent blue
    "#e8babc", // Accent pink
    "#0da6ae", // Accent teal
  ];

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

      {/* Summary Card */}
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

      {/* Daily Earnings Chart */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {monthlyRange === "1m"
                    ? "Daily earnings (last month)"
                    : monthlyRange === "6m"
                    ? "Daily earnings (last 6 months)"
                    : "Daily earnings (last year)"}
                </span>
              </CardTitle>
              <CardDescription>
                {filteredDailyData.length > 0
                  ? `${formatDate(filteredDailyData[0].month)} - ${formatDate(
                      filteredDailyData[filteredDailyData.length - 1].month
                    )}`
                  : "No data available"}
              </CardDescription>
            </div>
            <select
              value={monthlyRange}
              onChange={(e) => setMonthlyRange(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm bg-background"
            >
              {dateRanges.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
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
            <span>
              {monthlyRange === "1m"
                ? "Daily earnings (last month)"
                : monthlyRange === "6m"
                ? "Daily earnings (last 6 months)"
                : "Daily earnings (last year)"}
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Monthly Earnings Chart */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {monthlyRange === "1m"
                    ? "Monthly earnings trend"
                    : monthlyRange === "6m"
                    ? "6-Month earnings trend"
                    : "Annual earnings trend"}
                </span>
              </CardTitle>
              <CardDescription>
                {filteredMonthlyData.length > 0
                  ? `${formatDate(filteredMonthlyData[0].month)} - ${formatDate(
                      filteredMonthlyData[filteredMonthlyData.length - 1].month
                    )}`
                  : "No data available"}
              </CardDescription>
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
            <span>
              {monthlyRange === "1m"
                ? "Monthly earnings trend"
                : monthlyRange === "6m"
                ? "6-Month earnings trend"
                : "Annual earnings trend"}
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Package Earnings Chart - Full Width */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
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
                        <p className="text-secondary">
                          ₱{payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="earnings" radius={[0, 4, 4, 0]}>
                {filteredPackageData.map((entry, idx) => (
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
