const e = require("express");
const {
    isTourGuideApproved,
    applyToTourOperator,
    getApplicationsForTourOperator,
    approveTourGuideApplication,
    rejectTourGuideApplication,
} = require("../models/guideApplyToOperatorModel.js");

const applyToTourOperatorController = async (req, res) => {
  try {
    let { tourguide_id, touroperator_id, reason_for_applying } = req.body;

    reason_for_applying = reason_for_applying.toUpperCase();

    // Check if the tour guide is approved first
    const approved = await isTourGuideApproved(tourguide_id);
    if (!approved) {
      return res.status(403).json({ message: "Tour guide must be approved before applying." });
    }

    const application = await applyToTourOperator(tourguide_id, touroperator_id, reason_for_applying);
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const getApplicationsForTourOperatorController = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const applications = await getApplicationsForTourOperator(operatorId);
    res.json(applications);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const approveTourGuideApplicationController = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const updated = await approveTourGuideApplication(applicationId);

    if (!updated) return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application approved" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const rejectTourGuideApplicationController = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const updated = await rejectTourGuideApplication(applicationId);

    if (!updated) return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application rejected" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
  applyToTourOperatorController,
  getApplicationsForTourOperatorController,
  approveTourGuideApplicationController,
  rejectTourGuideApplicationController,
};