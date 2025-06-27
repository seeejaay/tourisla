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
      <p className="font-semibold text-gray-700 mb-2">Answers for Group ID: {groupId}</p>
      <ul className="list-disc ml-5 text-sm">
        {answers.map((ans, index) => (
          <li key={index}>
            <strong>{ans.question_text}</strong>: {ans.score}
          </li>
        ))}
      </ul>
      <button
        className="mt-3 text-sm text-blue-600 hover:underline"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default ViewFeedbackAnswers;
