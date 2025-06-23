const db = require("../db/index.js");

const createAccommodation = async (data) => {
  const {
    "Name of Establishment": name,
    Type: type,
    "No. of Rooms": rooms,
    "Number of Employees": employees,
    Year: year,
    Region: region,
    Province: province,
    "Municipality / City": municipality,
  } = data;

  const result = await db.query(
    `INSERT INTO accommodations
     ("Name of Establishment", "Type", "No. of Rooms", "Number of Employees", "Year", "Region", "Province", "Municipality / City")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, type, rooms, employees, year, region, province, municipality]
  );

  return result.rows[0];
};

const editAccommodation = async (id, data) => {
  const {
    "Name of Establishment": name,
    Type: type,
    "No. of Rooms": rooms,
    "Number of Employees": employees,
    Year: year,
    Region: region,
    Province: province,
    "Municipality / City": municipality,
  } = data;

  const result = await db.query(
    `UPDATE accommodations SET
     "Name of Establishment" = $1,
     "Type" = $2,
     "No. of Rooms" = $3,
     "Number of Employees" = $4,
     "Year" = $5,
     "Region" = $6,
     "Province" = $7,
     "Municipality / City" = $8
     WHERE id = $9 RETURNING *`,
    [name, type, rooms, employees, year, region, province, municipality, id]
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
