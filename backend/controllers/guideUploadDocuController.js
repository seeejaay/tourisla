const e = require("express");
const {
  createGuideUploadDocu,
  editGuideUploadDocu,
  getGuideUploadDocuById,
  getGuideUploadByUserId,
} = require("../models/guideUploadDocuModel.js");

const { getGuideRegisById } = require("../models/guideRegisModel.js"); // Adjust the path as necessary

const { s3Client, PutObjectCommand } = require("../utils/s3.js"); // Adjust the path as necessary

// from tour guide's end: can upload (create), update, and view their own documents only

const createGuideUploadDocuController = async (req, res) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("req.params:", req.params);
    // Get the userId from session or params
    const userId = req.params.guideId; // or req.params.guideId if you use the URL param

    // Await the DB call to get the guide registration
    const guideReg = await getGuideRegisById(userId);
    console.log("Guide ID:", guideReg);
    if (!guideReg) {
      return res
        .status(404)
        .json({ error: "Tour guide not found for this user." });
    }
    const tourguide_id = guideReg.id;

    let { document_type, requirements } = req.body;

    // Handle requirements being a string (from FormData) or array
    if (typeof requirements === "string") {
      requirements = [requirements];
    }

    const doc_type = document_type.toUpperCase();
    const newrequirements = requirements.map((req) => req.toUpperCase());

    const allowedTypes = [
      "GOV_ID",
      "BIRTH_CERT",
      "NBI_CLEARANCE",
      "BRGY_CLEARANCE",
      "MED_CERT",
      "PASSPORT_PHOTO",
      "RESUME",
    ];

    if (!allowedTypes.includes(doc_type)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    // all 5 requirements should be checked
    const requiredFlags = [
      "FILIPINO_CITIZEN",
      "FIT",
      "FLUENT",
      "TRAINING_CERTIFIED",
      "NO_CRIMINAL_RECORD",
    ];

    const isComplete = requiredFlags.every((flag) =>
      newrequirements.includes(flag)
    );

    if (!isComplete) {
      return res
        .status(400)
        .json({ error: "All qualifications must be checked." });
    }
    console.log("Uploading Document");
    // Handle file upload for the tour guide's document
    let file_path = null;
    if (req.file) {
      const file = req.file;
      const s3Key = `guides/${tourguide_id}/${Date.now()}_${file.originalname}`;
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
      tourguide_id: tourguide_id,
      document_type: doc_type,
      file_path,
      requirements: JSON.stringify(newrequirements),
    });
    console.log("Document Created");
    res.json(guideUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};
const editGuideUploadDocuController = async (req, res) => {
  try {
    const { docuId } = req.params;
    let { document_type } = req.body;
    console.log(req.body);
    const newDocument_type = document_type.toUpperCase();

    const allowedTypes = [
      "GOV_ID",
      "BIRTH_CERT",
      "NBI_CLEARANCE",
      "BRGY_CLEARANCE",
      "MED_CERT",
      "PASSPORT_PHOTO",
      "RESUME",
    ];

    if (!allowedTypes.includes(newDocument_type)) {
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

    const guideReg = await getGuideRegisById(currentUserId);
    const tourguide_id = guideReg.id;
    if (!guideUploadDocu) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (guideUploadDocu.tourguide_id !== tourguide_id) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    res.json(guideUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getGuideUploadByUserIdController = async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    const guideReg = await getGuideRegisById(currentUserId);
    if (!guideReg) {
      return res
        .status(404)
        .json({ error: "Tour guide not found for this user." });
    }

    const tourguide_id = guideReg.id;
    // current user ID from session
    const guideUploads = await getGuideUploadByUserId(tourguide_id);

    if (!guideUploads || guideUploads.length === 0) {
      return res
        .status(404)
        .json({ error: "No documents found for this user" });
    }

    res.json(guideUploads);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createGuideUploadDocuController,
  editGuideUploadDocuController,
  getGuideUploadDocuByIdController,
  getGuideUploadByUserIdController,
};
