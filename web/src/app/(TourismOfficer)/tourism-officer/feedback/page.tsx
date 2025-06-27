"use client";

import { useState } from "react";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";
import FeedbackFilterBar from "@/components/custom/feedback/FeedbackFilterBar";
import ViewFeedbackAnswers from "@/components/custom/feedback/ViewFeedbackAnswers";

type Feedback = {
  group_id: number;
  submitted_at: string;
  submitted_by: string;
  question_text: string;
  score: number;
};

type GroupedFeedback = {
  group_id: number;
  submitted_at: string;
  submitted_by: string;
  answers: { question_text: string; score: number }[];
};

export default function FeedbackPage() {
  const { feedbacks, loading, typeFilter, setTypeFilter } = useFeedbackManager();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const grouped = feedbacks.reduce<Record<number, GroupedFeedback>>((acc, feedback: Feedback) => {
    const groupId = feedback.group_id;
    if (!acc[groupId]) {
      acc[groupId] = {
        group_id: groupId,
        submitted_at: feedback.submitted_at,
        submitted_by: feedback.submitted_by,
        answers: [],
      };
    }
    acc[groupId].answers.push({ question_text: feedback.question_text, score: feedback.score });
    return acc;
  }, {});

  const feedbackGroups = Object.values(grouped);

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Feedback Answers
      </h1>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 mt-4">
        <div className="w-full md:w-1/3">
          <FeedbackFilterBar value={typeFilter} onChange={setTypeFilter} />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center text-gray-500">Loading feedbacks...</p>
      ) : feedbackGroups.length > 0 ? (
        <div className="space-y-4">
          {feedbackGroups.map((group) => (
            <div key={group.group_id} className="border rounded-xl p-4 shadow-md bg-white">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">Submitted By: {group.submitted_by}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(group.submitted_at).toLocaleString()}
                  </p>
                </div>
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  onClick={() => setSelectedGroup(group.group_id)}
                >
                  View Answers
                </button>
              </div>
              {selectedGroup === group.group_id && (
                <ViewFeedbackAnswers
                  groupId={group.group_id}
                  onClose={() => setSelectedGroup(null)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No feedbacks available.</p>
      )}
    </div>
  );
}
