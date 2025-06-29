"use client";
import React, { useState } from "react";
import {
  useFeedbackQuestions,
  FeedbackQuestion,
} from "@/hooks/useFeedbackQuestions";

const FEEDBACK_TYPES = ["SPOT", "GUIDE", "OPERATOR"];

export default function FeedbackQuestionsManager() {
  const [type, setType] = useState("SPOT");
  const [newQuestion, setNewQuestion] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const { questions, loading, createQuestion, editQuestion, deleteQuestion } =
    useFeedbackQuestions(type);

  const handleCreate = async () => {
    if (!newQuestion.trim()) return;
    await createQuestion(newQuestion);
    setNewQuestion("");
  };

  const handleEdit = async (id: number) => {
    await editQuestion(id, editText);
    setEditing(null);
    setEditText("");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this question?")) {
      await deleteQuestion(id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-8 mt-8">
      <h2 className="text-2xl font-extrabold text-[#1c5461] mb-6 text-center">
        Feedback Questions Management
      </h2>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <label className="font-semibold text-[#3e979f]">Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-[#e6f7fa] rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3e979f]"
        >
          {FEEDBACK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6 flex gap-2">
        <input
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="New question"
          className="border border-[#e6f7fa] rounded-lg px-3 py-2 flex-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3e979f]"
        />
        <button
          onClick={handleCreate}
          className="bg-[#3e979f] hover:bg-[#1c5461] text-white px-5 py-2 rounded-lg font-semibold transition-colors"
        >
          Add
        </button>
      </div>
      {loading ? (
        <div className="text-center text-[#3e979f] py-8">Loading...</div>
      ) : (
        <ul className="space-y-3">
          {questions.map((q: FeedbackQuestion) => (
            <li
              key={q.id}
              className="flex items-center gap-2 bg-[#f7fbfc] border border-[#e6f7fa] rounded-lg px-4 py-3"
            >
              {editing === q.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border border-[#e6f7fa] rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#3e979f]"
                  />
                  <button
                    onClick={() => handleEdit(q.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-semibold transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-[#17414a]">
                    {q.question_text}
                  </span>
                  <button
                    onClick={() => {
                      setEditing(q.id);
                      setEditText(q.question_text);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
