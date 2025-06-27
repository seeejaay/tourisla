import React from "react";
import { Feedback } from "@/hooks/useFeedbackManager";

interface OperatorFeedbackListProps {
  feedback: Feedback[];
  loading?: boolean;
  error?: string | null;
}

export const OperatorFeedbackList: React.FC<OperatorFeedbackListProps> = ({ feedback, loading, error }) => {
  if (loading) return <div className="text-blue-600">Loading feedback...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!feedback || feedback.length === 0) return <div className="text-gray-500">No feedback found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="py-2 px-4 text-left">Question</th>
            <th className="py-2 px-4 text-left">Score</th>
            <th className="py-2 px-4 text-left">Submitted At</th>
            <th className="py-2 px-4 text-left">Submitted By (User ID)</th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((item, idx) => (
            <tr key={item.group_id + '-' + idx} className="border-t">
              <td className="py-2 px-4">{item.question_text}</td>
              <td className="py-2 px-4">{item.score}</td>
              <td className="py-2 px-4">{new Date(item.submitted_at).toLocaleString()}</td>
              <td className="py-2 px-4">{item.submitted_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
