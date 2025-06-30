const db = require("../db/index.js");

const createAccommodation = async (data) => {
  const {
    name_of_establishment,
    Type,
    no_of_rooms,
    number_of_employees,
    Year,
    Region,
    Province,
    municipality,
  } = data;

  const result = await db.query(
    `INSERT INTO accommodations
     ("name_of_establishment", "Type", "no_of_rooms", "number_of_employees", "Year", "Region", "Province", "municipality")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      name_of_establishment,
      Type,
      no_of_rooms,
      number_of_employees,
      Year,
      Region,
      Province,
      municipality,
    ]
  );

  return result.rows[0];
};

const editAccommodation = async (id, data) => {
  const {
    name_of_establishment,
    Type,
    no_of_rooms,
    number_of_employees,
    Year,
    Region,
    Province,
    municipality,
  } = data;

  const result = await db.query(
    `UPDATE accommodations SET
   "name_of_establishment" = $1,
   "Type" = $2,
   "no_of_rooms" = $3,
   "number_of_employees" = $4,
   "Year" = $5,
   "Region" = $6,
   "Province" = $7,
   "municipality" = $8
   WHERE id = $9 RETURNING *`,
    [
      name_of_establishment,
      Type,
      no_of_rooms,
      number_of_employees,
      Year,
      Region,
      Province,
      municipality,
      id,
    ]
  );

  return result.rows[0];
};

const deleteAccommodation = async (id) => {
  const result = await db.query(
    "DELETE FROM accommodations WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const getAllAccommodations = async () => {
  const result = await db.query("SELECT * FROM accommodations");
  return result.rows;
};

const getAccommodationById = async (id) => {
  const result = await db.query("SELECT * FROM accommodations WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

const assignAccommodationToStaff = async (staffId, accommodationId) => {
  const result = await db.query(
    `UPDATE users SET accommodation_id = $1 WHERE user_id = $2 RETURNING *`,
    [accommodationId, staffId]
  );
  return result.rows[0];
};

const getAllTourismStaff = async () => {
  const result = await db.query(
    `SELECT * FROM users WHERE role = 'Tourism Staff'`
  );
  return result.rows;
};

module.exports = {
  createAccommodation,
  editAccommodation,
  deleteAccommodation,
  getAllAccommodations,
  getAccommodationById,
  getAllTourismStaff,
  assignAccommodationToStaff,
};
