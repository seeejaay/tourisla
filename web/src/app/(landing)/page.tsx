"use client";

import Header from "@/components/custom/header";
import { useEffect, useState } from "react";
import { myData } from "@/lib/api";

export default function Home() {
  const [data, setData] = useState(null); // State for fetched data
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await myData(); // Fetch data from API
        setData(response); // Set the fetched data
      } catch (err) {
        setError(err.message || "An error occurred"); // Handle errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData(); // Trigger the fetch function
  }, []);

  return (
    <>
      <Header />
      <div>
        {loading && <p>Loading...</p>} {/* Show loading state */}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}{" "}
        {/* Show error message */}
        {data && (
          <div>
            <h2>Fetched Data:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>{" "}
            {/* Display fetched data */}
          </div>
        )}
      </div>
    </>
  );
}
