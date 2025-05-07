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
  } = userData;

  const result = await db.query(
    "INSERT INTO users (first_name, last_name, email, password, phone_number, role, nationality, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *",
    [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      role,
      nationality,
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

module.exports = { createUser, findUserByEmail };
