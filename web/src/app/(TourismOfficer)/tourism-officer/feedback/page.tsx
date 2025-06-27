"use client";

import { useState } from "react";
import { FeedbackType, useFeedbackManager } from "@/hooks/useFeedbackManager";
import FeedbackFilterBar from "@/components/custom/feedback/FeedbackFilterBar";
import ViewFeedbackAnswers from "@/components/custom/feedback/ViewFeedbackAnswers";

export default function FeedbackPage() {
  const {
    groupedFeedbacks, 
    loading,
    typeFilter,
    setTypeFilter,
  } = useFeedbackManager();

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const feedbackGroups = Object.entries(groupedFeedbacks).map(([group_id, answers]) => ({
    group_id: Number(group_id),
    submitted_at: answers[0].submitted_at,
    submitted_by: answers[0].submitted_by,
    type: answers[0].type,
    answers: answers.map((a) => ({
      question_text: a.question_text,
      score: a.score,
    })),
  }));

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Feedback Answers
      </h1>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 mt-4">
        <div className="w-full md:w-1/3">
          <FeedbackFilterBar value={typeFilter} onChange={(value) => setTypeFilter(value as FeedbackType | "ALL")} />
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
                  <p className="text-sm text-gray-500">Type: {group.type}</p>
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
                  answers={group.answers}
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
