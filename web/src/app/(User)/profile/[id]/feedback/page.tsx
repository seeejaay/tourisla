"use client";
import React, { useEffect, useState } from "react";
import { useFeedbackManager } from "@/hooks/useOperatorFeedbackManager";
import { OperatorFeedbackList } from "@/components/custom/feedback/OperatorFeedbackList";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
export default function OperatorFeedbackPage() {
  const { feedback, loading, error, getOperatorFeedbackByUserId } =
    useFeedbackManager();
  const [operatorId, setOperatorId] = useState<number>();

  const { loggedInUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndFeedback() {
      const res = await loggedInUser(router);
      const id = res?.data?.user?.id || res?.data?.user?.user_id;
      if (id) {
        setOperatorId(id.toString());

        getOperatorFeedbackByUserId(operatorId || id);
      }
    }
    fetchUserAndFeedback();
  }, [loggedInUser, router, getOperatorFeedbackByUserId, operatorId]);

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
