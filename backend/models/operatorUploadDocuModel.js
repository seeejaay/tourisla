const db = require("../db/index.js");

const createOperatorUpload = async (operatorUploadData) => {
  const { touroperator_id, document_type, file_path } = operatorUploadData;

  const result = await db.query(
    "INSERT INTO touroperator_documents (touroperator_id, document_type, file_path, uploaded_at, status) VALUES ($1, $2, $3, NOW(), 'PENDING') RETURNING *",
    [touroperator_id, document_type, file_path]
  );
  return result.rows[0];
};

const editOperatorUpload = async (documentId, operatorUploadData) => {
  const { document_type, file_path } = operatorUploadData;

  const result = await db.query(
    "UPDATE touroperator_documents SET document_type = $1, file_path = $2, uploaded_at = NOW(),status = 'PENDING' WHERE id = $3 RETURNING *",
    [document_type, file_path, documentId]
  );
  return result.rows[0];
};

const getOperatorUploadById = async (documentId) => {
  const result = await db.query(
    "SELECT * FROM touroperator_documents WHERE id = $1",
    [documentId]
  );
  return result.rows[0];
};

const getOperatorUploadByUserId = async (tourOperatorId) => {
  const result = await db.query(
    `SELECT * FROM touroperator_documents WHERE touroperator_id = $1
    ORDER BY
      CASE
        WHEN status = 'APPROVED' THEN 1
        WHEN status = 'PENDING' THEN 2
        WHEN status = 'REJECTED' THEN 3
        ELSE 4
      END`,
    [tourOperatorId]
  );
  return result.rows;
};

const approveOperatorUpload = async (docuId) => {
  const result = await db.query(
    "UPDATE touroperator_documents SET status = 'APPROVED', note = null WHERE id = $1 RETURNING *",
    [docuId]
  );
  return result.rows[0];
};

const rejectOperatorUpload = async (docuId, reason) => {
  const result = await db.query(
    "UPDATE touroperator_documents SET status = 'REJECTED', note = $2 WHERE id = $1 RETURNING *",
    [docuId, reason]
  );
  return result.rows[0];
};

const revokeOperatorUpload = async (docuId, reason) => {
  const result = await db.query(
    "UPDATE touroperator_documents SET status = 'REVOKED', note= $2 WHERE id = $1 RETURNING *",
    [docuId, reason]
  );
  return result.rows[0];
};

//hi
module.exports = {
  createOperatorUpload,
  editOperatorUpload,
  getOperatorUploadById,
  getOperatorUploadByUserId,
  approveOperatorUpload,
  rejectOperatorUpload,
  revokeOperatorUpload,
};
