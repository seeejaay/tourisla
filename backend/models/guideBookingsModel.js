const db = require("../db/index.js");

const getBookingsByGuideWithTimeFilter = async (guideId, filter) => {
  let baseQuery = `
    SELECT b.*, 
      tp.package_name,
      tp.location,
      CASE 
        WHEN b.scheduled_date::date < CURRENT_DATE THEN 'PAST'
        WHEN b.scheduled_date::date = CURRENT_DATE THEN 'TODAY'
        ELSE 'UPCOMING'
      END AS time_status
      FROM bookings b
      JOIN tour_packages tp ON b.tour_package_id = tp.id
      JOIN tourguide_assignments tga ON tp.id = tga.tour_package_id
      WHERE tga.tourguide_id = $1 AND b.status = 'APPROVED'
  `;

  if (filter === "PAST") {
    baseQuery += ` AND b.scheduled_date::date < CURRENT_DATE`;
  } else if (filter === "TODAY") {
    baseQuery += ` AND b.scheduled_date::date = CURRENT_DATE`;
  } else if (filter === "UPCOMING") {
    baseQuery += ` AND b.scheduled_date::date > CURRENT_DATE`;
  }

  baseQuery += ` ORDER BY b.scheduled_date DESC`;

  const result = await db.query(baseQuery, [guideId]);
  return result.rows;
};

module.exports = {
  getBookingsByGuideWithTimeFilter,
};

