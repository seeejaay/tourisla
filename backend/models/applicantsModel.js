const db = require("../db/index.js");

const getTourGuideApplicants = async () => {
  // latest applicants first
  const result = await db.query("SELECT * FROM tourguide_applicants ORDER BY created_at DESC");
  return result.rows;
};

const getTourGuideApplicantById = async (id) => {
  const result = await db.query(
    "SELECT * FROM tourguide_applicants WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const approveTourGuideApplicantById = async (id) => {
  const result = await db.query(
    "UPDATE tourguide_applicants SET application_status = 'APPROVED', updated_at = NOW() WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const rejectTourGuideApplicantById = async (id) => {
  const result = await db.query(
    "UPDATE tourguide_applicants SET application_status = 'REJECTED', updated_at = NOW() WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const getTourOperatorApplicants = async () => {
  const result = await db.query("SELECT * FROM touroperator_applicants ORDER BY created_at DESC");
  return result.rows;
};

const getTourOperatorApplicantById = async (id) => {
  const result = await db.query(
    "SELECT * FROM touroperator_applicants WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const approveTourOperatorApplicantById = async (id) => {
  const result = await db.query(
    "UPDATE touroperator_applicants SET application_status = 'APPROVED', updated_at = NOW() WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const rejectTourOperatorApplicantById = async (id) => {
  const result = await db.query(
    "UPDATE touroperator_applicants SET application_status = 'REJECTED', updated_at = NOW() WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getTourGuideApplicants,
  getTourGuideApplicantById,
  approveTourGuideApplicantById,
  rejectTourGuideApplicantById,
  getTourOperatorApplicants,
  getTourOperatorApplicantById,
  approveTourOperatorApplicantById,
  rejectTourOperatorApplicantById,
};
