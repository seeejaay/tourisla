const db = require("../db/index.js");

const createPolicy = async (data) => {
  const { type, content, version, effective_date, created_by_user_id } = data;
  const result = await db.query(
    `INSERT INTO policies (type, content, version, effective_date, created_by_user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [type, content, version, effective_date, created_by_user_id]
  );
  return result.rows[0];
};

const editPolicy = async (id, data) => {
  const { type, content, version, effective_date } = data;
  const result = await db.query(
    `UPDATE policies 
     SET type = $1, content = $2, version = $3, effective_date = $4, last_updated = CURRENT_TIMESTAMP
     WHERE id = $5 RETURNING *`,
    [type, content, version, effective_date, id]
  );
  return result.rows[0];
};

const deletePolicy = async (id) => {
  const result = await db.query(
    `DELETE FROM policies WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

const getAllPolicies = async () => {
  const result = await db.query(`SELECT * FROM policies ORDER BY created_at DESC`);
  return result.rows;
};

const getPolicyById = async (id) => {
  const result = await db.query(`SELECT * FROM policies WHERE id = $1`, [id]);
  return result.rows[0];
};

const getPoliciesByType = async (type) => {
  const result = await db.query(`SELECT * FROM policies WHERE type = $1`, [type]);
  return result.rows;
};

module.exports = {
  createPolicy,
  editPolicy,
  deletePolicy,
  getAllPolicies,
  getPolicyById,
  getPoliciesByType,
};
