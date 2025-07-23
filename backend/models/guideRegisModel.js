const db = require("../db/index.js");

const createGuideRegis = async (guideRegisData) => {
  const {
    first_name,
    last_name,
    birth_date,
    sex,
    mobile_number,
    email,
    profile_picture,
    reason_for_applying,
    application_status,
    user_id, // user_id is last
  } = guideRegisData;

  const result = await db.query(
    `INSERT INTO tourguide_applicants 
      (first_name, last_name, birth_date, sex, mobile_number, email, profile_picture, reason_for_applying, application_status, created_at, updated_at, user_id) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10) 
     RETURNING *`,
    [
      first_name,
      last_name,
      birth_date,
      sex,
      mobile_number,
      email,
      profile_picture,
      reason_for_applying,
      application_status,
      user_id, // $10
    ]
  );
  return result.rows[0];
};

const editGuideRegis = async (guideId, guideRegisData) => {
  const {
    first_name,
    last_name,
    birth_date,
    sex,
    mobile_number,
    email,
    profile_picture,
    reason_for_applying,
    application_status,
  } = guideRegisData;

  const result = await db.query(
    "UPDATE tourguide_applicants SET first_name = $1, last_name = $2, birth_date = $3, sex = $4, mobile_number = $5, email = $6, profile_picture = $7, reason_for_applying = $8, application_status = $9  WHERE id = $10 RETURNING *",
    [
      first_name,
      last_name,
      birth_date,
      sex,
      mobile_number,
      email,
      profile_picture,
      reason_for_applying,
      application_status,
    ]
  );
  return result.rows[0];
};

const editGuideRegisByUserId = async (userId, guideRegisData) => {
  const { first_name, last_name, mobile_number, email } = guideRegisData;
  const result = await db.query(
    "UPDATE tourguide_applicants SET first_name = $1, last_name = $2, mobile_number = $3, email = $4 WHERE user_id = $5 RETURNING *",
    [first_name, last_name, mobile_number, email, userId]
  );
  return result.rows[0];
};

const deleteGuideRegis = async (guideId) => {
  const result = await db.query(
    "DELETE FROM tourguide_applicants WHERE id = $1 RETURNING *",
    [guideId]
  );

  return result.rows[0];
};

const getAllGuideRegis = async () => {
  const result = await db.query("SELECT * FROM tourguide_applicants");
  return result.rows;
};

const getGuideRegisById = async (userId) => {
  const result = await db.query(
    "SELECT * FROM tourguide_applicants WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
};

const getGuideUserIDByGuideId = async (guideId) => {
  const result = await db.query(
    "SELECT * FROM tourguide_applicants WHERE id = $1",
    [guideId]
  );
  return result.rows[0];
};

module.exports = {
  createGuideRegis,
  editGuideRegis,
  deleteGuideRegis,
  getAllGuideRegis,
  getGuideRegisById,
  getGuideUserIDByGuideId,
  editGuideRegisByUserId,
};
