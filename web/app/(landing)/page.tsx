"use client";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/api"; // Import the fetchUsers function
import Navbar from "@/components/custom/navbar"; // Import the Navbar component

export default function Home() {
  interface User {
    first_name: string;
    last_name: string;
    email: string;
  }
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError(`Failed to fetch users ` + (err as Error).message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="p-10 pt-24 bg-[#f1f1f1] min-h-screen">
        <h1 className="text-2xl font-bold">TourISLA Web</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                {user.first_name} {user.last_name} - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
