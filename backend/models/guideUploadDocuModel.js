const db = require("../db/index.js");

const createGuideUploadDocu = async (guideUploadDocuData) => {
  const { tourguide_id, document_type, file_path } = guideUploadDocuData;

  const result = await db.query(
    "INSERT INTO tourguide_documents (tourguide_id, document_type, file_path, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *",
    [tourguide_id, document_type, file_path]
  );
  return result.rows[0];
};

const editGuideUploadDocu = async (docuId, guideUploadDocuData) => {
  const { document_type, file_path } = guideUploadDocuData;

  const result = await db.query(
    "UPDATE tourguide_documents SET document_type = $1, file_path = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
    [document_type, file_path, docuId]
  );
  return result.rows[0];
};

const getGuideUploadDocuById = async (docuId) => {
  const result = await db.query(
    "SELECT * FROM tourguide_documents WHERE id = $1",
    [docuId]
  );
    return result.rows[0];
};

module.exports = {
  createGuideUploadDocu,
  editGuideUploadDocu,
  getGuideUploadDocuById
};