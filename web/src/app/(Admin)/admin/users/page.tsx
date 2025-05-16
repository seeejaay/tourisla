"use client";

import Sidebar from "@/components/custom/sidebar";
import { columns } from "@/components/custom/users/columns";
import { DataTable } from "@/components/custom/users/data-table";
import { useEffect, useState } from "react";
import { fetchUsers, currentUser } from "@/lib/api"; // Import the fetchUsers function
import { useRouter } from "next/navigation"; // Import Router for navigation
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getCurrentUserAndUsers() {
      try {
        const user = await currentUser();
        console.log("Current user:", user); // Debug log

        // Fix: Check if user exists and has a role
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching user or users:", error);
        router.replace("/");
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    }
    getCurrentUserAndUsers();
  }, [router]);

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Sidebar />
      {/* Main content */}
      <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full ">
        <div className="flex max-w-[100rem] w-full flex-col  items-center justify-start gap-4 px-4 py-2 lg:pl-0 ">
          <h1 className="text-4xl font-bold">Users</h1>
          <div className="w-full max-w-[90rem] ">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={users} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
