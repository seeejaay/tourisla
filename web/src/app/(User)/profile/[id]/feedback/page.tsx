"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useFeedbackManager } from "@/hooks/useOperatorFeedbackManager";
import { OperatorFeedbackList } from "@/components/custom/feedback/OperatorFeedbackList";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
export default function OperatorFeedbackPage() {
  const { feedback, loading, error, getOperatorFeedbackByUserId } =
    useFeedbackManager();
  const [operatorId, setOperatorId] = useState<number | null>(null);

  const { loggedInUser } = useAuth();
  const router = useRouter();
  // ...existing code...
  useEffect(() => {
    async function fetchUserAndFeedback() {
      const res = await loggedInUser(router);
      const id = res?.data?.user?.id || res?.data?.user?.user_id;
      if (id) {
        setOperatorId(id);

        getOperatorFeedbackByUserId(operatorId);
      }
    }
    fetchUserAndFeedback();
  }, [loggedInUser, router, getOperatorFeedbackByUserId, operatorId]);
  // ...existing code...

  // Fetch feedback for each guide
  const fetchGuideFeedback = useCallback(async (guideId: number) => {
    setGuidesFeedback((prev) => ({
      ...prev,
      [guideId]: { feedback: [], loading: true, error: null },
    }));
    try {
      const res = await fetch(
        "/api/feedback/entity?type=GUIDE&ref_id=" + guideId,
        { credentials: "include" }
      );
      const data = await res.json();
      setGuidesFeedback((prev) => ({
        ...prev,
        [guideId]: { feedback: data, loading: false, error: null },
      }));
    } catch (err) {
      setGuidesFeedback((prev) => ({
        ...prev,
        [guideId]: {
          feedback: [],
          loading: false,
          error: err?.message || "Failed to fetch guide feedback",
        },
      }));
    }
  }, []);

  useEffect(() => {
    guides.forEach((g) => {
      if (!guidesFeedback[g.id]) fetchGuideFeedback(g.id);
    });
    // eslint-disable-next-line
  }, [guides]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
        Tour Operator Feedback
      </h1>
      <OperatorFeedbackList
        feedback={feedback}
        loading={loading}
        error={error}
      />
    </div>
  );
}
