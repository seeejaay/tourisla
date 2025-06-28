"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { label: "Received", href: "/admin/incident-report" },
  { label: "Resolved", href: "/admin/incident-report/resolved" },
  { label: "Archived", href: "/admin/incident-report/archived" },
];

export default function IncidentTabs() {
  const pathname = usePathname();

  return (
    <div className="flex justify-center gap-4 mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        const activeColor =
          tab.label === "Resolved"
            ? "bg-green-600"
            : tab.label === "Archived"
            ? "bg-yellow-500"
            : "bg-blue-600";

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={clsx(
              "px-4 py-2 rounded-lg font-medium transition",
              isActive
                ? `${activeColor} text-white shadow`
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
