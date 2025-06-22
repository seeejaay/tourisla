const db = require("../db/index.js");

const createOperatorQr = async ({
  tour_operator_id,
  qr_name,
  qr_image_url,
}) => {
  const result = await db.query(
    `INSERT INTO operator_qr (tour_operator_id, qr_name, qr_image_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [tour_operator_id, qr_name, qr_image_url]
  );
  return result.rows[0];
};

const getOperatorQrById = async (tour_operator_id) => {
  const result = await db.query(
    `SELECT * FROM operator_qr WHERE tour_operator_id = $1`,
    [tour_operator_id]
  );
  return result.rows;
};

module.exports = {
  createOperatorQr,
  getOperatorQrById,
};
