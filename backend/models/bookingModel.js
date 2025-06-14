const db = require("../db/index.js");

const createBooking = async ({
  tourist_id,
  tour_package_id,
  scheduled_date,
  number_of_guests,
  total_price,
  notes,
  proof_of_payment,
}) => {
  const result = await db.query(
    `INSERT INTO bookings 
      (tourist_id, tour_package_id, scheduled_date, number_of_guests, total_price, notes, proof_of_payment)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      tourist_id,
      tour_package_id,
      scheduled_date,
      number_of_guests,
      total_price,
      notes,
      proof_of_payment,
    ]
  );
  return result.rows[0];
};

// operator updates the booking status after payment confirmation
const updateBookingStatus = async (bookingId, status) => {
  const result = await db.query(
    `UPDATE bookings
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, bookingId]
  );
  return result.rows[0];
};

// get all bookings for a specific tourist
const getBookingsByTourist = async (touristId) => {
  const result = await db.query(
    `SELECT * FROM bookings
     WHERE tourist_id = $1
     ORDER BY scheduled_date DESC`,
    [touristId]
  );
  return result.rows;
};

// get all bookings under a specific tour package
const getBookingsByPackage = async (packageId) => {
  const result = await db.query(
    `SELECT * FROM bookings
     WHERE tour_package_id = $1
     ORDER BY scheduled_date`,
    [packageId]
  );
  return result.rows;
};

const getBookingById = async (id) => {
  const result = await db.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createBooking,
  updateBookingStatus,
  getBookingsByTourist,
  getBookingsByPackage,
  getBookingById,
};