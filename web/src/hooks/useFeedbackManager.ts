import { useState, useEffect } from "react";
import { fetchAllFeedbackByEntity } from "@/lib/api/feedback";

export function useFeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllFeedback = async () => {
      setLoading(true);
      try {
        if (typeFilter === "ALL") {
          const [spot, guide, operator] = await Promise.all([
            fetchAllFeedbackByEntity("SPOT"),
            fetchAllFeedbackByEntity("GUIDE"),
            fetchAllFeedbackByEntity("OPERATOR"),
          ]);
          setFeedbacks([...spot, ...guide, ...operator]);
        } else {
          const data = await fetchAllFeedbackByEntity(typeFilter);
          setFeedbacks(data);
        }
      } catch (err) {
        console.error("Failed to load feedbacks", err);
      } finally {
        setLoading(false);
      }
    };
    getAllFeedback();
  }, [typeFilter]);

  return { feedbacks, loading, typeFilter, setTypeFilter };
}
