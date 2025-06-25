const db = require("../db/index");

// Create new island entry registration
const createIslandEntryRegistration = async ({ unique_code, qr_code_url, payment_method, status, total_fee, user_id }) => {
  const result = await db.query(
    `INSERT INTO island_entry_registration 
     (unique_code, qr_code_url, payment_method, status, total_fee, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [unique_code, qr_code_url, payment_method, status, total_fee, user_id]
  );
  return result.rows[0];
};

// Add group members
const createIslandEntryMembers = async (registrationId, members) => {
  const promises = members.map((member) =>
    db.query(
      `INSERT INTO island_entry_registration_members 
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

// Check if code exists
const isIslandCodeTaken = async (uniqueCode) => {
  const result = await db.query(
    `SELECT 1 FROM island_entry_registration WHERE unique_code = $1 LIMIT 1`,
    [uniqueCode]
  );
  return result.rowCount > 0;
};

// Get by code
const getIslandEntryByCode = async (uniqueCode) => {
  const result = await db.query(
    `SELECT * FROM island_entry_registration WHERE unique_code = $1`,
    [uniqueCode]
  );
  return result.rows[0];
};

// Log island entry
const logIslandEntryByRegistration = async ({ registrationId, scannedByUserId }) => {
  const result = await db.query(
    `INSERT INTO island_entry_registration_logs 
      (registration_id, scanned_by_user_id, visit_date)
     VALUES ($1, $2, CURRENT_DATE)
     RETURNING *`,
    [registrationId, scannedByUserId]
  );

  return result.rows[0];
};

const saveIslandEntryPayment = async ({ registration_id, amount, status, payment_link, reference_num }) => {
  const result = await db.query(
    `INSERT INTO island_entry_payments 
      (registration_id, amount, status, payment_link, reference_num)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [registration_id, amount, status, payment_link, reference_num]
  );
  return result.rows[0];
};

// Get latest registration by user_id
const getLatestIslandEntryByUserId = async (userId) => {
  const result = await db.query(
    `SELECT unique_code, qr_code_url
     FROM island_entry_registration
     WHERE user_id = $1
     ORDER BY registration_date DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0];
};

module.exports = {
  createIslandEntryRegistration,
  createIslandEntryMembers,
  isIslandCodeTaken,
  getIslandEntryByCode,
  logIslandEntryByRegistration,
  saveIslandEntryPayment,
  getLatestIslandEntryByUserId,
};
