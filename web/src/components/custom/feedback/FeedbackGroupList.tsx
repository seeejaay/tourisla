"use client";

import { useState } from "react";
import ViewFeedbackAnswers from "@/components/custom/feedback/ViewFeedbackAnswers";

type Feedback = {
  group_id: number;
  submitted_at: string;
  submitted_by: string | number;
  question_text: string;
  score: number;
};

type FeedbackGroupListProps = {
  feedbacks: Feedback[];
};

export default function FeedbackGroupList({ feedbacks }: FeedbackGroupListProps) {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  type GroupedFeedback = {
    [groupId: string]: {
      group_id: number;
      submitted_at: string;
      submitted_by: string | number;
      answers: { question_text: string; score: number }[];
    };
  };

  // Group feedbacks by group_id
  const grouped = feedbacks.reduce<GroupedFeedback>((acc, feedback) => {
    const groupId = feedback.group_id;
    if (!acc[groupId]) {
      acc[groupId] = {
        group_id: groupId,
        submitted_at: feedback.submitted_at,
        submitted_by: feedback.submitted_by || "Unknown",
        answers: [],
      };
    }
    acc[groupId].answers.push({
      question_text: feedback.question_text,
      score: feedback.score,
    });
    return acc;
  }, {});

  // Convert to array and sort by submitted_at (desc)
  const feedbackGroups = Object.values(grouped).sort(
    (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  );

  return (
    <div className="space-y-4">
      {feedbackGroups.length === 0 ? (
        <p className="text-center text-gray-500">No feedbacks available.</p>
      ) : (
        feedbackGroups.map((group) => (
          <div
            key={group.group_id}
            className="border rounded-xl p-4 shadow-md bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">
                  Submitted By: {group.submitted_by}
                </p>
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
        ))
      )}
    </div>
  );
}
