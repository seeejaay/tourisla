const db = require("../db/index.js");

// save or update Google tokens for a tour guide
const saveGoogleTokens = async (tourguideId, tokens) => {
  const { access_token, refresh_token, expiry_date } = tokens;

  const result = await db.query(
    `UPDATE tourguides
     SET google_access_token = $1,
         google_refresh_token = $2,
         google_token_expiry = to_timestamp($3 / 1000.0),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`, 
    [access_token, refresh_token, expiry_date, tourguideId]
  );

  return result.rows[0];
};

// retrieve Google tokens for a tour guide
const getGoogleTokens = async (tourguideId) => {
  const result = await db.query(
    `SELECT google_access_token, google_refresh_token, google_token_expiry
     FROM tourguides
     WHERE id = $1`,
    [tourguideId]
  );

  if (result.rows.length === 0) {
    throw new Error('Tour guide not found');
  }

  return result.rows[0];
};

module.exports = {
  saveGoogleTokens,
  getGoogleTokens,
};