const db = require("../db/index.js");

// Save or update Google tokens for a tour guide
const saveGoogleTokens = async (tourguideId, tokens) => {
  const { access_token, refresh_token, expiry_date } = tokens;

  const existing = await db.query(
    `SELECT id FROM google_tokens WHERE tourguide_id = $1`,
    [tourguideId]
  );

  let result;

  if (existing.rows.length > 0) {
    result = await db.query(
      `UPDATE google_tokens
       SET access_token = $1,
           refresh_token = $2,
           token_expiry = to_timestamp($3 / 1000.0),
           updated_at = CURRENT_TIMESTAMP
       WHERE tourguide_id = $4
       RETURNING *`,
      [access_token, refresh_token, expiry_date, tourguideId]
    );
  } else {
    result = await db.query(
      `INSERT INTO google_tokens (tourguide_id, access_token, refresh_token, token_expiry)
       VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))
       RETURNING *`,
      [tourguideId, access_token, refresh_token, expiry_date]
    );
  }

  return result.rows[0];
};

// Retrieve Google tokens for a specific tour guide
const getGoogleTokens = async (tourguideId) => {
  const result = await db.query(
    `SELECT access_token, refresh_token, token_expiry
     FROM google_tokens
     WHERE tourguide_id = $1`,
    [tourguideId]
  );

  if (result.rows.length === 0) {
    throw new Error("Google tokens not found for this tour guide.");
  }

  return result.rows[0];
};

module.exports = {
  saveGoogleTokens,
  getGoogleTokens,
};
