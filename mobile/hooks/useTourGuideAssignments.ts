// useTourGuideAssignments.js
import { useEffect, useState } from "react";
import { fetchGuidePackages } from "@/lib/api/tourGuideAssignments";

export const useTourGuideAssignments = (userId) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return; // wait until we have a user id

    const loadPackages = async () => {
      try {
        setLoading(true);
        const data = await fetchGuidePackages(userId); // array of tour packages
        setPackages(data);
      } catch (err) {
        setError(err.message || "Error fetching assigned tour packages");
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, [userId]);

  return { packages, loading, error };
};
