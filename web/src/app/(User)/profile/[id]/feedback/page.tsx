"use client";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    async function fetchUserAndFeedback() {
      const res = await loggedInUser(router);
      const id = res?.data?.user?.id || res?.data?.user?.user_id;
      if (id) {
        setOperatorId(id);
        getOperatorFeedbackByUserId(operatorId || id.toString());
      }
    }
    fetchUserAndFeedback();
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight mb-6">
          Tour Operator Feedback
        </h1>
        <div className="w-full bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-6 md:p-8">
          <OperatorFeedbackList
            feedback={feedback}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </main>
  );
}
