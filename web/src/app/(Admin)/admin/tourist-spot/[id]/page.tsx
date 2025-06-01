"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import ViewTouristSpot from "@/components/custom/tourist-spot/viewTouristSpot";
import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";

export default function TouristSpotDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [touristSpot, setTouristSpot] = useState<TouristSpot | null>(null);

  const { loggedInUser } = useAuth();
  const { viewTouristSpot, loading, error } = useTouristSpotManager();

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
      viewTouristSpot(id as string)
        .then((data) => setTouristSpot(data))
        .catch(() => setTouristSpot(null));
    }

    getCurrentUser();
  }, [id, router, loggedInUser, viewTouristSpot]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!touristSpot) return <div>Tourist spot not found.</div>;

  return <ViewTouristSpot touristSpot={touristSpot} />;
}
