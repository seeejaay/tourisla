"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const { loggedInUser } = useAuth();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await loggedInUser(router);

        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.replace("/");
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    }
    getCurrentUser();
  }, [router, loggedInUser]);

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  return (
    <>
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
