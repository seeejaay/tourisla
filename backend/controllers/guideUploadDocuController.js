const e = require("express");
const {
  createGuideUploadDocu,
  editGuideUploadDocu,
  getGuideUploadDocuById
} = require("../models/guideUploadDocuModel.js");

const { s3Client, PutObjectCommand } = require("../utils/s3.js"); // Adjust the path as necessary

// from tour guide's end: can upload (create), update, and view their own documents only

const createGuideUploadDocuController = async (req, res) => {
  try {
    const { guideId } = req.params;
    let { document_type, requirements } = req.body;

    document_type = document_type.toUpperCase();
    requirements = requirements.map(req => req.toUpperCase());

    const allowedTypes = [
      'GOV_ID',
      'BIRTH_CERT',
      'NBI_CLEARANCE',
      'BRGY_CLEARANCE',
      'MED_CERT',
      'PASSPORT_PHOTO',
      'RESUME'
    ];

    if (!allowedTypes.includes(document_type)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    // all 5 requirements should be checked
    const requiredFlags = [
      "FILIPINO_CITIZEN",
      "FIT",
      "FLUENT",
      "TRAINING_CERTIFIED",
      "NO_CRIMINAL_RECORD"
    ];

    const isComplete = requiredFlags.every(flag => requirements.includes(flag));

    if (!isComplete) {
      return res.status(400).json({ error: "All qualifications must be checked." });
    }

    // Handle file upload for the tour guide's document
    let file_path = null;
    if (req.file) {
      const file = req.file;
      const s3Key = `guides/${guideId}/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      file_path = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } else {
      return res.status(400).json({ error: "File is required" });
    }

    const guideUploadDocu = await createGuideUploadDocu({
      tourguide_id: guideId,
      document_type,
      file_path,
      requirements: JSON.stringify(requirements),
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
    let { document_type } = req.body;

    document_type = document_type.toUpperCase();

    const allowedTypes = [
      'GOV_ID',
      'BIRTH_CERT',
      'NBI_CLEARANCE',
      'BRGY_CLEARANCE',
      'MED_CERT',
      'PASSPORT_PHOTO',
      'RESUME'
    ];

    if (!allowedTypes.includes(document_type)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    // Handle updating existing tour guide's document
    let file_path = null;
    if (req.file) {
      const file = req.file;
      const s3Key = `guides/documents/${docuId}/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      file_path = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    }

    const updateData = {
      document_type,
      ...(file_path && { file_path }),
    };

    const guideUploadDocu = await editGuideUploadDocu(docuId, updateData);

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