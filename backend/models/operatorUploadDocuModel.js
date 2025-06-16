const db = require("../db/index.js");

const createOperatorUpload = async (operatorUploadData) => {
  const { touroperator_id, document_type, file_path } = operatorUploadData;

  const result = await db.query(
    "INSERT INTO touroperator_documents (touroperator_id, document_type, file_path, uploaded_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
    [touroperator_id, document_type, file_path]
  );
  return result.rows[0];
};

const editOperatorUpload = async (documentId, operatorUploadData) => {
  const { document_type, file_path } = operatorUploadData;

  const result = await db.query(
    "UPDATE touroperator_documents SET document_type = $1, file_path = $2, uploaded_at = NOW() WHERE id = $3 RETURNING *",
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

const getOperatorUploadByUserId = async (userId) => {
  const result = await db.query(
    "SELECT * FROM touroperator_documents WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

module.exports = {
  createOperatorUpload,
  editOperatorUpload,
  getOperatorUploadById,
  getOperatorUploadByUserId,
};
