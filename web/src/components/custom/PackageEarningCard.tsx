"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface PackageEarningsData {
  packageid: number;
  packagename: string;
  earnings: string;
}

interface PackageEarningsCardProps {
  data: PackageEarningsData[];
  loading?: boolean;
}

export function PackageEarningsCard({
  data,
  loading,
}: PackageEarningsCardProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  // Process package data
  const packageChartData = data.map((item) => ({
    ...item,
    earnings: Number(item.earnings),
    packageName: item.packagename,
  }));

  // Get unique package names for filter dropdown
  const packageNames = Array.from(
    new Set(packageChartData.map((item) => item.packageName))
  );

  // Filter data based on selected package
  const filteredPackageData = selectedPackage
    ? packageChartData.filter((item) => item.packageName === selectedPackage)
    : packageChartData;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Earnings by Package
            </CardTitle>
            <CardDescription>
              {filteredPackageData.length > 0
                ? `Showing ${filteredPackageData.length} package(s)`
                : "No data available"}
            </CardDescription>
          </div>
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm bg-background"
            disabled={loading}
          >
            <option value="">All Packages</option>
            {packageNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : packageChartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No package data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredPackageData}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
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
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-3 border rounded-lg shadow-sm">
                        <p className="font-medium">
                          {payload[0].payload.packageName}
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
              <Bar
                dataKey="earnings"
                fill="var(--secondary)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
