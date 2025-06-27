import { useState, useEffect } from "react";
import { fetchAllFeedbackByEntity } from "@/lib/api/feedback";

export type SpotFeedback = {
  group_id: number;
  submitted_at: string;
  submitted_by: string | number;
  question_text: string;
  score: number;
};

export function useSpotFeedbackManager() {
  const [feedbacks, setFeedbacks] = useState<SpotFeedback[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSpotFeedback = async () => {
      setLoading(true);
      try {
        const data = await fetchAllFeedbackByEntity("SPOT");
        setFeedbacks(data);
      } catch (err) {
        console.error("Failed to load spot feedback", err);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotFeedback();
  }, []);

  return { feedbacks, loading };
}
