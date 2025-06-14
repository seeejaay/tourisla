const db = require("../db/index.js");

const createGuideUploadDocu = async (guideUploadDocuData) => {
  const { tourguide_id, document_type, file_path, requirements } =
    guideUploadDocuData;

  const result = await db.query(
    "INSERT INTO tourguide_documents (tourguide_id, document_type, file_path, uploaded_at, requirements) VALUES ($1, $2, $3, NOW(), $4) RETURNING *",
    [tourguide_id, document_type, file_path, requirements]
  );
  return result.rows[0];
};

const editGuideUploadDocu = async (docuId, guideUploadDocuData) => {
  // note: requirements are not editable from the tour guide's end
  const { document_type, file_path } = guideUploadDocuData;

  const result = await db.query(
    "UPDATE tourguide_documents SET document_type = $1, file_path = $2, uploaded_at = NOW() WHERE id = $3 RETURNING *",
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

const getGuideUploadByUserId = async (userId) => {
  const result = await db.query(
    "SELECT * FROM tourguide_documents WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

module.exports = {
  createGuideUploadDocu,
  editGuideUploadDocu,
  getGuideUploadDocuById,
  getGuideUploadByUserId,
};
