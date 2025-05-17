const e = require("express");
const {
  createGuideUploadDocu,
  editGuideUploadDocu,
  getGuideUploadDocuById
} = require("../models/guideUploadDocuModel.js");

// from tour guide's end: can upload (create), update, and view their own documents only

const createGuideUploadDocuController = async (req, res) => {
  try {
    const { guideId } = req.params;
    const { document_type, file_path } = req.body;

    const allowedTypes = ['gov_id', 'residency_cert', 'training_cert', 'resume'];
    if (!allowedTypes.includes(document_type)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    const guideUploadDocu = await createGuideUploadDocu({
      tourguide_id: guideId,
      document_type,
      file_path
    });

    res.json(guideUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const editGuideUploadDocuController = async (req, res) => {
  try {
    const { docuId } = req.params;
    const { document_type, file_path } = req.body;

    const allowedTypes = ['gov_id', 'residency_cert', 'training_cert', 'resume'];
    if (!allowedTypes.includes(document_type)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    const guideUploadDocu = await editGuideUploadDocu(docuId, {
      document_type,
      file_path
    });

    res.json(guideUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const getGuideUploadDocuByIdController = async (req, res) => {
  try {
    const { docuId } = req.params;
    const currentUserId = req.session.user.id; // current user ID from session

    const guideUploadDocu = await getGuideUploadDocuById(docuId);

    if (!guideUploadDocu) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (guideUploadDocu.tourguide_id !== currentUserId) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    res.json(guideUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createGuideUploadDocuController,
  editGuideUploadDocuController,
  getGuideUploadDocuByIdController
};