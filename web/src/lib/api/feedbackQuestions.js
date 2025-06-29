import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get all questions by type
export const fetchQuestionsByType = async (type) => {
  const res = await axios.get(`${API_URL}feedback/questions/${type}`, {
    withCredentials: true,
  });
  return res.data;
};

// Create a new question
export const createQuestion = async ({ type, question_text }) => {
  const res = await axios.post(
    `${API_URL}feedback`,
    { type, question_text },
    { withCredentials: true }
  );
  return res.data;
};

// Edit a question
export const editQuestion = async ({ id, question_text }) => {
  const res = await axios.put(
    `${API_URL}feedback/questions/${id}`,
    { question_text },
    { withCredentials: true }
  );
  return res.data;
};

// Delete a question
export const deleteQuestion = async (id) => {
  const res = await axios.delete(`${API_URL}feedback/questions/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
