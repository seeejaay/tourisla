const db = require("../db/index.js");

const createFeedbackGroup = async (type, submitted_by, feedback_for_user_id = null, feedback_for_spot_id = null) => {
  const result = await db.query(
    `INSERT INTO feedback_groups (type, submitted_by, feedback_for_user_id, feedback_for_spot_id) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [type, submitted_by, feedback_for_user_id, feedback_for_spot_id]
  );
  return result.rows[0];
};

const submitAnswer = async (group_id, question_id, score) => {
  const result = await db.query(
    "INSERT INTO feedback_answers (feedback_group_id, question_id, score) VALUES ($1, $2, $3) RETURNING *",
    [group_id, question_id, score]
  );
  return result.rows[0];
};

const getFeedbackGroupAnswers = async (group_id) => {
  const result = await db.query(
    `SELECT fq.question_text, fa.score
     FROM feedback_answers fa
     JOIN feedback_questions fq ON fq.id = fa.question_id
     WHERE fa.feedback_group_id = $1`,
    [group_id]
  );
  return result.rows;
};

const getAllFeedbackByEntity = async (type, entity_id) => {
  let result;
  if (type === "SPOT") {
    result = await db.query(
      `SELECT fg.id as group_id, fq.question_text, fa.score, fg.submitted_at, fg.submitted_by
       FROM feedback_answers fa
       JOIN feedback_questions fq ON fq.id = fa.question_id
       JOIN feedback_groups fg ON fg.id = fa.feedback_group_id
       WHERE fg.type = $1 AND fg.feedback_for_spot_id = $2
       ORDER BY fg.submitted_at DESC`,
      [type, entity_id]
    );
  } else {
    result = await db.query(
      `SELECT fg.id as group_id, fq.question_text, fa.score, fg.submitted_at, fg.submitted_by
       FROM feedback_answers fa
       JOIN feedback_questions fq ON fq.id = fa.question_id
       JOIN feedback_groups fg ON fg.id = fa.feedback_group_id
       WHERE fg.type = $1 AND fg.feedback_for_user_id = $2
       ORDER BY fg.submitted_at DESC`,
      [type, entity_id]
    );
  }
  return result.rows;
};

// Question Management
const createQuestion = async (type, question_text) => {
  const result = await db.query(
    "INSERT INTO feedback_questions (type, question_text) VALUES ($1, $2) RETURNING *",
    [type, question_text]
  );
  return result.rows[0];
};

const getQuestionsByType = async (type) => {
  const result = await db.query(
    "SELECT * FROM feedback_questions WHERE type = $1",
    [type]
  );
  return result.rows;
};

const updateQuestion = async (id, question_text) => {
  const result = await db.query(
    "UPDATE feedback_questions SET question_text = $1 WHERE id = $2 RETURNING *",
    [question_text, id]
  );
  return result.rows[0];
};

const deleteQuestion = async (id) => {
  const result = await db.query("DELETE FROM feedback_questions WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

const getAllSpotFeedbacksByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM feedback_groups WHERE type = 'SPOT' AND submitted_by = $1`,
    [userId]
  );
  return result.rows;
};

const getAllOperatorFeedbacksByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM feedback_groups WHERE type = 'OPERATOR' AND submitted_by = $1`,
    [userId]
  );
  return result.rows;
};

const getAllGuideFeedbacksByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM feedback_groups WHERE type = 'GUIDE' AND submitted_by = $1`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  createFeedbackGroup,
  submitAnswer,
  getFeedbackGroupAnswers,
  getAllFeedbackByEntity,
  createQuestion,
  getQuestionsByType,
  updateQuestion,
  deleteQuestion,
  getAllSpotFeedbacksByUser,
  getAllOperatorFeedbacksByUser,
  getAllGuideFeedbacksByUser,
};
