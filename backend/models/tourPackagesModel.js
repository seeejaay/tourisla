const db = require("../db/index.js");

const createTourPackage = async ({
  touroperator_id,
  package_name,
  location,
  description,
  price,
  duration_days,
  inclusions,
  exclusions,
  available_slots,
  date_start,
  date_end,
  start_time, 
  end_time,
  assigned_guides = []
}) => {
  const result = await db.query(
    `INSERT INTO tour_packages 
      (touroperator_id, package_name, location, description, price, duration_days, inclusions, exclusions, available_slots, date_start, date_end, start_time, end_time)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [
      touroperator_id,
      package_name,
      location,
      description,
      price,
      duration_days,
      inclusions,
      exclusions,
      available_slots,
      date_start,
      date_end,
      start_time, 
      end_time
    ]
  );
  const newPackage = result.rows[0];

  // Insert assigned tour guides only if they have google_tokens
  for (const guideId of assigned_guides) {
    const tokenRes = await db.query(
      `SELECT 1 FROM google_tokens WHERE tourguide_id = $1`,
      [guideId]
    );
    if (tokenRes.rowCount > 0) {
      await db.query(
        `INSERT INTO tourguide_assignments (tourguide_id, tour_package_id) VALUES ($1, $2)`,
        [guideId, newPackage.id]
      );
    }
  }

  return newPackage;
};

const updateTourPackage = async (id, touroperator_id, packageData) => {
  const {
    package_name,
    location,
    description,
    price,
    duration_days,
    inclusions,
    exclusions,
    available_slots,
    is_active,
    date_start,
    date_end,
    start_time,
    end_time
  } = packageData;

  const result = await db.query(
    `UPDATE tour_packages 
     SET package_name = $1, location = $2, description = $3, price = $4, duration_days = $5,
         inclusions = $6, exclusions = $7, available_slots = $8, is_active = $9,
         date_start = $10, date_end = $11, start_time = $12, end_time = $13, updated_at = NOW()
     WHERE id = $14 AND touroperator_id = $15
     RETURNING *`,
    [
      package_name,
      location,
      description,
      price,
      duration_days,
      inclusions,
      exclusions,
      available_slots,
      is_active || true,
      date_start,
      date_end,
      start_time, 
      end_time,
      id,
      touroperator_id,
    ]
  );
  return result.rows[0];
};

const deleteTourPackage = async (id, touroperator_id) => {
  const result = await db.query(
    `DELETE FROM tour_packages 
     WHERE id = $1 AND touroperator_id = $2 
     RETURNING *`,
    [id, touroperator_id]
  );
  return result.rows[0];
};

const getAllTourPackagesByOperator = async (touroperator_id) => {
  const result = await db.query(
    `SELECT * FROM tour_packages 
     WHERE touroperator_id = $1`,
    [touroperator_id]
  );
  return result.rows;
};

const getTourPackageByIdForOperator = async (id, touroperator_id) => {
  const result = await db.query(
    `SELECT * FROM tour_packages 
     WHERE id = $1 AND touroperator_id = $2`,
    [id, touroperator_id]
  );
  return result.rows[0];
};

const getTourPackageById = async (id) => {
  const result = await db.query(
    `SELECT * FROM tour_packages WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const getAssignedGuidesByPackage = async (packageId) => {
  const result = await db.query(
    `
    SELECT 
      tga.tourguide_id,
      tga.notes,
      ta.first_name,
      ta.last_name,
      ta.email
    FROM tourguide_assignments tga
    JOIN tourguide_applicants ta ON tga.tourguide_id = ta.id
    WHERE tga.tour_package_id = $1
    `,
    [packageId]
  );

  return result.rows;
};

module.exports = {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getAllTourPackagesByOperator,
  getTourPackageByIdForOperator,
  getTourPackageById,
  getAssignedGuidesByPackage,
};