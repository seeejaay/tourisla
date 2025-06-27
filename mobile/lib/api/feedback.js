import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Fetch feedback questions for spots
export const fetchSpotFeedbackQuestions = async () => {
  const res = await axios.get(`${API_URL}feedback/questions/SPOT`, {
    withCredentials: true,
  });
  return res.data; // Should be [{ id, question_text }]
};

// Submit feedback answers
export const submitSpotFeedback = async ({ spotId, answers }) => {
  return axios.post(
    `${API_URL}feedback/submit`,
    {
      type: "SPOT",
      ref_id: spotId,
      answers, // [{ question_id, score }]
    },
    { withCredentials: true }
  );
};

export const fetchMySpotFeedbacks = async () => {
  const res = await axios.get(`${API_URL}feedback/my-spot-feedbacks`, {
    withCredentials: true,
  });

  return res.data; // Array of feedback_groups
};
