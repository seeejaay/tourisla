"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import ViewTourGuide from "@/components/custom/tour-guide/viewTourGuide";
import { TourGuide } from "@/components/custom/tour-guide/column";

export default function TourGuideDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tourGuide, setTourGuide] = useState<TourGuide | null>(null);

  const { loggedInUser } = useAuth();
  const { fetchTourGuideApplicant, loading, error } = useTourGuideManager();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await loggedInUser(router);
        if (
          !user ||
          !user.data.user.role ||
          user.data.user.role !== "Tourism Staff"
        ) {
          router.replace("/");
          return;
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        router.replace("/");
        return;
      }

      if (!id) return;
      fetchTourGuideApplicant(id as string)
        .then((data) => setTourGuide(data))
        .catch(() => setTourGuide(null));
    }

    getCurrentUser();
  }, [id, router, loggedInUser, fetchTourGuideApplicant]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!tourGuide) return <div>Tour guide not found.</div>;

  return <ViewTourGuide tourGuide={tourGuide} />;
}
