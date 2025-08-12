"use client";
import { useState } from "react";
import Sidebar from "@/components/custom/sidebar";
import adminNavigation from "@/app/static/navigation/admin-navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen">
      <Sidebar
        navigation={adminNavigation}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className="flex-1 min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
