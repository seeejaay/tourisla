"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import Sidebar from "@/components/custom/sidebar";

export default function TouristSpot() {
  const router = useRouter();

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
      }
    }
    getCurrentUser();
  }, [router, loggedInUser]);

  return (
    <>
      <Sidebar />
      <main className="">Tourist Spot Management</main>
    </>
  );
}
