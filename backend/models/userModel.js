const db = require("../db/index.js");
const bcrypt = require("bcrypt");

const createUser = async (userData) => {
  const {
    first_name,
    last_name,
    email,
    hashedPassword,
    phone_number,
    role,
    nationality,
    status = "Unverified",
    birth_date,
    sex,
    verify_token,
    verify_token_expires,
  } = userData;

  const result = await db.query(
    "INSERT INTO users (first_name, last_name, email, password, phone_number, role, nationality, created_at, status,birth_date, sex, verify_token, verify_token_expires) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8,$9,$10,$11,$12) RETURNING *",
    [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      role,
      nationality,
      status,
      birth_date,
      sex,
      verify_token,
      verify_token_expires,
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
  // Build dynamic SQL for only provided fields
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

const editUserStatus = async (userId, status, role) => {
  const result = await db.query(
    "UPDATE users SET status = $1, role = $2 WHERE user_id = $3 RETURNING *",
    [status, role, userId]
  );
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await db.query(
    "UPDATE users SET deleted_at = NOW(), status =$1 WHERE user_id = $2",
    ["Inactive", id]
  );
  return result.rowCount > 0; // Return true if a user was deleted
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

const setResetPasswordToken = async (email, token, expires) => {
  const result = await db.query(
    "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3 RETURNING *",
    [token, expires, email]
  );
  return result.rows[0];
};

const getUserByResetToken = async (token) => {
  const result = await db.query(
    "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
    [token]
  );
  return result.rows[0];
};

const updatePassword = async (userId, newPassword) => {
  const result = await db.query(
    "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE user_id = $2 RETURNING *",
    [newPassword, userId]
  );
  return result.rows[0];
};

const verifyUser = async (token) => {
  const result = await db.query(
    `UPDATE users
     SET status = 'Active', verify_token = NULL, verify_token_expires = NULL
     WHERE verify_token = $1 AND verify_token_expires > NOW()
     RETURNING *`,
    [token]
  );
  return result.rows[0];
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  editUser,
  editUserStatus,
  deleteUser,
  statusCheck,
  loginDate,
  setResetPasswordToken,
  getUserByResetToken,
  updatePassword,
  verifyUser,
};
