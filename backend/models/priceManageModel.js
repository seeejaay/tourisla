const db = require("../db/index.js");

const getAllPrices = async () => {
  const result = await db.query(`
    SELECT * FROM price_management
    ORDER BY created_at DESC
  `);
  return result.rows;
};

const getActivePrice = async () => {
  const result = await db.query(
    `SELECT * FROM price_management
     WHERE is_enabled = true
     ORDER BY id DESC
     LIMIT 1`
  );
  return result.rows[0];
};

const createPrice = async ({ amount, is_enabled, type }) => {
  const result = await db.query(
    `INSERT INTO price_management (amount, is_enabled, type, created_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     RETURNING *`,
    [amount, is_enabled, type]
  );
  return result.rows[0];
};

const togglePriceStatus = async (id, is_enabled) => {
  const result = await db.query(
    `UPDATE price_management
     SET is_enabled = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [is_enabled, id]
  );
  return result.rows[0];
};

const updatePriceDetails = async (id, amount, type) => {
  const result = await db.query(
    `UPDATE price_management
     SET amount = $1,
         type = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [amount, type, id]
  );
  return result.rows[0];
};

module.exports = {
  getAllPrices,
  getActivePrice,
  createPrice,
  togglePriceStatus,
  updatePriceDetails
};