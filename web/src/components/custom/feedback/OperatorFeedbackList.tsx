import React from "react";
import { Feedback } from "@/hooks/useFeedbackManager";

interface OperatorFeedbackListProps {
  feedback: Feedback[];
  loading?: boolean;
  error?: string | null;
}

export const OperatorFeedbackList: React.FC<OperatorFeedbackListProps> = ({
  feedback,
  loading,
  error,
}) => {
  if (loading)
    return (
      <div className="flex items-center justify-center py-8 text-[#1c5461] font-semibold">
        Loading feedback...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-8 text-[#c0392b] font-semibold">
        {error}
      </div>
    );
  if (!feedback || feedback.length === 0)
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        No feedback found.
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-[#e6f7fa] rounded-2xl shadow-xl">
        <thead>
          <tr className="bg-[#e6f7fa] text-[#1c5461]">
            <th className="py-3 px-4 text-left font-semibold rounded-tl-2xl">
              Question
            </th>
            <th className="py-3 px-4 text-left font-semibold">Score</th>
            <th className="py-3 px-4 text-left font-semibold">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((item, idx) => (
            <tr
              key={item.group_id + "-" + idx}
              className={`border-t ${
                idx % 2 === 0 ? "bg-white" : "bg-[#f7fafc]"
              }`}
            >
              <td className="py-3 px-4">{item.question_text}</td>
              <td className="py-3 px-4 font-bold text-[#51702c]">
                {item.score}
              </td>
              <td className="py-3 px-4">
                {new Date(item.submitted_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
