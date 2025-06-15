const db = require("../db/index.js");


const exportAccommodationLog = async (filter) => {
  const { accommodation_id, start_date, end_date } = filter;

  const result = await db.query(
    `SELECT 
      avl.*, 
      a.no_of_rooms, 
      a.name_of_establishment 
     FROM accommodation_visitor_logs avl
     JOIN accommodations a ON a.id = avl.accommodation_id
     WHERE ($1::int IS NULL OR avl.accommodation_id = $1)
     AND ($2::date IS NULL OR avl.log_date >= $2)
     AND ($3::date IS NULL OR avl.log_date <= $3)
     ORDER BY avl.log_date ASC`,
    [accommodation_id || null, start_date || null, end_date || null]
  );

  const logs = result.rows;
  if (!logs.length) return null;

  const headers = Object.keys(logs[0]);
  const csvLines = [
    headers.join(","), // headers row
    ...logs.map(row =>
      headers.map(field => {
        let val = row[field];
        if (Array.isArray(val)) val = JSON.stringify(val);
        return `"${String(val).replace(/"/g, '""')}"`; // escape quotes
      }).join(",")
    )
  ];

  return csvLines.join("\n");
};



// Utility to get day of the week from date
const getDayOfWeek = (dateString) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateString).getDay()];
};

// Create
const createAccommodationLog = async (logData, userId) => {
  const {
    log_date,
    checkout_date,
    rooms_occupied,
    number_of_guests_check_in,
    number_of_guests_overnight
  } = logData;

  const day_of_week = getDayOfWeek(log_date);

  const userResult = await db.query(`SELECT accommodation_id FROM users WHERE user_id = $1`, [userId]);
  const accommodationId = userResult.rows[0]?.accommodation_id;

  if (!accommodationId) {
    throw new Error("User is not associated with any accommodation.");
  }

  const accResult = await db.query(`SELECT no_of_rooms FROM accommodations WHERE id = $1`, [accommodationId]);
  const maxRooms = accResult.rows[0]?.no_of_rooms;

  const invalidRooms = rooms_occupied.filter(r => r < 1 || r > maxRooms);
  if (invalidRooms.length > 0) {
    throw new Error(`Invalid room number(s): ${invalidRooms.join(", ")}. Only 1 to ${maxRooms} are allowed.`);
  }

  const existingBookings = await db.query(
    `SELECT rooms_occupied FROM accommodation_visitor_logs
     WHERE accommodation_id = $1 AND checkout_date >= CURRENT_DATE`,
    [accommodationId]
  );

  const alreadyBooked = new Set();
  for (const row of existingBookings.rows) {
    for (const room of row.rooms_occupied) {
      alreadyBooked.add(room);
    }
  }

  const duplicateRooms = rooms_occupied.filter(r => alreadyBooked.has(r));
  if (duplicateRooms.length > 0) {
    throw new Error(`Room(s) already booked: ${duplicateRooms.join(", ")}`);
  }

  const result = await db.query(
    `INSERT INTO accommodation_visitor_logs (
      accommodation_id,
      log_date,
      checkout_date,
      day_of_week,
      rooms_occupied,
      number_of_guests_check_in,
      number_of_guests_overnight,
      created_by_user_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      accommodationId,
      log_date,
      checkout_date,
      day_of_week,
      rooms_occupied,
      number_of_guests_check_in,
      number_of_guests_overnight,
      userId
    ]
  );

  return result.rows[0];
};

// Edit
const editAccommodationLog = async (logId, logData, userId) => {
  const {
    log_date,
    checkout_date,
    rooms_occupied,
    number_of_guests_check_in,
    number_of_guests_overnight
  } = logData;

  const day_of_week = getDayOfWeek(log_date);

  const userResult = await db.query(`SELECT accommodation_id FROM users WHERE user_id = $1`, [userId]);
  const accommodationId = userResult.rows[0]?.accommodation_id;

  if (!accommodationId) {
    throw new Error("User is not associated with any accommodation.");
  }

  const accResult = await db.query(`SELECT no_of_rooms FROM accommodations WHERE id = $1`, [accommodationId]);
  const maxRooms = accResult.rows[0]?.no_of_rooms;

  const invalidRooms = rooms_occupied.filter(r => r < 1 || r > maxRooms);
  if (invalidRooms.length > 0) {
    throw new Error(`Invalid room number(s): ${invalidRooms.join(", ")}`);
  }

  const existingBookings = await db.query(
    `SELECT id, rooms_occupied FROM accommodation_visitor_logs
     WHERE accommodation_id = $1 AND checkout_date >= CURRENT_DATE AND id != $2`,
    [accommodationId, logId]
  );

  const alreadyBooked = new Set();
  for (const row of existingBookings.rows) {
    for (const room of row.rooms_occupied) {
      alreadyBooked.add(room);
    }
  }

  const duplicateRooms = rooms_occupied.filter(r => alreadyBooked.has(r));
  if (duplicateRooms.length > 0) {
    throw new Error(`Room(s) already booked: ${duplicateRooms.join(", ")}`);
  }

  const result = await db.query(
    `UPDATE accommodation_visitor_logs SET
      accommodation_id = $1,
      log_date = $2,
      checkout_date = $3,
      day_of_week = $4,
      rooms_occupied = $5,
      number_of_guests_check_in = $6,
      number_of_guests_overnight = $7,
      last_updated = CURRENT_TIMESTAMP,
      created_by_user_id = $8
    WHERE id = $9
    RETURNING *`,
    [
      accommodationId,
      log_date,
      checkout_date,
      day_of_week,
      rooms_occupied,
      number_of_guests_check_in,
      number_of_guests_overnight,
      userId,
      logId
    ]
  );

  return result.rows[0];
};




// Delete
const deleteAccommodationLog = async (logId) => {
  const result = await db.query(
    `DELETE FROM accommodation_visitor_logs WHERE id = $1 RETURNING *`,
    [logId]
  );
  return result.rows[0];
};


// Get All
const getAllAccommodationLogs = async () => {
  const result = await db.query(`SELECT * FROM accommodation_visitor_logs`);
  return result.rows;
};


// Get By ID
const getAccommodationLogById = async (logId) => {
  const result = await db.query(
    `SELECT * FROM accommodation_visitor_logs WHERE id = $1`,
    [logId]
  );
  return result.rows[0];
};


module.exports = {
  createAccommodationLog,
  editAccommodationLog,
  deleteAccommodationLog,
  getAllAccommodationLogs,
  getAccommodationLogById,
  exportAccommodationLog
};
