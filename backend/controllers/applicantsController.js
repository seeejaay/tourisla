const {
  getTourGuideApplicants,
  getTourGuideApplicantById,
  approveTourGuideApplicantById,
  rejectTourGuideApplicantById,
  getTourOperatorApplicants,
  getTourOperatorApplicantById,
  approveTourOperatorApplicantById,
  rejectTourOperatorApplicantById,
  getOperatorApplicantByUserId,
} = require("../models/applicantsModel.js");
const db = require("../db/index.js");

// from admin side: manually verify tour guide and tour operator applicants

// Tour Guide Applicants
const viewTourGuideApplicantsController = async (req, res) => {
  try {
    const guide_applicants = await getTourGuideApplicants();
    res.json(guide_applicants);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewTourGuideApplicantDetailsController = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const guide_applicant = await getTourGuideApplicantById(applicantId);

    if (!guide_applicant) {
      return res
        .status(404)
        .json({ message: "Tour guide applicant not found" });
    }

    res.json(guide_applicant);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const approveTourGuideApplicantController = async (req, res) => {
  try {
    const { guideUserId } = req.body;
    const updatedApplicant = await approveTourGuideApplicantById(guideUserId);

    if (!updatedApplicant) {
      return res
        .status(404)
        .json({ message: "Tour guide applicant not found" });
    }

    res.json({ message: "Tour guide applicant approved" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const rejectTourGuideApplicantController = async (req, res) => {
  try {
    const { guideUserId } = req.body;
    const updatedApplicant = await rejectTourGuideApplicantById(guideUserId);

    if (!updatedApplicant) {
      return res
        .status(404)
        .json({ message: "Tour guide applicant not found" });
    }

    res.json({ message: "Tour guide applicant rejected" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

// Tour Operator Applicants
const viewTourOperatorApplicantsController = async (req, res) => {
  try {
    const operator_applicants = await getTourOperatorApplicants();
    res.json(operator_applicants);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewTourOperatorApplicantDetailsController = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const operator_applicant = await getTourOperatorApplicantById(applicantId);

    if (!operator_applicant) {
      return res
        .status(404)
        .json({ message: "Tour operator applicant not found" });
    }

    res.json(operator_applicant);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const approveTourOperatorApplicantController = async (req, res) => {
  try {
    const { applicantId } = req.body;
    const updatedApplicant =
      await approveTourOperatorApplicantById(applicantId);

    if (!updatedApplicant) {
      return res
        .status(404)
        .json({ message: "Tour operator applicant not found" });
    }

    res.json({ message: "Tour operator applicant approved" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const rejectTourOperatorApplicantController = async (req, res) => {
  try {
    const { applicantId } = req.body;
    const updatedApplicant = await rejectTourOperatorApplicantById(applicantId);

    if (!updatedApplicant) {
      return res
        .status(404)
        .json({ message: "Tour operator applicant not found" });
    }

    res.json({ message: "Tour operator applicant rejected" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const getOperatorApplicantByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const applicant = await getOperatorApplicantByUserId(userId);
    if (!applicant) {
      return res.status(404).json({ error: "Operator applicant not found" });
    }
    res.json(applicant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all feedback for guides under a specific operator
 * - Finds all approved tourguide_applications_to_operators for the operator
 * - Gets all feedback_groups for those tourguide_ids with type 'GUIDE'
 * - Returns feedbacks grouped by guide_id
 */
const getGuideFeedbacksForOperatorController = async (req, res) => {
  try {
    const { operatorId } = req.params;
    // 1. Find all approved guide applications to this operator
    const guideRows = await db.query(
      `SELECT tourguide_id FROM tourguide_applications_to_operators WHERE touroperator_id = $1 AND application_status = 'APPROVED'`,
      [operatorId]
    );
    const guideIds = guideRows.rows.map((r) => r.tourguide_id);
    if (guideIds.length === 0) return res.json({});

    // 2. Get all feedback_groups for these guides with type 'GUIDE'
    const feedbackRows = await db.query(
      `SELECT * FROM feedback_groups WHERE type = 'GUIDE' AND feedback_for_user_id = ANY($1)`,
      [guideIds]
    );
    // 3. Group feedbacks by guide_id
    const grouped = {};
    feedbackRows.rows.forEach((fb) => {
      if (!grouped[fb.feedback_for_user_id])
        grouped[fb.feedback_for_user_id] = [];
      grouped[fb.feedback_for_user_id].push(fb);
    });
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  viewTourGuideApplicantsController,
  viewTourGuideApplicantDetailsController,
  approveTourGuideApplicantController,
  rejectTourGuideApplicantController,
  viewTourOperatorApplicantsController,
  viewTourOperatorApplicantDetailsController,
  approveTourOperatorApplicantController,
  rejectTourOperatorApplicantController,
  getOperatorApplicantByUserIdController,
  getGuideFeedbacksForOperatorController,
};
