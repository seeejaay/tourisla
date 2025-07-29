const db = require("../db/index.js");

const isTourGuideApproved = async (user_id) => {
  const result = await db.query(
    "SELECT application_status FROM tourguide_applicants WHERE user_id = $1",
    [user_id]
  );
  return result.rows[0]?.application_status === "APPROVED";
};

const applyToTourOperator = async (
  tourguide_id,
  touroperator_id,
  reason_for_applying,
  user_id
) => {
  const result = await db.query(
    "INSERT INTO tourguide_applications_to_operators (tourguide_id, touroperator_id, reason_for_applying, user_id) VALUES ($1, $2, $3,$4) RETURNING *",
    [tourguide_id, touroperator_id, reason_for_applying, user_id]
  );
  return result.rows[0];
};

const getApplicationsForTourOperator = async (touroperator_id) => {
  // 'a' is alias for 'tourguide_applications_to_operators' table
  // 'tg' is alias for 'tourguide_applicants' table
  // JOIN combines rows from both tables where a.tourguide_id matches tg.id
  const result = await db.query(
    "SELECT a.*, tg.first_name, tg.last_name, tg.email, tg.mobile_number " +
      "FROM tourguide_applications_to_operators a " +
      "JOIN tourguide_applicants tg ON a.tourguide_id = tg.id " +
      "WHERE a.touroperator_id = $1 " +
      "ORDER BY a.id DESC",
    [touroperator_id]
  );
  return result.rows;
};

const approveTourGuideApplication = async (applicationId, operator_Id) => {
  // First, get the application row
  const appResult = await db.query(
    "SELECT tourguide_id FROM tourguide_applications_to_operators WHERE user_id = $1 AND touroperator_id = $2",
    [applicationId, operator_Id]
  );
  console.log("Application result:", appResult.rows);
  const application = appResult.rows[0];
  if (!application) return null;

  // Check if already approved elsewhere
  const checkResult = await db.query(
    "SELECT * FROM tourguide_applications_to_operators WHERE tourguide_id = $1 AND application_status = 'APPROVED'",
    [application.tourguide_id]
  );
  console.log("Check result for existing approval:", checkResult.rows);
  if (checkResult.rows.length > 0) {
    return { error: "Tour guide already approved by another operator." };
  }

  // Approve this application
  const result = await db.query(
    "UPDATE tourguide_applications_to_operators SET application_status = 'APPROVED', updated_at = NOW() WHERE user_id = $1 AND touroperator_id = $2 RETURNING *",
    [applicationId, operator_Id]
  );

  // Mark all other applications as EXPIRED
  await db.query(
    "UPDATE tourguide_applications_to_operators SET application_status = 'EXPIRED', updated_at = NOW() WHERE user_id = $1 AND touroperator_id != $2 AND application_status != 'APPROVED'",
    [applicationId, operator_Id]
  );
  console.log("Updated application:", result.rows[0]);
  return result.rows[0];
};

const rejectTourGuideApplication = async (applicationId) => {
  const result = await db.query(
    "UPDATE tourguide_applications_to_operators SET application_status = 'REJECTED', updated_at = NOW() WHERE id = $1 RETURNING *",
    [applicationId]
  );
  return result.rows[0];
};

const getApplications = async (tourguide_id) => {
  const result = await db.query(
    "SELECT * FROM tourguide_applications_to_operators WHERE tourguide_id = $1  ORDER BY updated_at DESC",
    [tourguide_id]
  );
  return result.rows;
};

const getApplicationForGuideAndOperator = async (
  tourguide_id,
  touroperator_id
) => {
  const result = await db.query(
    "SELECT * FROM tourguide_applications_to_operators WHERE tourguide_id = $1 AND touroperator_id = $2 ORDER BY updated_at DESC LIMIT 1",
    [tourguide_id, touroperator_id]
  );
  return result.rows[0] || null;
};

module.exports = {
  isTourGuideApproved,
  applyToTourOperator,
  getApplicationsForTourOperator,
  approveTourGuideApplication,
  rejectTourGuideApplication,
  getApplications,
  getApplicationForGuideAndOperator,
};
