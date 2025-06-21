const ExcelJS = require("exceljs");
const db = require("../db/index.js");


const exportAccommodationLog = async (filter) => {
  const { accommodation_id, start_date, end_date } = filter;


  // 🛡️ Sanitize empty strings to null so SQL conditions work properly
  const startDate = start_date?.trim() || null;
  const endDate = end_date?.trim() || null;


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
    [accommodation_id || null, startDate, endDate]
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
