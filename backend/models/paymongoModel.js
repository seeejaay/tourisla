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
const saveIslandEntryPayment = async ({ registration_id, checkout_url, status, amount }) => {
  const result = await db.query(
    `INSERT INTO island_entry_payments (registration_id, amount, paymongo_link, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [registration_id, amount, checkout_url, status]
  );

  return result.rows[0];
};

// Update payment status for both payment log and registration
const updateIslandEntryPaymentStatus = async ({ registration_id, status }) => {
  // Update in registration
  await db.query(
    `UPDATE island_entry_registration SET payment_status = $1 WHERE id = $2`,
    [status, registration_id]
  );

  // Update in payment log
  await db.query(
    `UPDATE island_entry_payments SET status = $1 WHERE registration_id = $2`,
    [status, registration_id]
  );
};

module.exports = {
  createPayMongoLink,
  saveIslandEntryPayment,
  updateIslandEntryPaymentStatus,
};
