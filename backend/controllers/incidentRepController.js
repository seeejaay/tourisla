const e = require("express");
const {
  createIncidentReport,
  getAllIncidentReports,
  getIncidentReportsByUser,
  updateIncidentStatus,
} = require("../models/incidentRepModel");
const { s3Client, PutObjectCommand } = require("../utils/s3.js");

const createIncidentReportController = async (req, res) => {
  try {
    const { incident_type, location, incident_date, description } = req.body;

    let { incident_time } = req.body;
    // Pad incident_time if only HH:MM is entered
    if (/^\d{2}:\d{2}$/.test(incident_time)) {
      incident_time = `${incident_time}:00`;
    }

    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(incident_time)) {
      return res
        .status(400)
        .json({ error: "Invalid incident_time format. Use HH:MM or HH:MM:SS" });
    }

    if (
      !incident_type ||
      !location ||
      !incident_date ||
      !incident_time ||
      !description
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const submitted_by = req.session.user?.id;
    let photo_url = null;
    if (req.file) {
      const file = req.file;
      const s3Key = `incident-reports/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      photo_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    }

    const newReport = await createIncidentReport({
      submitted_by,
      incident_type,
      location,
      incident_date,
      incident_time,
      description,
      photo_url,
    });

    res.status(201).json({
      message: "Incident report submitted",
      report: newReport,
    });
  } catch (error) {
    console.error("Error submitting incident report:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const viewAllIncidentReportsController = async (req, res) => {
  try {
    const reports = await getAllIncidentReports();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching all reports:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const viewIncidentReportByUserController = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const reports = await getIncidentReportsByUser(userId);
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching user reports:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateIncidentStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["RECEIVED", "RESOLVED", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await updateIncidentStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Incident report not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      report: updated,
    });
  } catch (error) {
    console.error("Error updating status:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createIncidentReportController,
  viewAllIncidentReportsController,
  viewIncidentReportByUserController,
  updateIncidentStatusController,
};
