"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTourOperatorManager } from "@/hooks/useTourOperatorManager";
import ViewTourOperator from "@/components/custom/tour-operator/viewTourOperator";
import { TourOperator } from "@/components/custom/tour-operator/column";

export default function TourOperatorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tourOperator, setTourOperator] = useState<TourOperator | null>(null);

  const { loggedInUser } = useAuth();
  const { fetchApplicant, loading, error } = useTourOperatorManager();

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
      fetchApplicant(Number(id))
        .then((data) => setTourOperator(data))
        .catch(() => setTourOperator(null));
    }

    getCurrentUser();
  }, [id, router, loggedInUser, fetchApplicant]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!tourOperator) return <div>Tour operator not found.</div>;

  return <ViewTourOperator tourOperator={tourOperator} />;
}
