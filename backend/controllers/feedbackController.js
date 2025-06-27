const db = require("../db/index.js");

const {
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
} = require("../models/feedbackModel.js");

const submitFeedbackController = async (req, res) => {
  try {
    let { type, ref_id, answers } = req.body;
    type = type.toUpperCase();

    const submitted_by = req.session.user.user_id ?? req.session.user.id;

    let existing;
    let entity = "spot";
    if (type === "SPOT") {
      existing = await db.query(
        `SELECT 1 FROM feedback_groups WHERE type = $1 AND submitted_by = $2 AND feedback_for_spot_id = $3`,
        [type, submitted_by, ref_id]
      );
      entity = "spot";
    } else if (type === "GUIDE" || type === "OPERATOR") {
      existing = await db.query(
        `SELECT 1 FROM feedback_groups WHERE type = $1 AND submitted_by = $2 AND feedback_for_user_id = $3`,
        [type, submitted_by, ref_id]
      );
      entity = type === "GUIDE" ? "guide" : "operator";
    } else {
      return res.status(400).json({ message: "Invalid feedback type" });
    }

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: `Feedback already submitted for this ${entity}.` });
    }

    let feedbackGroup;
    if (type === "SPOT") {
      feedbackGroup = await createFeedbackGroup(type, submitted_by, null, ref_id);
    } else if (type === "GUIDE" || type === "OPERATOR") {
      feedbackGroup = await createFeedbackGroup(type, submitted_by, ref_id, null);
    } else {
      return res.status(400).json({ message: "Invalid feedback type" });
    }

    for (const ans of answers) {
      await submitAnswer(feedbackGroup.id, ans.question_id, ans.score);
    }

    res.json({ message: "Feedback submitted successfully", group_id: feedbackGroup.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

// View feedback answers of a specific group
const viewFeedbackGroupAnswersController = async (req, res) => {
  try {
    const { group_id } = req.params;
    const feedback = await getFeedbackGroupAnswers(group_id);
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const viewAllFeedbackForEntityController = async (req, res) => {
  try {
    const { type, ref_id } = req.query;
    const upperType = type.toUpperCase();

    // Convert empty string or undefined to null
    const refId = ref_id ?? null;

    const feedbackList = await getAllFeedbackByEntity(upperType, refId);
    res.json(feedbackList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};


// Create new question (only officer/operator)
const createQuestionController = async (req, res) => {
  try {
    let { type, question_text } = req.body;
    type = type.toUpperCase();

    const question = await createQuestion(type, question_text);
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const editQuestionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text } = req.body;

    const updated = await updateQuestion(id, question_text);
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const deleteQuestionController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteQuestion(id);
    res.json(deleted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const viewQuestionsByTypeController = async (req, res) => {
  try {
    const { type } = req.params;
    const questions = await getQuestionsByType(type.toUpperCase());
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const getMySpotFeedbacksController = async (req, res) => {
  try {
    const userId = req.session.user?.user_id ?? req.session.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const feedbacks = await getAllSpotFeedbacksByUser(userId);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
};

const getMyOperatorFeedbacksController = async (req, res) => {
  try {
    const userId = req.session.user?.user_id ?? req.session.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const feedbacks = await getAllOperatorFeedbacksByUser(userId);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
};

const getMyGuideFeedbacksController = async (req, res) => {
  try {
    const userId = req.session.user?.user_id ?? req.session.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const feedbacks = await getAllGuideFeedbacksByUser(userId);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
};

module.exports = {
  submitFeedbackController,
  viewFeedbackGroupAnswersController,
  viewAllFeedbackForEntityController,
  createQuestionController,
  editQuestionController,
  deleteQuestionController,
  viewQuestionsByTypeController,
  getMySpotFeedbacksController,
  getMyOperatorFeedbacksController,
  getMyGuideFeedbacksController,
};
