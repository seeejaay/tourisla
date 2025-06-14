const db = require("../db/index");

const createTouristSpot = async (data) => {
  const {
    name,
    type,
    description,
    barangay,
    municipality,
    province,
    longitude,
    latitude,
    opening_time,
    closing_time,
    days_open,
    entrance_fee,
    other_fees,
    contact_number,
    email,
    facebook_page,
    rules,
    images
  } = data;

  const result = await db.query(
    `INSERT INTO tourist_spots 
    (name, type, description, barangay, municipality, province, longitude, latitude,
opening_time, closing_time, days_open, entrance_fee, other_fees, 
contact_number, email, facebook_page, rules, images) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
$16, $17, $18) 
    RETURNING *`,
    [
      name,
      type,
      description,
      barangay,
      municipality,
      province,
      longitude,
      latitude,
      opening_time,
      closing_time,
      days_open,
      entrance_fee,
      other_fees,
      contact_number,
      email,
      facebook_page,
      rules,
      images || []
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
    longitude,
    latitude,
    opening_time,
    closing_time,
    days_open,
    entrance_fee,
    other_fees,
    contact_number,
    email,
    facebook_page,
    rules,
    images
  } = data;

  const result = await db.query(
    `UPDATE tourist_spots SET 
      name = $1, 
      type = $2, 
      description = $3, 
      barangay = $4, 
      municipality = $5, 
      province = $6, 
      longitude = $7,
      latitude = $8, 
      opening_time = $9, 
      closing_time = $10, 
      days_open = $11, 
      entrance_fee = $12, 
      other_fees = $13, 
      contact_number = $14, 
      email = $15, 
      facebook_page = $16, 
      rules = $17,
      images = $18,
      updated_at = CURRENT_TIMESTAMP 
    WHERE id = $19 
    RETURNING *`,
    [
      name,
      type,
      description,
      barangay,
      municipality,
      province,
      longitude,
      latitude,
      opening_time,
      closing_time,
      days_open,
      entrance_fee,
      other_fees,
      contact_number,
      email,
      facebook_page,
      rules,
      images || [],
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
  const result = await db.query(`
    SELECT * FROM tourist_spots
    ORDER BY created_at DESC
  `);
  return result.rows;
};

const getTouristSpotById = async (id) => {
  const result = await db.query(
    `SELECT * FROM tourist_spots WHERE id = $1`,
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
