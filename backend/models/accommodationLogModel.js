const { format } = require("date-fns"); // Add this to use date formatting
const db = require("../db/index.js");
const ExcelJS = require("exceljs");


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

  // 🧠 Determine the maximum number of rooms across all logs
  let maxRoomNumber = 0;
  logs.forEach(log => {
    const rooms = log.rooms_occupied || [];
    const maxInRow = Math.max(...rooms, 0);
    if (maxInRow > maxRoomNumber) maxRoomNumber = maxInRow;
  });

  // ✅ Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Accommodation Logs");

  // ✅ Define headers
  const headers = [
    "Log Date",
    "Day",
    "Accommodation Name",
    ...Array.from({ length: maxRoomNumber }, (_, i) => `Room No. ${i + 1}`),
    "Number of Guests Check IN",
    "Number of Guests Staying Over-night",
    "Total Rooms Occupied"
  ];

  worksheet.addRow(headers);

  // ✅ Add rows
  logs.forEach(log => {
    const formattedDate = format(new Date(log.log_date), "MMMM d, yyyy");
    const day = format(new Date(log.log_date), "EEEE");
    const name = log.name_of_establishment;
    const rooms = log.rooms_occupied || [];

    const roomCols = Array.from({ length: maxRoomNumber }, (_, i) =>
      rooms.includes(i + 1) ? "Occupied" : ""
    );

    const row = [
      formattedDate,
      day,
      name,
      ...roomCols,
      log.number_of_guests_check_in,
      log.number_of_guests_overnight,
      rooms.length
    ];

    worksheet.addRow(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
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

  if (new Date(checkout_date) < new Date(log_date)) {
  throw new Error("Checkout date must be the same or after the check-in date.");
  }

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
     WHERE accommodation_id = $1
     AND NOT ($3 < log_date OR $2 > checkout_date)`,
    [accommodationId, log_date, checkout_date]
  );

  const alreadyBooked = new Set();
  for (const row of existingBookings.rows) {
    for (const room of row.rooms_occupied) {
      alreadyBooked.add(room);
    }
  }

  const duplicateRooms = rooms_occupied.filter(r => alreadyBooked.has(r));
  if (duplicateRooms.length > 0) {
    throw new Error(`Room(s) already booked in the selected date range: ${duplicateRooms.join(", ")}`);
  }

  const totalRoomsOccupied = rooms_occupied.length;

const result = await db.query(
  `INSERT INTO accommodation_visitor_logs (
    accommodation_id,
    log_date,
    checkout_date,
    day_of_week,
    rooms_occupied,
    total_rooms_occupied,
    number_of_guests_check_in,
    number_of_guests_overnight,
    created_by_user_id
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *`,
  [
    accommodationId,
    log_date,
    checkout_date,
    day_of_week,
    rooms_occupied,
    totalRoomsOccupied,
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

  if (new Date(checkout_date) < new Date(log_date)) {
  throw new Error("Checkout date must be the same or after the check-in date.");
}

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

  const totalRoomsOccupied = rooms_occupied.length;

  const result = await db.query(
    `UPDATE accommodation_visitor_logs SET
      accommodation_id = $1,
      log_date = $2,
      checkout_date = $3,
      day_of_week = $4,
      rooms_occupied = $5,
      total_rooms_occupied = $6,
      number_of_guests_check_in = $7,
      number_of_guests_overnight = $8,
      last_updated = CURRENT_TIMESTAMP,
      created_by_user_id = $9
    WHERE id = $10
    RETURNING *`,
    [
      accommodationId,
      log_date,
      checkout_date,
      day_of_week,
      rooms_occupied,
      totalRoomsOccupied,
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
