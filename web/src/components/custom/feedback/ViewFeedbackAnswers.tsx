"use client";

import { useEffect, useState } from "react";
import { fetchFeedbackGroupAnswers } from "@/lib/api/feedback";

export default function ViewFeedbackAnswers({ groupId, onClose }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnswers = async () => {
      try {
        const data = await fetchFeedbackGroupAnswers(groupId);
        setAnswers(data);
      } catch (err) {
        console.error("Error fetching answers", err);
      } finally {
        setLoading(false);
      }
    };
    getAnswers();
  }, [groupId]);

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Feedback Answers</h3>
        <button onClick={onClose} className="text-sm text-red-500 hover:underline">Close</button>
      </div>
      {loading ? (
        <p>Loading answers...</p>
      ) : (
        <ul className="list-disc ml-5 space-y-1">
          {answers.map((a, i) => (
            <li key={i}>
              <strong>{a.question_text}:</strong> {a.score}/5
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
