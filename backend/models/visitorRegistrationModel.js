const db = require("../db/index");

// ✅ Create new visitor registration entry
const createVisitorRegistration = async ({ unique_code, qr_code_url }) => {
  const result = await db.query(
    `INSERT INTO visitor_registrations (unique_code, qr_code_url) 
     VALUES ($1, $2) RETURNING *`,
    [unique_code, qr_code_url]
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
        member.municipality || '',
        member.province || '',
        member.country || '',
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

// ✅ Log visit for ALL group members
const logAttractionVisitByRegistration = async ({ groupMembers, scannedByUserId, touristSpotId }) => {
  const logs = await Promise.all(
    groupMembers.map((member) =>
      db.query(
        `INSERT INTO attraction_visitor_logs (group_member_id, scanned_by_user_id, tourist_spot_id, visit_date)
         VALUES ($1, $2, $3, CURRENT_DATE)
         RETURNING *`,
        [member.id, scannedByUserId, touristSpotId]
      )
    )
  );

  return logs.map((r) => r.rows[0]);
};

module.exports = {
  createVisitorRegistration,
  createVisitorGroupMembers,
  getVisitorByUniqueCode,
  isUniqueCodeTaken,
  getUserAttractionId,
  logAttractionVisitByRegistration, // ✅ renamed
};
