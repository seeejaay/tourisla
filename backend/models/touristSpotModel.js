const db = require("../db/index.js");

const createTouristSpot = async (data) => {
  const {
    name,
    type,
    description,
    barangay,
    municipality,
    province,
    location,
    opening_time,
    closing_time,
    days_open,
    entrance_fee,
    other_fees,
    contact_number,
    email,
    facebook_page,
    rules,
  } = data;

  const result = await db.query(
    `INSERT INTO tourist_spots 
    (name, type, description, barangay, municipality, province, location, opening_time, closing_time, days_open, entrance_fee, other_fees, contact_number, email, facebook_page, rules)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *`,
    [
      name,
      type,
      description,
      barangay,
      municipality,
      province,
      location,
      opening_time,
      closing_time,
      days_open,
      entrance_fee,
      other_fees,
      contact_number,
      email,
      facebook_page,
      rules,
    ]
  );

  return result.rows[0];
};

const editTouristSpot = async (id, data) => {
  const {
    name,
    type,
    description,
    barangay,
    municipality,
    province,
    location,
    opening_time,
    closing_time,
    days_open,
    entrance_fee,
    other_fees,
    contact_number,
    email,
    facebook_page,
    rules,
  } = data;

  const result = await db.query(
    `UPDATE tourist_spots SET
       name = $1,
  type = $2,
  description = $3,
  barangay = $4,
  municipality = $5,
  province = $6,
  location = $7,
  opening_time = $8,
  closing_time = $9,
  days_open = $10,
  entrance_fee = $11,
  other_fees = $12,
  contact_number = $13,
  email = $14,
  facebook_page = $15,
  rules = $16,
  updated_at = CURRENT_TIMESTAMP
WHERE id = $17
RETURNING *`,
    [
      name,
      type,
      description,
      barangay,
      municipality,
      province,
      location,
      opening_time,
      closing_time,
      days_open,
      entrance_fee,
      other_fees,
      contact_number,
      email,
      facebook_page,
      rules,
      id,
    ]
  );

  return result.rows[0];
};

const deleteTouristSpot = async (id) => {
  const result = await db.query(
    "DELETE FROM tourist_spots WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

const getAllTouristSpots = async () => {
  const result = await db.query("SELECT * FROM tourist_spots");
  return result.rows;
};

const getTouristSpotById = async (id) => {
  const result = await db.query(
    "SELECT * FROM tourist_spots WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createTouristSpot,
  editTouristSpot,
  deleteTouristSpot,
  getAllTouristSpots,
  getTouristSpotById,
};
