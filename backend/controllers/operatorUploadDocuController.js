const e = require("express");
const {
    createOperatorUpload,
    editOperatorUpload,
    getOperatorUploadById,
} = require("../models/operatorUploadDocuModel.js");

// from tour operator's end: can upload (create), update, and view their own documents only

const createOperatorUploadDocuController = async (req, res) => {
    try {
        const { operatorId } = req.params;
        let { document_type, file_path } = req.body;

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

        const operatorUploadDocu = await createOperatorUpload({
            touroperator_id: operatorId,
            document_type,
            file_path
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
        let { document_type, file_path } = req.body;

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

        const operatorUploadDocu = await editOperatorUpload({
            touroperator_id: operatorId,
            documentId,
            document_type,
            file_path
        });

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