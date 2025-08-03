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
  companions = [], // Array of { first_name, last_name, age, sex, phone_number }
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
  console.log("Booking created:", bookingResult.rows[0]);
  const booking = bookingResult.rows[0];

  // Insert companions if any
  if (companions && companions.length > 0) {
    for (const member of companions) {
      await db.query(
        `INSERT INTO bookings_group_members
          (booking_id, first_name, last_name, age, sex, phone_number, created_at)
         VALUES
          ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          booking.id,
          member.first_name,
          member.last_name,
          member.age,
          member.sex,
          member.phone_number,
        ]
      );
    }
  }
  console.log("Companions added:", companions);
  // Update the tour package available slots (decrement)
  await db.query(
    `UPDATE tour_packages
     SET available_slots = available_slots - $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [number_of_guests, tour_package_id]
  );
  console.log(
    "Tour package slots updated for package ID:",
    tour_package_id,
    "by decrementing",
    number_of_guests,
    "slots"
  );
  return booking;
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
            COALESCE(
              json_agg(
                json_build_object(
                  'tourguide_id', tga.id, 
                  'first_name', tga.first_name, 
                  'last_name', tga.last_name
                )
              ) FILTER (WHERE tga.first_name IS NOT NULL), '[]'
            ) AS tour_guides,
            COALESCE(
              json_agg(
                jsonb_build_object(
                  'id', bg.id,
                  'first_name', bg.first_name,
                  'last_name', bg.last_name,
                  'age', bg.age,
                  'sex', bg.sex,
                  'phone_number', bg.phone_number
                )
              ) FILTER (WHERE bg.id IS NOT NULL), '[]'
            ) AS companions
     FROM bookings b
     JOIN tour_packages tp ON b.tour_package_id = tp.id
     LEFT JOIN touroperator_applicants toa ON tp.touroperator_id = toa.id
     LEFT JOIN tourguide_assignments tgas ON tp.id = tgas.tour_package_id
     LEFT JOIN tourguide_applicants tga ON tgas.tourguide_id = tga.id
     LEFT JOIN bookings_group_members bg ON b.id = bg.booking_id
     WHERE b.tourist_id = $1
     GROUP BY b.id, tp.package_name, tp.touroperator_id, toa.operator_name
     ORDER BY b.id DESC`,
    [touristId]
  );
  return result.rows;
};

// get all bookings under a specific tour package
const getBookingsByPackage = async (packageId) => {
  const result = await db.query(
    `SELECT b.*,
            COALESCE(json_agg(bg.*) FILTER (WHERE bg.id IS NOT NULL), '[]') AS companions
     FROM bookings b
     LEFT JOIN bookings_group_members bg ON b.id = bg.booking_id
     WHERE b.tour_package_id = $1
     GROUP BY b.id
     ORDER BY b.scheduled_date`,
    [packageId]
  );
  return result.rows;
};

const getBookingById = async (id) => {
  const result = await db.query(
    `SELECT b.*,
            COALESCE(json_agg(bg.*) FILTER (WHERE bg.id IS NOT NULL), '[]') AS companions
     FROM bookings b
     LEFT JOIN bookings_group_members bg ON b.id = bg.booking_id
     WHERE b.id = $1
     GROUP BY b.id`,
    [id]
  );
  return result.rows[0];
};

// tourist booking history based on date with filter
const getFilteredBookingsByTourist = async (touristId, timeFilter) => {
  let baseQuery = `
    SELECT b.*,
      CASE 
        WHEN b.scheduled_date::date < CURRENT_DATE THEN 'PAST'
        WHEN b.scheduled_date::date = CURRENT_DATE THEN 'TODAY'
        ELSE 'UPCOMING'
      END AS time_status,
      COALESCE(json_agg(bg.*) FILTER (WHERE bg.id IS NOT NULL), '[]') AS companions
    FROM bookings b
    LEFT JOIN bookings_group_members bg ON b.id = bg.booking_id
    WHERE b.tourist_id = $1 AND b.status = 'APPROVED'
  `;

  if (timeFilter === "PAST") {
    baseQuery += ` AND b.scheduled_date::date < CURRENT_DATE`;
  } else if (timeFilter === "TODAY") {
    baseQuery += ` AND b.scheduled_date::date = CURRENT_DATE`;
  } else if (timeFilter === "UPCOMING") {
    baseQuery += ` AND b.scheduled_date::date > CURRENT_DATE`;
  }

  baseQuery += ` GROUP BY b.id ORDER BY b.id DESC`;

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
            u.email,
            COALESCE(json_agg(bg.*) FILTER (WHERE bg.id IS NOT NULL), '[]') AS companions
     FROM bookings b
     JOIN tour_packages tp ON b.tour_package_id = tp.id
     JOIN users u ON b.tourist_id = u.user_id
     LEFT JOIN bookings_group_members bg ON b.id = bg.booking_id
     WHERE tp.touroperator_id = $1
     GROUP BY b.id, tp.package_name, tp.touroperator_id, tp.location, u.first_name, u.last_name, u.email
     ORDER BY b.scheduled_date DESC`,
    [operatorId]
  );
  return result.rows;
};

//earnings total
async function getTotalEarningsByTourOperator(
  tourOperatorId,
  dateRange = null
) {
  let query = `
    SELECT SUM(b.total_price) AS totalEarnings
    FROM bookings b
    JOIN tour_packages tp ON b.tour_package_id = tp.id
    WHERE tp.touroperator_id = $1
      AND b.status IN ('APPROVED', 'FINISHED')
  `;
  const params = [tourOperatorId];

  if (dateRange) {
    query += " AND b.scheduled_date >= $2";
    params.push(dateRange);
  }

  const result = await db.query(query, params);
  return result.rows[0]?.totalearnings || 0;
}

//tour package earnings
async function getEarningsByPackageForTourOperator(
  tourOperatorId,
  dateRange = null
) {
  let query = `
    SELECT 
      tp.id AS packageId,
      tp.package_name AS packageName,
      SUM(b.total_price) AS earnings
    FROM bookings b
    JOIN tour_packages tp ON b.tour_package_id = tp.id
    WHERE tp.touroperator_id = $1
      AND b.status IN ('APPROVED', 'FINISHED')
  `;
  const params = [tourOperatorId];

  if (dateRange) {
    query += " AND b.scheduled_date >= $2";
    params.push(dateRange);
  }

  query += " GROUP BY tp.id, tp.package_name ORDER BY earnings DESC";

  const result = await db.query(query, params);
  return result.rows;
}

// Earnings per month for a tour operator (optionally filtered by date range)
async function getMonthlyEarningsByTourOperator(
  tourOperatorId,
  dateRange = null
) {
  let query = `
    SELECT 
      TO_CHAR(b.scheduled_date, 'YYYY-MM-DD') AS month,
      SUM(b.total_price) AS earnings
    FROM bookings b
    JOIN tour_packages tp ON b.tour_package_id = tp.id
    WHERE tp.touroperator_id = $1
      AND b.status IN ('APPROVED', 'FINISHED')
  `;
  const params = [tourOperatorId];

  if (dateRange) {
    query += " AND b.scheduled_date >= $2";
    params.push(dateRange);
  }

  query += " GROUP BY month ORDER BY month";

  const result = await db.query(query, params);
  return result.rows;
}

module.exports = {
  createBooking,
  updateBookingStatus,
  getBookingsByTourist,
  getBookingsByPackage,
  getBookingById,
  getFilteredBookingsByTourist,
  getBookingsByTourOperatorId,
  getTotalEarningsByTourOperator,
  getEarningsByPackageForTourOperator,
  getMonthlyEarningsByTourOperator,
};
