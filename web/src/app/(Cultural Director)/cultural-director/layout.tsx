"use client";
import { useState } from "react";
import Sidebar from "@/components/custom/sidebar";
import directorNavigation from "@/app/static/navigation/director-navigation";

export default function CulturalDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        navigation={directorNavigation}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className="flex-1 min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
