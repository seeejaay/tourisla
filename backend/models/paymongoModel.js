const db = require("../db/index.js");
const axios = require("axios");

// Generate PayMongo payment link
const createPayMongoLink = async ({ amount, referenceNumber, description }) => {
  const amountInCentavos = Math.round(amount * 100); // PayMongo uses centavos

  const response = await axios.post(
    "https://api.paymongo.com/v1/links",
    {
      data: {
        attributes: {
          amount: amountInCentavos,
          description,
          reference_number: referenceNumber,
          remarks: "Island Entry Payment",
        },
      },
    },
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization:
          "Basic " +
          Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64"),
      },
    }
  );

  return response.data.data;
};

// Save PayMongo link to island_entry_payments table
const saveIslandEntryPayment = async ({ registration_id, amount, status, payment_link, reference_num }) => {
  const result = await db.query(
    `INSERT INTO island_entry_payments 
      (registration_id, amount, payment_link, status, reference_num)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [registration_id, amount, payment_link, status, reference_num]
  );

  return result.rows[0];
};

// Update payment status for both payment log and registration
const updateIslandEntryPaymentStatus = async ({ registration_id, status }) => {
  await db.query(
    `UPDATE island_entry_registration SET payment_status = $1 WHERE id = $2`,
    [status, registration_id]
  );

  await db.query(
    `WITH latest_payment AS (
       SELECT id FROM island_entry_payments 
       WHERE registration_id = $1 AND status != 'PAID'
       ORDER BY id DESC
       LIMIT 1
     )
     UPDATE island_entry_payments
     SET status = $2
     WHERE id IN (SELECT id FROM latest_payment)`,
    [registration_id, status]
  );
};


module.exports = {
  createPayMongoLink,
  saveIslandEntryPayment,
  updateIslandEntryPaymentStatus,
};
