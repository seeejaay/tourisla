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
  LEFT JOIN visitor_group_members vgm ON avl.registration_id = vgm.registration_id
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
    "Place of Residence",
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

const getAllVisitorLogsWithSpotName = async () => {
  const query = `
    SELECT
      avl.*,
      ts.name AS tourist_spot_name,
      u.first_name || ' ' || u.last_name AS scanned_by_name,
      -- Main visitor's name
      main_visitor.first_name || ' ' || main_visitor.last_name AS main_visitor_name,
      -- All names: main + companions
      main_visitor_and_group.all_names AS visitor_names,
      main_visitor_and_group.total_visitors
    FROM attraction_visitor_logs avl
    JOIN tourist_spots ts ON avl.tourist_spot_id = ts.id
    LEFT JOIN users u ON avl.scanned_by_user_id = u.user_id
    JOIN visitor_registrations vr ON avl.registration_id = vr.id
    JOIN users main_visitor ON vr.user_id = main_visitor.user_id
    LEFT JOIN (
      SELECT
        vr.id AS registration_id,
        -- Concatenate main visitor and companions
        vr_user.first_name || ' ' || vr_user.last_name
          || CASE WHEN COUNT(vgm.name) > 0 THEN ', ' || STRING_AGG(vgm.name, ', ') ELSE '' END AS all_names,
        1 + COUNT(vgm.name) AS total_visitors
      FROM visitor_registrations vr
      JOIN users vr_user ON vr.user_id = vr_user.user_id
      LEFT JOIN visitor_group_members vgm ON vgm.registration_id = vr.id
      GROUP BY vr.id, vr_user.first_name, vr_user.last_name
    ) main_visitor_and_group ON avl.registration_id = main_visitor_and_group.registration_id
    ORDER BY avl.visit_date DESC
  `;

  const result = await db.query(query);
  return result.rows;
};

module.exports = { exportVisitorLog, getAllVisitorLogsWithSpotName };
