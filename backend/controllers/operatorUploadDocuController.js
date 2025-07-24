const e = require("express");
const {
  createOperatorUpload,
  editOperatorUpload,
  getOperatorUploadById,
  getOperatorUploadByUserId,
  approveOperatorUpload,
  rejectOperatorUpload,
} = require("../models/operatorUploadDocuModel.js");

const {
  getOperatorRegisById,
  getOperatorRegisByUserId,
} = require("../models/operatorRegisModel.js"); // Adjust the path as necessary

const { s3Client, PutObjectCommand } = require("../utils/s3.js"); // Adjust the path as necessary
const {
  sendDocumentApproveEmail,
  sendDocumentRejectEmail,
} = require("../utils/email.js"); // Adjust the path as necessary
// from tour operator's end: can upload (create), update, and view their own documents only

const createOperatorUploadDocuController = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const operatorReg = await getOperatorRegisById(operatorId);

    const operator_id = operatorReg.id;

    console.log("Operator ID:", operator_id);
    let { document_type } = req.body;

    const allowedTypes = [
      "LETTER_OF_INTENT",
      "BUSINESS_PERMIT",
      "DTI_OR_SEC",
      "BIR_CERTIFICATE",
      "PROOF_OF_OFFICE",
      "OFFICE_PHOTOS",
      "BRGY_CLEARANCE",
      "DOLE_REGISTRATION",
      "EMPLOYEE_LIST",
      "MANAGER_RESUME_ID",
      "MANAGER_PROOF_OF_EXPERIENCE",
      "TOUR_PACKAGES_LIST",
      "PARTNER_ESTABLISHMENTS",
      "VOUCHER_SAMPLE",
      "CLIENT_FEEDBACK_FORM",
      "AFFIDAVIT_OF_UNDERTAKING",
      "ECC_OR_CNC",
    ];

    if (!allowedTypes.includes(document_type)) {
      return res.status(400).json({ error: "Invalid document type." });
    }

    // Handle file upload for tour operator's document
    let file_path = null;
    if (req.file) {
      const file = req.file;
      const s3Key = `operators/${operator_id}/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      file_path = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } else {
      return res.status(400).json({ error: "File is required." });
    }

    const operatorUploadDocu = await createOperatorUpload({
      touroperator_id: operator_id,
      document_type,
      file_path,
    });

    res.json(operatorUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const editOperatorUploadDocuController = async (req, res) => {
  try {
    const { operatorId, documentId } = req.params;
    let { document_type } = req.body;

    const allowedTypes = [
      "LETTER_OF_INTENT",
      "BUSINESS_PERMIT",
      "DTI_OR_SEC",
      "BIR_CERTIFICATE",
      "PROOF_OF_OFFICE",
      "OFFICE_PHOTOS",
      "BRGY_CLEARANCE",
      "DOLE_REGISTRATION",
      "EMPLOYEE_LIST",
      "MANAGER_RESUME_ID",
      "MANAGER_PROOF_OF_EXPERIENCE",
      "TOUR_PACKAGES_LIST",
      "PARTNER_ESTABLISHMENTS",
      "VOUCHER_SAMPLE",
      "CLIENT_FEEDBACK_FORM",
      "AFFIDAVIT_OF_UNDERTAKING",
      "ECC_OR_CNC",
    ];

    if (!allowedTypes.includes(document_type)) {
      return res.status(400).json({ error: "Invalid document type." });
    }

    // Handle file upload if new file provided
    let file_path = null;
    if (req.file) {
      const file = req.file;
      const s3Key = `operators/documents/${documentId}/${Date.now()}_${file.originalname}`;
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

    const operatorUploadDocu = await editOperatorUpload(documentId, updateData);

    res.json(operatorUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const getOperatorUploadDocuByIdController = async (req, res) => {
  try {
    const { documentId } = req.params;
    const currentUserId = req.session.user.id; // current user ID from session
    const operatorUploadDocu = await getOperatorUploadById(documentId);

    if (!operatorUploadDocu) {
      return res.status(404).json({ error: "Document not found." });
    }

    if (operatorUploadDocu.touroperator_id !== currentUserId) {
      return res.status(403).json({ error: "Forbidden: Access denied." });
    }

    res.json(operatorUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getOperatorUploadByUserIdController = async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    console.log(currentUserId); // current user ID from session
    const operatorReg = await getOperatorRegisById(currentUserId);
    console.log(operatorReg);
    if (!operatorReg) {
      return res
        .status(404)
        .json({ error: "No documents found for this user." });
    }

    const tourOperatorId = operatorReg.id;

    const operatorUploads = await getOperatorUploadByUserId(tourOperatorId);

    if (!operatorUploads || operatorUploads.length === 0) {
      return res
        .status(404)
        .json({ error: "No documents found for this tour operator." });
    }
    res.json(operatorUploads);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const approveOperatorUploadDocuController = async (req, res) => {
  try {
    const { docuId } = req.body;
    const operatorUploadDocu = await approveOperatorUpload(docuId);
    const operatorReg = await getOperatorRegisByUserId(
      operatorUploadDocu.touroperator_id
    );
    console.log("Operator Registration:", operatorReg);
    if (!operatorUploadDocu) {
      return res.status(404).json({ error: "Document not found." });
    }
    const operatorEmail = operatorReg.email;

    if (operatorUploadDocu.status === "APPROVED") {
      await sendDocumentApproveEmail(operatorEmail, operatorUploadDocu);
    }
    res.json(operatorUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const rejectOperatorUploadDocuController = async (req, res) => {
  try {
    const { docuId } = req.body;
    const operatorUploadDocu = await rejectOperatorUpload(docuId);
    console.log("Rejected Document:", operatorUploadDocu);
    const operatorReg = await getOperatorRegisByUserId(
      operatorUploadDocu.touroperator_id
    );
    if (!operatorUploadDocu) {
      return res.status(404).json({ error: "Document not found." });
    }
    const operatorEmail = operatorReg.email;
    if (operatorUploadDocu.status === "REJECTED") {
      await sendDocumentRejectEmail(operatorEmail, operatorUploadDocu);
    }

    res.json(operatorUploadDocu);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
module.exports = {
  createOperatorUploadDocuController,
  editOperatorUploadDocuController,
  getOperatorUploadDocuByIdController,
  getOperatorUploadByUserIdController,
  approveOperatorUploadDocuController,
  rejectOperatorUploadDocuController,
};
