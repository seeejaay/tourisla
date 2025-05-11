"use client";

import Sidebar from "@/components/custom/sidebar";

export default function DashboardPage() {
  return (
    <>
      <Sidebar />
      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-4 text-lg">Welcome to the admin dashboard!</p>
      </div>
    </>
  );
}
