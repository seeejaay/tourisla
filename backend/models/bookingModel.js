const db = require("../db/index.js");

// tourist creates booking for a tour package
const createBooking = async ({
  tourist_id,
  tour_package_id,
  scheduled_date,
  number_of_guests,
  total_price,
  notes,
  proof_of_payment,
}) => {
  // Insert the booking
  const bookingResult = await db.query(
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

  // Update the tour package available slots (decrement)
  await db.query(
    `UPDATE tour_packages
     SET available_slots = available_slots - $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [number_of_guests, tour_package_id]
  );

  return bookingResult.rows[0];
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
    `SELECT b.*, 
            tp.package_name, 
            tp.touroperator_id, 
            toa.operator_name AS tour_operator_name,
            COALESCE(json_agg(json_build_object('tourguide_id', tga.id, 'first_name', tga.first_name, 'last_name', tga.last_name)) FILTER (WHERE tga.first_name IS NOT NULL), '[]') AS tour_guides
     FROM bookings b
     JOIN tour_packages tp ON b.tour_package_id = tp.id
     LEFT JOIN touroperator_applicants toa ON tp.touroperator_id = toa.id
     LEFT JOIN tourguide_assignments tgas ON tp.id = tgas.tour_package_id
     LEFT JOIN tourguide_applicants tga ON tgas.tourguide_id = tga.id
     WHERE b.tourist_id = $1
     GROUP BY b.id, tp.package_name, tp.touroperator_id, toa.operator_name
     ORDER BY b.scheduled_date DESC`,
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
  const result = await db.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
  return result.rows[0];
};

// tourist booking history based on date with filter
const getFilteredBookingsByTourist = async (touristId, timeFilter) => {
  let baseQuery = `
    SELECT *,
      CASE 
        WHEN scheduled_date::date < CURRENT_DATE THEN 'PAST'
        WHEN scheduled_date::date = CURRENT_DATE THEN 'TODAY'
        ELSE 'UPCOMING'
      END AS time_status
    FROM bookings
    WHERE tourist_id = $1 AND status = 'APPROVED'
  `;

  if (timeFilter === "PAST") {
    baseQuery += ` AND scheduled_date::date < CURRENT_DATE`;
  } else if (timeFilter === "TODAY") {
    baseQuery += ` AND scheduled_date::date = CURRENT_DATE`;
  } else if (timeFilter === "UPCOMING") {
    baseQuery += ` AND scheduled_date::date > CURRENT_DATE`;
  }

  baseQuery += ` ORDER BY scheduled_date DESC`;
  console.log("Executing query with:", touristId, timeFilter);
  console.log("Query:", baseQuery);

  const result = await db.query(baseQuery, [touristId]);
  return result.rows;
};

const getBookingsByTourOperatorId = async (operatorId) => {
  const result = await db.query(
    `SELECT b.*, 
            tp.package_name AS package_name, 
            tp.touroperator_id,
            tp.location,
            u.first_name, 
            u.last_name, 
            u.email
     FROM bookings b
     JOIN tour_packages tp ON b.tour_package_id = tp.id
     JOIN users u ON b.tourist_id = u.user_id
     WHERE tp.touroperator_id = $1
     ORDER BY b.scheduled_date DESC`,
    [operatorId]
  );
  return result.rows;
};

module.exports = {
  createBooking,
  updateBookingStatus,
  getBookingsByTourist,
  getBookingsByPackage,
  getBookingById,
  getFilteredBookingsByTourist,
  getBookingsByTourOperatorId,
};
