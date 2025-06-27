"use client";
import Sidebar from "@/components/custom/sidebar";
import DirectorNavigation from "@/app/static/navigation/director-navigation";

export default function CulturalDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar navigation={DirectorNavigation} />
      <main className="flex-1 ">{children}</main>
    </div>
  );
}
