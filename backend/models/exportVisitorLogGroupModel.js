const db = require("../db/index.js");
const ExcelJS = require("exceljs");


const exportVisitorLogGrouped = async (filter) => {
  const { tourist_spot_id, start_date, end_date } = filter;


  const query = `
    SELECT
      ts.name AS tourist_spot_name,
      ts.barangay, ts.municipality, ts.province, ts.type,
      DATE_TRUNC('month', avl.visit_date) AS month,
      SUM(CASE WHEN vgm.country ILIKE 'philippines' THEN 1 ELSE 0 END) AS local_count,
      SUM(CASE WHEN vgm.country NOT ILIKE 'philippines' THEN 1 ELSE 0 END) AS foreign_count
    FROM attraction_visitor_logs avl
    JOIN tourist_spots ts ON avl.tourist_spot_id = ts.id
    JOIN visitor_group_members vgm ON avl.registration_id = vgm.registration_id
    WHERE ($1::int IS NULL OR avl.tourist_spot_id = $1)
      AND ($2::date IS NULL OR avl.visit_date >= $2)
      AND ($3::date IS NULL OR avl.visit_date <= $3)
    GROUP BY ts.name, ts.barangay, ts.municipality, ts.province, ts.type, month
    ORDER BY month DESC
  `;


  const values = [
    tourist_spot_id || null,
    start_date || null,
    end_date || null
  ];


  const result = await db.query(query, values);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Visitor Summary");


  // Header
  sheet.addRow([
    "Tourist Spot Name",
    "Barangay",
    "Municipality",
    "Province",
    "Type",
    "Month",
    "Local Visitors",
    "Foreign Visitors",
    "Total Visitors"
  ]);


  result.rows.forEach((row) => {
    const formattedMonth = new Date(row.month).toLocaleString("default", {
      year: "numeric",
      month: "long",
    });


    const total = Number(row.local_count) + Number(row.foreign_count);


    sheet.addRow([
      row.tourist_spot_name,
      row.barangay,
      row.municipality,
      row.province,
      row.type,
      formattedMonth,
      row.local_count,
      row.foreign_count,
      total,
    ]);
  });


  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};


module.exports = { exportVisitorLogGrouped };


