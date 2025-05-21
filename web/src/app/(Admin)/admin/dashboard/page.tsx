"use client";

import Sidebar from "@/components/custom/sidebar";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { currentUser } from "@/lib/api"; // Import the currentUser function
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // State for loading status
  const [authChecked, setAuthChecked] = useState(false); // State to check if auth is checked
  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await currentUser();
        console.log("Current user:", user); // Debug log

        // Fix: Check if user exists and has a role
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.replace("/");
      } finally {
        setLoading(false); //optional can remove
        setAuthChecked(true);
      }
    }
    getCurrentUser();
  }, [router]);

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Sidebar />
      {/* Main content */}
      <div className="flex flex-col items-center justify-center bg-gray-200 min-h-screen py-2 lg:pl-0 pl-16">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="mt-4 text-lg">Welcome to the admin dashboard!</p>
          </>
        )}
      </div>
    </>
  );
}
