const db = require("../db/index.js");

const getActivePrice = async () => {
  const result = await db.query(
    `SELECT * FROM price_management
     WHERE is_enabled = true
     ORDER BY id DESC
     LIMIT 1`
  );
  return result.rows[0];
};

const createPrice = async ({ amount, is_enabled }) => {
  const result = await db.query(
    `INSERT INTO price_management (amount, is_enabled)
     VALUES ($1, $2)
     RETURNING *`,
    [amount, is_enabled]
  );
  return result.rows[0];
};

const togglePriceStatus = async (is_enabled) => {
  const result = await db.query(
    `UPDATE price_management
     SET is_enabled = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = (
       SELECT id FROM price_management ORDER BY id DESC LIMIT 1
     )
     RETURNING *`,
    [is_enabled]
  );
  return result.rows[0];
};

module.exports = {
  getActivePrice,
  createPrice,
  togglePriceStatus
};