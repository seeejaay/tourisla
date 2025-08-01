const db = require("../db/index.js");

const createGuideUploadDocu = async (guideUploadDocuData) => {
  const { tourguide_id, document_type, file_path, status } =
    guideUploadDocuData;
  const result = await db.query(
    "INSERT INTO tourguide_documents (tourguide_id, document_type, file_path, uploaded_at, status) VALUES ($1, $2, $3, NOW(), $4) RETURNING *",
    [tourguide_id, document_type, file_path, status]
  );
  return result.rows[0];
};

const editGuideUploadDocu = async (docuId, guideUploadDocuData) => {
  // note: requirements are not editable from the tour guide's end
  const { document_type, file_path } = guideUploadDocuData;

  const result = await db.query(
    "UPDATE tourguide_documents SET document_type = $1, file_path = $2, uploaded_at = NOW(), status = 'PENDING' WHERE id = $3 RETURNING *",
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

const getGuideUploadByUserId = async (tourGuideId) => {
  const result = await db.query(
    `SELECT * FROM tourguide_documents 
     WHERE tourguide_id = $1 
     ORDER BY 
       CASE 
         WHEN status = 'APPROVED' THEN 1
         WHEN status = 'PENDING' THEN 2
         WHEN status = 'REJECTED' THEN 3
         ELSE 4
       END`,
    [tourGuideId]
  );
  return result.rows;
};

const approveGuideUploadDocu = async (docuId) => {
  const result = await db.query(
    "UPDATE tourguide_documents SET status = 'APPROVED', note = '' WHERE id = $1 RETURNING *",
    [docuId]
  );
  return result.rows[0];
};

const rejectGuideUploadDocu = async (docuId, reason) => {
  const result = await db.query(
    "UPDATE tourguide_documents SET status = 'REJECTED', note = $2 WHERE id = $1 RETURNING *",
    [docuId, reason]
  );
  return result.rows[0];
};

const revokeGuideUploadDocu = async (docuId, reason) => {
  const result = await db.query(
    "UPDATE tourguide_documents SET status = 'REVOKED', note= $2 WHERE id = $1 RETURNING *",
    [docuId, reason]
  );
  return result.rows[0];
};

module.exports = {
  createGuideUploadDocu,
  editGuideUploadDocu,
  getGuideUploadDocuById,
  getGuideUploadByUserId,
  approveGuideUploadDocu,
  rejectGuideUploadDocu,
  revokeGuideUploadDocu,
};
