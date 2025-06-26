"use client";
import React, { useState } from "react";
import { useFeedbackQuestions, FeedbackQuestion } from "@/hooks/useFeedbackQuestions";

const FEEDBACK_TYPES = ["SPOT", "GUIDE", "OPERATOR"];

export default function FeedbackQuestionsManager() {
  const [type, setType] = useState("SPOT");
  const [newQuestion, setNewQuestion] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const { questions, loading, createQuestion, editQuestion, deleteQuestion } = useFeedbackQuestions(type);

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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2 className="text-xl font-bold mb-4">Feedback Questions Management</h2>
      <div className="mb-4">
        <label className="mr-2">Type:</label>
        <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1">
          {FEEDBACK_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="mb-4 flex gap-2">
        <input
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          placeholder="New question"
          className="border rounded px-2 py-1 flex-1"
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {questions.map((q: FeedbackQuestion) => (
            <li key={q.id} className="mb-3 flex items-center gap-2">
              {editing === q.id ? (
                <>
                  <input
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <button onClick={() => handleEdit(q.id)} className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
                  <button onClick={() => setEditing(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                </>
              ) : (
                <>
                  <span className="flex-1">{q.question_text}</span>
                  <button
                    onClick={() => { setEditing(q.id); setEditText(q.question_text); }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
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