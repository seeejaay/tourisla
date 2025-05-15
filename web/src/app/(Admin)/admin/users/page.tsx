"use client";

import Sidebar from "@/components/custom/sidebar";
import { columns } from "@/components/custom/users/columns";
import { DataTable } from "@/components/custom/users/data-table";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/api"; // Import the fetchUsers function

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await fetchUsers(); // Use the fetchUsers function
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, []);

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
