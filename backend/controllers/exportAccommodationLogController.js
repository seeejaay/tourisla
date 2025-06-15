// const db = require("../db/index.js");

// const exportAccommodationLogController = async (req, res) => {
//   try {
//     const { accommodation_id, start_date, end_date } = req.query;

//     const result = await db.query(
//       `SELECT 
//         avl.*, 
//         a.no_of_rooms, 
//         a.name_of_establishment 
//        FROM accommodation_visitor_logs avl
//        JOIN accommodations a ON a.id = avl.accommodation_id
//        WHERE ($1::int IS NULL OR avl.accommodation_id = $1)
//        AND ($2::date IS NULL OR avl.log_date >= $2)
//        AND ($3::date IS NULL OR avl.log_date <= $3)
//        ORDER BY avl.log_date ASC`,
//       [accommodation_id || null, start_date || null, end_date || null]
//     );

//     const rows = result.rows;

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "No records found." });
//     }

//     // Determine max number of rooms from all occupied room arrays
//     let maxRoomNumber = 0;
//     rows.forEach(row => {
//       const occupied = row.rooms_occupied || [];
//       const maxInThisRow = Math.max(...occupied, 0);
//       if (maxInThisRow > maxRoomNumber) maxRoomNumber = maxInThisRow;
//     });

//     // Define fixed headers
//     const fixedHeaders = [
//       "Accommodation Name",
//       "Log Date (YYYY)", "Log Date (MM)", "Log Date (DD)",
//       "Checkout Date (YYYY)", "Checkout Date (MM)", "Checkout Date (DD)",
//       "Day of Week",
//       "Total Rooms Occupied",
//       "Number of Guests Check-in",
//       "Number of Guests Overnight"
//     ];

//     // Add dynamic room headers: Room 1 to Room N
//     const roomHeaders = Array.from({ length: maxRoomNumber }, (_, i) => `Room ${i + 1}`);

//     const headers = [...fixedHeaders, ...roomHeaders];

//     // Create CSV rows
//     const csvRows = rows.map(row => {
//       const logDate = new Date(row.log_date);
//       const checkoutDate = new Date(row.checkout_date);
//       const roomOccupancy = Array.from({ length: maxRoomNumber }, (_, i) =>
//         row.rooms_occupied?.includes(i + 1) ? "✓" : ""
//       );

//       return [
//         row.name_of_establishment,
//         logDate.getFullYear(), logDate.getMonth() + 1, logDate.getDate(),
//         checkoutDate.getFullYear(), checkoutDate.getMonth() + 1, checkoutDate.getDate(),
//         row.day_of_week,
//         row.total_rooms_occupied,
//         row.number_of_guests_check_in,
//         row.number_of_guests_overnight,
//         ...roomOccupancy
//       ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(",");
//     });

//     const csv = [headers.join(","), ...csvRows].join("\n");

//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", 'attachment; filename="accommodation_logs.csv"');
//     res.send(csv);
//   } catch (error) {
//     console.error("CSV Export Error:", error.message);
//     res.status(500).json({ message: "CSV export failed." });
//   }
// };

// module.exports = {
//   exportAccommodationLogController,
// };


const ExcelJS = require("exceljs");
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

  // Determine maximum room number used across all accommodations
  let maxRoom = 0;
  logs.forEach(log => {
    const maxInRow = Math.max(...(log.rooms_occupied || [0]));
    if (maxInRow > maxRoom) maxRoom = maxInRow;
  });

  const grouped = {};

  logs.forEach(log => {
    const accName = log.name_of_establishment || "Unnamed";
    if (!grouped[accName]) grouped[accName] = [];
    grouped[accName].push(log);
  });

  const workbook = new ExcelJS.Workbook();

  for (const [accName, accLogs] of Object.entries(grouped)) {
    const sheet = workbook.addWorksheet(accName.slice(0, 31)); // max 31 chars for Excel sheet name

    // Headers
    const headers = [
      "Log Date (YYYY)", "Log Date (MM)", "Log Date (DD)",
      "Checkout Date (YYYY)", "Checkout Date (MM)", "Checkout Date (DD)",
      "Day of Week", "Total Rooms Occupied",
      "Number of Guests Check-in", "Number of Guests Overnight",
      ...Array.from({ length: maxRoom }, (_, i) => `Room ${i + 1}`)
    ];
    sheet.addRow(headers);

    accLogs.forEach(log => {
      const logDate = new Date(log.log_date);
      const checkoutDate = new Date(log.checkout_date);
      const roomMarks = Array.from({ length: maxRoom }, (_, i) =>
        log.rooms_occupied?.includes(i + 1) ? "✓" : ""
      );

      const rowData = [
        logDate.getFullYear(), logDate.getMonth() + 1, logDate.getDate(),
        checkoutDate.getFullYear(), checkoutDate.getMonth() + 1, checkoutDate.getDate(),
        log.day_of_week,
        log.total_rooms_occupied,
        log.number_of_guests_check_in,
        log.number_of_guests_overnight,
        ...roomMarks
      ];

      sheet.addRow(rowData);
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
