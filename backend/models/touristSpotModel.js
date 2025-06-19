const db = require("../db/index");

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
    (name, type, description, barangay, municipality, province, location,
    opening_time, closing_time, days_open, entrance_fee, other_fees, 
    contact_number, email, facebook_page, rules) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
    $16) 
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
    `UPDATE tourist_spots 
    (name, type, description, barangay, municipality, province, location,
    opening_time, closing_time, days_open, entrance_fee, other_fees, 
    contact_number, email, facebook_page, rules) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
    $16) 
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
  const result = await db.query(`SELECT * FROM tourist_spots WHERE id = $1`, [
    id,
  ]);
  return result.rows[0];
};

module.exports = {
  createTouristSpot,
  editTouristSpot,
  deleteTouristSpot,
  getAllTouristSpots,
  getTouristSpotById,
};
