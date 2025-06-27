import { useState, useCallback } from "react";
import { fetchFeedbackForEntity, fetchOperatorApplicantByUserId } from "@/lib/api/getFeedback";

export interface Feedback {
import { useState, useEffect, useMemo } from "react";
import { fetchAllFeedbackByEntity } from "@/lib/api/feedback";

export type FeedbackType = "SPOT" | "GUIDE" | "OPERATOR";

export type Feedback = {
  group_id: number;
  question_text: string;
  score: number;
  submitted_at: string;
  submitted_by: string;
  type: FeedbackType;
};

export function useFeedbackManager() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [typeFilter, setTypeFilter] = useState<"ALL" | FeedbackType>("ALL");
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
          const tagged = [
            ...spot.map((f: Feedback) => ({ ...f, type: "SPOT" })),
            ...guide.map((f: Feedback) => ({ ...f, type: "GUIDE" })),
            ...operator.map((f: Feedback) => ({ ...f, type: "OPERATOR" })),
          ];
          setFeedbacks(tagged);
        } else {
          const data = await fetchAllFeedbackByEntity(typeFilter);
          const tagged = data.map((f: Feedback) => ({ ...f, type: typeFilter }));
          setFeedbacks(tagged);
        }
      } catch (err) {
        console.error("Failed to load feedbacks", err);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    getAllFeedback();
  }, [typeFilter]);

  // Group feedbacks by submission (group_id)
  const groupedFeedbacks = useMemo(() => {
    const groups: Record<number, Feedback[]> = {};
    for (const entry of feedbacks) {
      if (!groups[entry.group_id]) {
        groups[entry.group_id] = [];
      }
      groups[entry.group_id].push(entry);
    }
    return groups;
  }, [feedbacks]);

  return {
    feedbacks,             
    groupedFeedbacks,      
    loading,
    typeFilter,
    setTypeFilter,
  };
}
