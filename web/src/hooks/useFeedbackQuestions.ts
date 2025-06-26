import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FeedbackQuestion {
  id: number;
  type: string;
  question_text: string;
}

export interface CreateQuestionParams {
  type: string;
  question_text: string;
}

export interface EditQuestionParams {
  id: number;
  question_text: string;
}

// Utility functions
export const fetchQuestionsByType = async (type: string): Promise<FeedbackQuestion[]> => {
  const res = await axios.get(`${API_URL}feedback/questions/${type}`, { withCredentials: true });
  return res.data;
};

export const createQuestion = async ({ type, question_text }: CreateQuestionParams): Promise<FeedbackQuestion> => {
  const res = await axios.post(
    `${API_URL}feedback/create-question`,
    { type, question_text },
    { withCredentials: true }
  );
  return res.data;
};

export const editQuestion = async ({ id, question_text }: EditQuestionParams): Promise<FeedbackQuestion> => {
  const res = await axios.put(
    `${API_URL}feedback/edit-question/${id}`,
    { question_text },
    { withCredentials: true }
  );
  return res.data;
};

export const deleteQuestion = async (id: number): Promise<FeedbackQuestion> => {
  const res = await axios.delete(`${API_URL}feedback/delete-question/${id}`, { withCredentials: true });
  return res.data;
};

// The actual React hook
export function useFeedbackQuestions(type: string) {
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    const data = await fetchQuestionsByType(type);
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, [type]);

  const handleCreate = async (question_text: string) => {
    await createQuestion({ type, question_text });
    refetch();
  };

  const handleEdit = async (id: number, question_text: string) => {
    await editQuestion({ id, question_text });
    refetch();
  };

  const handleDelete = async (id: number) => {
    await deleteQuestion(id);
    refetch();
  };

  return {
    questions,
    loading,
    createQuestion: handleCreate,
    editQuestion: handleEdit,
    deleteQuestion: handleDelete,
    refetch,
  };
}