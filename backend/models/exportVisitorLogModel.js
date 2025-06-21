const db = require("../db/index.js");
const ExcelJS = require("exceljs");

const exportVisitorLog = async (filter) => {
  const { tourist_spot_id, start_date, end_date } = filter;

  // Build dynamic query
  let query = `
    SELECT 
      ts.name AS tourist_spot_name,
      ts.barangay,
      ts.municipality,
      ts.province,
      ts.type,
      avl.visit_date,
      vgm.name AS visitor_name,
      vgm.sex,
      vgm.country,
      vgm.municipality AS local_municipality,
      vgm.province AS local_province
    FROM attraction_visitor_logs avl
    JOIN tourist_spots ts ON avl.tourist_spot_id = ts.id
    JOIN visitor_group_members vgm ON avl.registration_id = vgm.registration_id
    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (tourist_spot_id) {
    query += ` AND avl.tourist_spot_id = $${count++}`;
    values.push(tourist_spot_id);
  }

  if (start_date && end_date) {
    query += ` AND avl.visit_date BETWEEN $${count++} AND $${count++}`;
    values.push(start_date, end_date);
  }

  query += ` ORDER BY avl.visit_date DESC`;

  const result = await db.query(query, values);

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Visitor Logs");

  // Headers
  sheet.addRow([
    "Tourist Spot Name",
    "Barangay",
    "Municipality",
    "Province",
    "Type",
    "Visit Date",
    "Visitor Name",
    "Sex",
    "Place of Residence"
  ]);

  // Populate rows
  result.rows.forEach((row) => {
    const placeOfResidence =
      row.country.toLowerCase() === "philippines"
        ? `${row.local_municipality}, ${row.local_province}`
        : row.country;

    sheet.addRow([
      row.tourist_spot_name,
      row.barangay,
      row.municipality,
      row.province,
      row.type,
      row.visit_date.toISOString().split("T")[0],
      row.visitor_name,
      row.sex,
      placeOfResidence,
    ]);
  });

  // Return Excel buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = { exportVisitorLog };
