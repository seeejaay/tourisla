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
    social_link,
    email,
    contact_number,
    days_open, // should be an array or object, will be stored as JSON
  } = data;

  const result = await db.query(
    `INSERT INTO tourist_spots 
    (name, type, description, barangay, municipality, province, longitude, latitude, social_link, email, contact_number, days_open)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      social_link,
      email,
      contact_number,
      days_open,
    ]
  );

  return result.rows[0];
};

const uploadTouristSpotImages = async (touristSpotId, imageUrls) => {
  const insertPromises = imageUrls.map((url) =>
    db.query(
      `INSERT INTO tourist_spot_images (tourist_spot_id, image_url)
       VALUES ($1, $2)`,
      [touristSpotId, url]
    )
  );
  await Promise.all(insertPromises);
};

const deleteTouristSpotImages = async (touristSpotId) => {
  await db.query(`DELETE FROM tourist_spot_images WHERE tourist_spot_id = $1`, [
    touristSpotId,
  ]);
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
    social_link,
    email,
    contact_number,
    days_open,
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
      social_link = $9,
      email = $10,
      contact_number = $11,
      days_open = $12,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $13
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
      social_link,
      email,
      contact_number,
      days_open,
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
    SELECT ts.*, 
      COALESCE(json_agg(ti.*) FILTER (WHERE ti.id IS NOT NULL), '[]') AS images 
    FROM tourist_spots ts
    LEFT JOIN tourist_spot_images ti ON ts.id = ti.tourist_spot_id
    GROUP BY ts.id
    ORDER BY ts.created_at DESC
  `);
  return result.rows;
};

const getTouristSpotById = async (id) => {
  const result = await db.query(
    `
    SELECT ts.*, 
      COALESCE(json_agg(ti.*) FILTER (WHERE ti.id IS NOT NULL), '[]') AS images 
    FROM tourist_spots ts
    LEFT JOIN tourist_spot_images ti ON ts.id = ti.tourist_spot_id
    WHERE ts.id = $1
    GROUP BY ts.id
  `,
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
  uploadTouristSpotImages,
  deleteTouristSpotImages,
};
