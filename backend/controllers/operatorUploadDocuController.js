const e = require("express");
const {
    createOperatorUpload,
    editOperatorUpload,
    getOperatorUploadById,
} = require("../models/operatorUploadDocuModel.js");

const { s3Client, PutObjectCommand } = require("../utils/s3.js"); // Adjust the path as necessary

// from tour operator's end: can upload (create), update, and view their own documents only

const createOperatorUploadDocuController = async (req, res) => {
    try {
        const { operatorId } = req.params;
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
            "ECC_OR_CNC"
        ];


        if (!allowedTypes.includes(document_type)) {
            return res.status(400).json({ error: "Invalid document type." });
        }

        // Handle file upload for tour operator's document
        let file_path = null;
        if (req.file) {
            const file = req.file;
            const s3Key = `operators/${operatorId}/${Date.now()}_${file.originalname}`;
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
            touroperator_id: operatorId,
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
            "ECC_OR_CNC"
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

module.exports = {
    createOperatorUploadDocuController,
    editOperatorUploadDocuController,
    getOperatorUploadDocuByIdController
};