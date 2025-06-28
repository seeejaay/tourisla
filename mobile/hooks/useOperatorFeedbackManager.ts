import { useState, useCallback } from "react";
import {
  fetchFeedbackForEntity,
  fetchOperatorApplicantByUserId,
} from "@/lib/api/getFeedback";

export interface Feedback {
  group_id: number;
  question_text: string;
  score: number;
  submitted_at: string;
  submitted_by: number;
}

export const useFeedbackManager = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for guide feedbacks
  const [guideFeedbacks, setGuideFeedbacks] = useState<
    Record<string, Feedback[]>
  >({});
  const [guideFeedbacksLoading, setGuideFeedbacksLoading] = useState(false);
  const [guideFeedbacksError, setGuideFeedbacksError] = useState<string | null>(
    null
  );

  const getFeedback = async (type: string, ref_id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeedbackForEntity({ type, ref_id });
      setFeedback(data);
    } catch (err) {
      setError(
        err?.response?.data?.error || err.message || "Failed to fetch feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch feedback for the current operator user (resolves applicantId first)
   * @param {string|number} userId - The current user's id
   */
  const getOperatorFeedbackByUserId = useCallback(
    async (userId: string | number) => {
      setLoading(true);
      setError(null);
      try {
        const applicant = await fetchOperatorApplicantByUserId(userId);
        console.log("Operator applicant:", applicant);

        const data = await fetchFeedbackForEntity({
          type: "OPERATOR",
          ref_id: applicant.id,
        });

        setFeedback(data);
      } catch (err) {
        setError("Failed to fetch operator feedback" + err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch all guide feedbacks for an operator
   * @param {string|number} operatorId
   */
  const getGuideFeedbacksForOperator = useCallback(
    async (operatorId: string | number) => {
      setGuideFeedbacksLoading(true);
      setGuideFeedbacksError(null);
      try {
        const data = await fetchOperatorGuideFeedbacks(operatorId);
        setGuideFeedbacks(data);
      } catch (err) {
        setGuideFeedbacksError(
          err?.response?.data?.error ||
            err.message ||
            "Failed to fetch guide feedbacks"
        );
      } finally {
        setGuideFeedbacksLoading(false);
      }
    },
    []
  );

  return {
    feedback,
    loading,
    error,
    getFeedback,
    getOperatorFeedbackByUserId,
    // New exports for guide feedbacks
    guideFeedbacks,
    guideFeedbacksLoading,
    guideFeedbacksError,
    getGuideFeedbacksForOperator,
  };
};
