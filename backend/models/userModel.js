const db = require("../db/index.js");

const createUser = async (userData) => {
  const {
    first_name,
    last_name,
    email,
    hashedPassword,
    phone_number,
    role,
    nationality,
    status = "Active",
    attraction_id = null,         // ✅ Default to null
    accommodation_id = null       // ✅ Default to null
  } = userData;

  const result = await db.query(
    "INSERT INTO users (first_name, last_name, email, password, phone_number, role, nationality, created_at, status, attraction_id, accommodation_id) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10) RETURNING *",
    [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      role,
      nationality,
      status,
      attraction_id,
      accommodation_id
    ]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const editUser = async (userId, userData) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(userData)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }
  if (fields.length === 0) return null;

  values.push(userId);

  const result = await db.query(
    `UPDATE users SET ${fields.join(", ")} WHERE user_id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
};

const deleteUser = async (email) => {
  const result = await db.query(
    "UPDATE users SET deleted_at = NOW(), status = $1 WHERE email = $2",
    ["Inactive", email]
  );
  return result.rowCount > 0;
};

const statusCheck = async (email) => {
  const result = await db.query("SELECT status FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const loginDate = async (email, ipAddress) => {
  const result = await db.query(
    "UPDATE users SET last_login_at = NOW(), last_login_ip = $2 WHERE email = $1 RETURNING *",
    [email, ipAddress]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
  return result.rows[0];
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  editUser,
  deleteUser,
  statusCheck,
  loginDate,
};
