import React from "react";

type Answer = {
  question_text: string;
  score: number;
};

interface ViewFeedbackAnswersProps {
  groupId: number;
  answers: Answer[];
  onClose: () => void;
}

const ViewFeedbackAnswers: React.FC<ViewFeedbackAnswersProps> = ({
  groupId,
  answers,
  onClose,
}) => {
  return (
    <div className="mt-2 border-t pt-2">
      {/* Top row: Title + Close button aligned horizontally */}
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-gray-700">
          Answers for Group ID: {groupId}
        </p>
        <button
          className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* Answers list */}
      <ul className="list-disc ml-5 text-sm text-gray-800">
        {answers.map((ans, index) => (
          <li key={index}>
            <strong>{ans.question_text}</strong>: {ans.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewFeedbackAnswers;
