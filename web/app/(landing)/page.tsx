"use client";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/api";
import Navbar from "@/components/custom/navbar"; // Import the Navbar component
export default function Home() {
  const [user, setUsers] = useState<
    { first_name: string; last_name: string; email: string }[]
  >([]); // State to store user data
  const [error, setError] = useState<string | null>(null); // State to store errors

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchData("users"); // Call the API endpoint "users"
      if (data) {
        setUsers(data); // Set the fetched data to state
      } else {
        setError("Failed to fetch users.");
      }
    };

    fetchUsers(); // Call the function
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
            {user.map((user, index) => (
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
