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
        const { document_type, file_path } = req.body;

        const allowedTypes = [
            "letter_of_intent",
            "business_permit",
            "dti_or_sec",
            "bir_certificate",
            "proof_of_office",
            "office_photos",
            "brgy_clearance",
            "dole_registration",
            "employee_list",
            "manager_resume_id",
            "manager_proof_of_experience",
            "tour_packages_list",
            "partner_establishments",
            "voucher_sample",
            "client_feedback_form",
            "affidavit_of_undertaking",
            "ecc_or_cnc"
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
        const { document_type, file_path } = req.body;

        const allowedTypes = [
            "letter_of_intent",
            "business_permit",
            "dti_or_sec",
            "bir_certificate",
            "proof_of_office",
            "office_photos",
            "brgy_clearance",
            "dole_registration",
            "employee_list",
            "manager_resume_id",
            "manager_proof_of_experience",
            "tour_packages_list",
            "partner_establishments",
            "voucher_sample",
            "client_feedback_form",
            "affidavit_of_undertaking",
            "ecc_or_cnc"
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