const db = require("../db/index");

const addTouristSpotImages = async (spotId, imageUrls) => {
  const promises = imageUrls.map((url) => {
    return db.query(
      "INSERT INTO tourist_spot_images (tourist_spot_id, image_url) VALUES ($1, $2) RETURNING *",
      [spotId, url]
    );
  });

  const results = await Promise.all(promises);
  return results.map((result) => result.rows[0]);
};

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
    attraction_code,
    category,
  } = data;

  const result = await db.query(
    `INSERT INTO tourist_spots 
    (name, type, description, barangay, municipality, province, location,
     opening_time, closing_time, days_open, entrance_fee, other_fees,
     contact_number, email, facebook_page, rules, attraction_code, category) 
     VALUES 
    ($1, $2, $3, $4, $5, $6, $7, 
     $8, $9, $10, $11, $12, 
     $13, $14, $15, $16, $17, $18)
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
      attraction_code,
      category,
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
    attraction_code,
    category,
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
      attraction_code = $17,
      category = $18,
      updated_at = NOW()
    WHERE id = $19
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
      attraction_code,
      category,
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
  const result = await db.query(`SELECT * FROM tourist_spots WHERE id = $1`, [
    id,
  ]);
  return result.rows[0];
};

const getTouristSpotImages = async (spotId) => {
  const result = await db.query(
    `SELECT * FROM tourist_spot_images WHERE tourist_spot_id = $1`,
    [spotId]
  );
  return result.rows;
};

const deleteTouristSpotImage = async (imageId) => {
  const result = await db.query(
    `DELETE FROM tourist_spot_images WHERE id = $1 RETURNING *`,
    [imageId]
  );
  return result.rows[0]; // contains the image_url
};

module.exports = {
  createTouristSpot,
  editTouristSpot,
  deleteTouristSpot,
  getAllTouristSpots,
  getTouristSpotById,
  addTouristSpotImages,
  getTouristSpotImages,
  deleteTouristSpotImage,
};
