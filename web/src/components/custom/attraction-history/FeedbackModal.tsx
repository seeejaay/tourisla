import React, { useEffect, useState } from "react";
import { fetchSpotFeedbackQuestions, submitSpotFeedback } from "@/lib/api/feedback";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  spotName: string;
  spotId: number;
  onSubmitted: () => void;
  feedbackGiven?: boolean;
}

const likertIcons = ["😡", "😕", "😐", "🙂", "😍"];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open, onClose, spotName, spotId, onSubmitted, feedbackGiven = false,
}) => {
  const [questions, setQuestions] = useState<{ id: number; question_text: string }[]>([]);
  const [answers, setAnswers] = useState<{ [id: number]: number }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSpotFeedbackQuestions().then(setQuestions);
      setAnswers({});
    }
  }, [open]);

  const handleSelect = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitSpotFeedback({
        spotId,
        answers: questions.map((q) => ({
          question_id: q.id,
          score: answers[q.id],
        })),
      });
      onSubmitted();
      onClose();
    } catch {
      alert("Failed to submit feedback.");
    }
    setLoading(false);
  };

  if (!open) return null;

  if (feedbackGiven) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
          <button
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white text-2xl font-bold shadow hover:bg-red-600 transition"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4">Feedback Already Submitted</h2>
          <div className="text-center text-lg text-green-600 font-semibold">Thank you for your feedback!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <button
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white text-2xl font-bold shadow hover:bg-red-600 transition"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Leave Feedback for {spotName}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {questions.map((q) => (
            <div key={q.id} className="mb-4">
              <div className="mb-2 font-medium">{q.question_text}</div>
              <div className="flex gap-2">
                {likertIcons.map((icon, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={`text-2xl p-2 rounded-full border-2 ${
                      answers[q.id] === idx + 1
                        ? "border-blue-600 bg-blue-100"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSelect(q.id, idx + 1)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={
              loading ||
              questions.length === 0 ||
              questions.some((q) => !answers[q.id])
            }
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};