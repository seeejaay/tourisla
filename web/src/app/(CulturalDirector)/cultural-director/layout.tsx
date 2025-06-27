"use client";
import Sidebar from "@/components/custom/sidebar";
import adminNavigation from "@/app/static/navigation/admin-navigation";

export default function CulturalDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar navigation={adminNavigation} />
      <main className="flex-1 ">{children}</main>
    </div>
  );
}
