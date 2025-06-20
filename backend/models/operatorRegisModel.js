const db = require("../db/index.js");

const createOperatorRegis = async (operatorRegisData) => {
  const {
    operator_name,
    representative_name,
    email,
    mobile_number,
    office_address,
    application_status,
    user_id,
  } = operatorRegisData;

  const result = await db.query(
    "INSERT INTO touroperator_applicants (operator_name, representative_name, email, mobile_number, office_address, application_status, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7) RETURNING *",
    [
      operator_name,
      representative_name,
      email,
      mobile_number,
      office_address,
      application_status,
      user_id,
    ]
  );
  return result.rows[0];
};

const editOperatorRegis = async (operatorId, operatorRegisData) => {
  const {
    operator_name,
    representative_name,
    email,
    mobile_number,
    office_address,
    application_status,
  } = operatorRegisData;

  const result = await db.query(
    "UPDATE touroperator_applicants SET operator_name = $1, representative_name = $2, email = $3, mobile_number = $4, office_address = $5, application_status = $6 WHERE id = $7 RETURNING *",
    [
      operator_name,
      representative_name,
      email,
      mobile_number,
      office_address,
      application_status,
      operatorId,
    ]
  );
  return result.rows[0];
};

const deleteOperatorRegis = async (operatorId) => {
  const result = await db.query(
    "DELETE FROM touroperator_applicants WHERE id = $1 RETURNING *",
    [operatorId]
  );

  return result.rows[0];
};

const getAllOperatorRegis = async () => {
  const result = await db.query("SELECT * FROM touroperator_applicants");
  return result.rows;
};

const getOperatorRegisById = async (operatorId) => {
  const result = await db.query(
    "SELECT * FROM touroperator_applicants WHERE user_id = $1",
    [operatorId]
  );
  return result.rows[0];
};

module.exports = {
  createOperatorRegis,
  editOperatorRegis,
  deleteOperatorRegis,
  getAllOperatorRegis,
  getOperatorRegisById,
};
