const {
  getTourGuideApplicants,
  getTourGuideApplicantById,
  approveTourGuideApplicantById,
  rejectTourGuideApplicantById,
  getTourOperatorApplicants,
  getTourOperatorApplicantById,
  approveTourOperatorApplicantById,
  rejectTourOperatorApplicantById,
} = require("../models/applicantsModel.js");

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
      return res.status(404).json({ message: "Tour guide applicant not found" });
    }

    res.json(guide_applicant);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const approveTourGuideApplicantController = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const updatedApplicant = await approveTourGuideApplicantById(applicantId);

    if (!updatedApplicant) {
      return res.status(404).json({ message: "Tour guide applicant not found" });
    }

    res.json({ message: "Tour guide applicant approved" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const rejectTourGuideApplicantController = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const updatedApplicant = await rejectTourGuideApplicantById(applicantId);

    if (!updatedApplicant) {
      return res.status(404).json({ message: "Tour guide applicant not found" });
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
      return res.status(404).json({ message: "Tour operator applicant not found" });
    }

    res.json(operator_applicant);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const approveTourOperatorApplicantController = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const updatedApplicant = await approveTourOperatorApplicantById(applicantId);

    if (!updatedApplicant) {
      return res.status(404).json({ message: "Tour operator applicant not found" });
    }

    res.json({ message: "Tour operator applicant approved" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const rejectTourOperatorApplicantController = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const updatedApplicant = await rejectTourOperatorApplicantById(applicantId);

    if (!updatedApplicant) {
      return res.status(404).json({ message: "Tour operator applicant not found" });
    }

    res.json({ message: "Tour operator applicant rejected" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
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
  rejectTourOperatorApplicantController
};
