"use client";
import Sidebar from "@/components/custom/sidebar";
import directorNavigation from "@/app/static/navigation/director-navigation";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar navigation={directorNavigation} />
      <main className="flex-1 ">{children}</main>
    </div>
  );
}
