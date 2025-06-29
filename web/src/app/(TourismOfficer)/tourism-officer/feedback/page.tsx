"use client";

import { useState } from "react";
import { FeedbackType, useFeedbackManager } from "@/hooks/useFeedbackManager";
import FeedbackFilterBar from "@/components/custom/feedback/FeedbackFilterBar";
import ViewFeedbackAnswers from "@/components/custom/feedback/ViewFeedbackAnswers";

export default function FeedbackPage() {
  const { groupedFeedbacks, loading, typeFilter, setTypeFilter } =
    useFeedbackManager();

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const feedbackGroups = Object.entries(groupedFeedbacks).map(
    ([group_id, answers]) => ({
      group_id: Number(group_id),
      submitted_at: answers[0].submitted_at,
      submitted_by: answers[0].submitted_by,
      type: answers[0].type,
      answers: answers.map((a) => ({
        question_text: a.question_text,
        score: a.score,
      })),
    })
  );

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-5xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight mt-4">
          Feedback Answers
        </h1>

        {/* Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full bg-white rounded-xl shadow border border-[#e6f7fa] px-6 py-4">
          <div className="w-full md:w-1/3">
            <FeedbackFilterBar
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as FeedbackType | "ALL")}
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="w-full flex justify-center items-center py-12">
            <p className="text-center text-[#3e979f] text-lg animate-pulse">
              Loading feedbacks...
            </p>
          </div>
        ) : feedbackGroups.length > 0 ? (
          <div className="space-y-4 w-full">
            {feedbackGroups.map((group) => (
              <div
                key={group.group_id}
                className="border border-[#e6f7fa] rounded-2xl p-6 shadow bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                  <div>
                    <p className="font-semibold text-[#1c5461]">
                      Submitted By:{" "}
                      <span className="font-normal text-[#51702c]">
                        {group.submitted_by}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Date:{" "}
                      {new Date(group.submitted_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      Type: {group.type}
                    </p>
                  </div>
                  <button
                    className="bg-[#3e979f] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#1c5461] transition-colors"
                    onClick={() =>
                      setSelectedGroup(
                        selectedGroup === group.group_id ? null : group.group_id
                      )
                    }
                  >
                    {selectedGroup === group.group_id
                      ? "Hide Answers"
                      : "View Answers"}
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
          <div className="w-full flex justify-center items-center py-12">
            <p className="text-center text-gray-500 text-lg">
              No feedbacks available.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
