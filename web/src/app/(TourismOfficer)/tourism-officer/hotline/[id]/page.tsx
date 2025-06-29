"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import ViewHotline from "@/components/custom/hotline/viewHotline";
import { Hotline } from "@/app/static/hotline/useHotlineManagerSchema";

export default function HotlineDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hotline, setHotline] = useState<Hotline | null>();

  const { loggedInUser } = useAuth();
  const { viewHotline, loading, error } = useHotlineManager();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await loggedInUser(router);
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        router.replace("/");
        return;
      }

      if (!id) return;
      viewHotline(Number(id))
        .then((data) => setHotline(data))
        .catch(() => setHotline(null));
    }

    getCurrentUser();
  }, [id, router, loggedInUser, viewHotline]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!hotline) return <div>Hotline not found.</div>;

  return <ViewHotline hotline={hotline} />;
}
