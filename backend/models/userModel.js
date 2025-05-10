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
  } = userData;

  const result = await db.query(
    "INSERT INTO users (first_name, last_name, email, password, phone_number, role, nationality, created_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8) RETURNING *",
    [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      role,
      nationality,
      status,
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

const editUser = async (oldEmail, userData) => {
  const {
    first_name,
    last_name,
    email: newEmail,
    password,
    phone_number,
    nationality,
  } = userData;

  const result = await db.query(
    "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, phone_number = $5, nationality = $6 WHERE email = $7 RETURNING *",
    [
      first_name,
      last_name,
      newEmail,
      password,
      phone_number,
      nationality,
      oldEmail,
    ]
  );

  return result.rows[0];
};

const deleteUser = async (email) => {
  const result = await db.query(
    "UPDATE users SET deleted_at = NOW(), status =$1 WHERE email = $2",
    ["Inactive", email]
  );
  return result.rowCount > 0; // Return true if a user was deleted
};

const statusCheck = async (email) => {
  const result = await db.query("SELECT status FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  editUser,
  deleteUser,
  statusCheck,
};
