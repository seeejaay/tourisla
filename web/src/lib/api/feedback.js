import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

// Fetch feedback questions for operator
export const fetchOperatorFeedbackQuestions = async () => {
  const res = await axios.get(`${API_URL}feedback/questions/OPERATOR`, {
    withCredentials: true,
  });
  return res.data;
};

// Fetch feedback questions for guide
export const fetchGuideFeedbackQuestions = async () => {
  const res = await axios.get(`${API_URL}feedback/questions/GUIDE`, {
    withCredentials: true,
  });
  return res.data;
};

// Submit feedback for operator
export const submitOperatorFeedback = async ({ operatorId, answers }) => {
  return axios.post(
    `${API_URL}feedback/submit`,
    {
      type: "OPERATOR",
      ref_id: operatorId,
      answers, // [{ question_id, score }]
    },
    { withCredentials: true }
  );
};

// Submit feedback for guide
export const submitGuideFeedback = async ({ guideId, answers }) => {
  return axios.post(
    `${API_URL}feedback/submit`,
    {
      type: "GUIDE",
      ref_id: guideId,
      answers, // [{ question_id, score }]
    },
    { withCredentials: true }
  );
};

// Fetch my operator feedbacks
export const fetchMyOperatorFeedbacks = async () => {
  const res = await axios.get(`${API_URL}feedback/my-operator-feedbacks`, {
    withCredentials: true,
  });
  return res.data;
};

// Fetch my guide feedbacks
export const fetchMyGuideFeedbacks = async () => {
  const res = await axios.get(`${API_URL}feedback/my-guide-feedbacks`, {
    withCredentials: true,
  });
  return res.data;
};

// Fetch all feedback for a given type (SPOT, GUIDE, OPERATOR)
export const fetchAllFeedbackByEntity = async (type, refId = null) => {
  const res = await axios.get(`${API_URL}feedback/entity`, {
    params: {
      type,
      ref_id: refId,
    },
    withCredentials: true,
  });
  return res.data;
};

// Fetch detailed answers for a specific feedback group
export const fetchFeedbackGroupAnswers = async (groupId) => {
  const res = await axios.get(`${API_URL}feedback/group/${groupId}`, {
    withCredentials: true,
  });
  return res.data; // [{ question_text, score }]
};