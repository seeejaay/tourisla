const e = require("express");
const {
  isTourGuideApproved,
  applyToTourOperator,
  getApplicationsForTourOperator,
  approveTourGuideApplication,
  rejectTourGuideApplication,
  getApplications,
  getApplicationForGuideAndOperator,
} = require("../models/guideApplyToOperatorModel.js");
const { getOperatorRegisById } = require("../models/operatorRegisModel.js");
const { getGuideRegisById } = require("../models/guideRegisModel.js");

const applyToTourOperatorController = async (req, res) => {
  try {
    console.log("Received application request:", req.body);
    let { tourguide_id, touroperator_id, reason_for_applying, user_id } =
      req.body;

    reason_for_applying = reason_for_applying.toUpperCase();

    // Check if the tour guide is approved first
    const approved = await isTourGuideApproved(tourguide_id);
    if (!approved) {
      return res
        .status(403)
        .json({ message: "Tour guide must be approved before applying." });
    }
    console.log("Approved tour guide:", approved);

    const guideReg = await getGuideRegisById(tourguide_id);
    if (!guideReg) {
      return res
        .status(404)
        .json({ message: "Tour guide not found for this user." });
    }
    console.log("Guide registration found:", guideReg);
    const tourGuideId = guideReg.id;
    const userId = guideReg.user_id;
    const application = await applyToTourOperator(
      tourGuideId,
      touroperator_id,
      reason_for_applying,
      userId
    );
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const getApplicationsForTourOperatorController = async (req, res) => {
  try {
    const { operatorId } = req.params;

    const operator = await getOperatorRegisById(operatorId);
    if (!operator) {
      return res.status(404).json({ message: "Tour operator not found" });
    }
    if (operator.application_status !== "APPROVED") {
      return res.status(403).json({
        message: "Tour operator must be approved to view applications.",
      });
    }

    const operator_Id = operator.id;

    console.log("Fetching applications for operator:", operator_Id);
    const applications = await getApplicationsForTourOperator(operator_Id);
    res.json(applications);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const approveTourGuideApplicationController = async (req, res) => {
  try {
    const { applicationId, touroperatorId } = req.params;
    console.log(
      "Approving application with ID:",
      applicationId,
      "by operator:",
      touroperatorId
    );

    const operatorRegis = await getOperatorRegisById(touroperatorId);
    if (!operatorRegis) {
      return res.status(404).json({ message: "Tour operator not found" });
    }

    const updated = await approveTourGuideApplication(
      applicationId,
      operatorRegis.id
    );

    if (!updated)
      return res.status(404).json({ message: "Application not found" });

    if (updated.error) return res.status(400).json({ message: updated.error });

    res.json({ message: "Application approved", application: updated });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const rejectTourGuideApplicationController = async (req, res) => {
  try {
    const { applicationId } = req.params;
    console.log("Rejecting application with ID:", applicationId);
    const updated = await rejectTourGuideApplication(applicationId);

    if (!updated)
      return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application rejected" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const fetchAllApplicationsController = async (req, res) => {
  try {
    console.log("Fetching all tour guide applications");
    const user = req.session.user;
    if (!user || user.role !== "Tour Guide") {
      return res.status(403).json({ message: "Access denied" });
    }
    const guideRegis = await getGuideRegisById(user.id);
    if (!guideRegis) {
      return res.status(404).json({ message: "Tour guide not found" });
    }
    const currentGuideId = guideRegis.id;
    const applications = await getApplications(currentGuideId);
    res.json(applications);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const fetchGuideApplicationsController = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user || user.role !== "Tour Guide") {
      return res.status(403).json({ message: "Access denied" });
    }
    const guideRegis = await getGuideRegisById(user.id);
    if (!guideRegis) {
      return res.status(404).json({ message: "Tour guide not found" });
    }
    const currentGuideId = guideRegis.id;
    const applications = await getApplications(currentGuideId);
    res.json(applications);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const fetchGuideApplicationController = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { touroperator_id } = req.query;

    // Use applicationId (which may be tourguide_id) and touroperator_id to fetch the application
    const guideRegis = await getGuideRegisById(applicationId);
    const operatorRegis = await getOperatorRegisById(touroperator_id);
    if (!guideRegis) {
      return res.status(404).json({ message: "Tour guide not found" });
    }
    if (!operatorRegis) {
      return res.status(404).json({ message: "Tour operator not found" });
    }

    const application = await getApplicationForGuideAndOperator(
      guideRegis.id,
      operatorRegis.id
    );
    if (!application) {
      return res.status(404).json({ message: "No application found" });
    }
    res.json(application);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

module.exports = {
  applyToTourOperatorController,
  getApplicationsForTourOperatorController,
  approveTourGuideApplicationController,
  rejectTourGuideApplicationController,
  fetchAllApplicationsController,
  fetchGuideApplicationsController,
  fetchGuideApplicationController,
};
