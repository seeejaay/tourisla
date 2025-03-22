"use client";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">TourISLA Web</h1>
      <p>API Response: {data}</p>
      <Button>Click Me</Button>
    </div>
  );
}
