const db = require("../db/index");

// ✅ Create new visitor registration entry
const createVisitorRegistration = async ({
  unique_code,
  qr_code_url,
  user_id,
}) => {
  const result = await db.query(
    `INSERT INTO visitor_registrations (unique_code, qr_code_url, user_id) 
     VALUES ($1, $2, $3) RETURNING *`,
    [unique_code, qr_code_url, user_id]
  );
  return result.rows[0];
};

// ✅ Add group members tied to registration_id
const createVisitorGroupMembers = async (registrationId, members) => {
  const promises = members.map((member) =>
    db.query(
      `INSERT INTO visitor_group_members 
        (registration_id, name, age, sex, is_foreign, municipality, province, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        registrationId,
        member.name,
        member.age,
        member.sex,
        member.is_foreign || false,
        member.municipality || "",
        member.province || "",
        member.country || "",
      ]
    )
  );
  const results = await Promise.all(promises);
  return results.map((res) => res.rows[0]);
};

// ✅ Check if unique code already exists
const isUniqueCodeTaken = async (uniqueCode) => {
  const result = await db.query(
    `SELECT 1 FROM visitor_registrations WHERE unique_code = $1 LIMIT 1`,
    [uniqueCode]
  );
  return result.rowCount > 0;
};

// ✅ Fetch registration by unique code
const getVisitorByUniqueCode = async (uniqueCode) => {
  const result = await db.query(
    `SELECT * FROM visitor_registrations WHERE unique_code = $1`,
    [uniqueCode]
  );
  return result.rows[0];
};

// ✅ Get attraction ID based on user ID
const getUserAttractionId = async (userId) => {
  const result = await db.query(
    `SELECT attraction_id FROM users WHERE user_id = $1 LIMIT 1`,
    [userId]
  );
  return result.rows[0]?.attraction_id || null;
};

// ✅ Log visit for group
const logAttractionVisitByRegistration = async ({
  registrationId,
  scannedByUserId,
  touristSpotId,
  userId,
}) => {
  const result = await db.query(
    `INSERT INTO attraction_visitor_logs (registration_id, scanned_by_user_id, tourist_spot_id, user_id, visit_date)
     VALUES ($1, $2, $3, $4, CURRENT_DATE)
     RETURNING *`,
    [registrationId, scannedByUserId, touristSpotId, userId]
  );

  return result.rows[0];
};

const getQRCodebyUserId = async (userId) => {
  const result = await db.query(
    `SELECT qr_code_url, unique_code, registration_date
     FROM visitor_registrations
     WHERE user_id = $1
     ORDER BY registration_date DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0];
};

// ✅ Get visit history for a user
const getVisitorHistoryByUserId = async (userId) => {
  // Join logs with registrations, group members, and optionally tourist spots
  const result = await db.query(
    `SELECT l.*, r.unique_code, r.qr_code_url, r.registration_date, m.name as member_name, m.age as member_age, m.sex as member_sex, m.is_foreign, m.municipality, m.province, m.country
     FROM attraction_visitor_logs l
     JOIN visitor_registrations r ON l.registration_id = r.id
     LEFT JOIN visitor_group_members m ON m.registration_id = r.id
     WHERE l.user_id = $1
     ORDER BY l.visit_date DESC, r.registration_date DESC`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  createVisitorRegistration,
  createVisitorGroupMembers,
  getVisitorByUniqueCode,
  isUniqueCodeTaken,
  getUserAttractionId,
  logAttractionVisitByRegistration,
  getQRCodebyUserId,
  getVisitorHistoryByUserId,
};
