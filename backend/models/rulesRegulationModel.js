const db = require("../db/index.js");

const createRule = async (data) => {
  const {
    title,
    description,
    penalty,
    category,
    is_active,
    effective_date
  } = data;

  const result = await db.query(
    `INSERT INTO rules_regulations 
    (title, description, penalty, category, is_active, effective_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [title, description, penalty, category, is_active, effective_date]
  );

  return result.rows[0];
};

const editRule = async (id, data) => {
  const {
    title,
    description,
    penalty,
    category,
    is_active,
    effective_date
  } = data;

  const result = await db.query(
    `UPDATE rules_regulations SET
      title = $1,
      description = $2,
      penalty = $3,
      category = $4,
      is_active = $5,
      effective_date = $6,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *`,
    [title, description, penalty, category, is_active, effective_date, id]
  );

  return result.rows[0];
};

const deleteRule = async (id) => {
  const result = await db.query(
    "DELETE FROM rules_regulations WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const getAllRules = async () => {
  const result = await db.query("SELECT * FROM rules_regulations");
  return result.rows;
};

const getRuleById = async (id) => {
  const result = await db.query(
    "SELECT * FROM rules_regulations WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createRule,
  editRule,
  deleteRule,
  getAllRules,
  getRuleById,
};
