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
}) => {
  const result = await db.query(
    `INSERT INTO tour_packages 
      (touroperator_id, package_name, location, description, price, duration_days, inclusions, exclusions, available_slots)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
    ]
  );
  return result.rows[0];
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
  } = packageData;

  const result = await db.query(
    `UPDATE tour_packages 
     SET package_name = $1, location = $2, description = $3, price = $4, duration_days = $5, inclusions = $6, exclusions = $7, available_slots = $8, is_active = $9, updated_at = NOW()
     WHERE id = $10 AND touroperator_id = $11
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
      is_active || true,  // default true if undefined
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

const getTourPackageById = async (id, touroperator_id) => {
  const result = await db.query(
    `SELECT * FROM tour_packages 
     WHERE id = $1 AND touroperator_id = $2`,
    [id, touroperator_id]
  );
  return result.rows[0];
};

module.exports = {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getAllTourPackagesByOperator,
  getTourPackageById,
};