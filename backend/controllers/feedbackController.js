const {
  createFeedbackGroup,
  submitAnswer,
  getFeedbackGroupAnswers,
  getAllFeedbackByEntity,
  createQuestion,
  getQuestionsByType,
  updateQuestion,
  deleteQuestion,
} = require("../models/feedbackModel.js");

const submitFeedbackController = async (req, res) => {
  try {
    let { type, ref_id, answers } = req.body;
    type = type.toUpperCase();

    const submitted_by = req.session.user.user_id ?? req.session.user.id;

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

    const feedbackList = await getAllFeedbackByEntity(upperType, ref_id);
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

module.exports = {
  submitFeedbackController,
  viewFeedbackGroupAnswersController,
  viewAllFeedbackForEntityController,
  createQuestionController,
  editQuestionController,
  deleteQuestionController,
  viewQuestionsByTypeController,
};
