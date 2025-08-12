const db = require("../db/index");
const ExcelJS = require("exceljs");
// Create new island entry registration
const createIslandEntryRegistration = async ({
  unique_code,
  qr_code_url,
  payment_method,
  status,
  total_fee,
  user_id,
  expected_arrival,
}) => {
  const result = await db.query(
    `INSERT INTO island_entry_registration 
     (unique_code, qr_code_url, payment_method, status, total_fee, user_id, expected_arrival)
     VALUES ($1, $2, $3, $4, $5, $6,$7)
     RETURNING *`,
    [
      unique_code,
      qr_code_url,
      payment_method,
      status,
      total_fee,
      user_id,
      expected_arrival,
    ]
  );
  return result.rows[0];
};

// Add group members
const createIslandEntryMembers = async (registrationId, members) => {
  const promises = members.map((member) =>
    db.query(
      `INSERT INTO island_entry_registration_members 
        (registration_id, name, age, sex, is_foreign, municipality, province, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        registrationId,
        member.name,
        member.age,
        member.sex,
        member.is_foreign || false,
        member.municipality || "",
        member.province || "",
        member.country || "",
      ]
    )
  );
  const results = await Promise.all(promises);
  return results.map((res) => res.rows[0]);
};

// Check if code exists
const isIslandCodeTaken = async (uniqueCode) => {
  const result = await db.query(
    `SELECT 1 FROM island_entry_registration WHERE unique_code = $1 LIMIT 1`,
    [uniqueCode]
  );
  return result.rowCount > 0;
};

// Get by code
const getIslandEntryByCode = async (uniqueCode) => {
  const result = await db.query(
    `SELECT * FROM island_entry_registration WHERE unique_code = $1`,
    [uniqueCode]
  );
  return result.rows[0];
};

// Log island entry
const logIslandEntryByRegistration = async ({
  registrationId,
  scannedByUserId,
}) => {
  const result = await db.query(
    `INSERT INTO island_entry_registration_logs 
      (registration_id, scanned_by_user_id, visit_date)
     VALUES ($1, $2, CURRENT_DATE)
     RETURNING *`,
    [registrationId, scannedByUserId]
  );

  return result.rows[0];
};

const saveIslandEntryPayment = async ({
  registration_id,
  amount,
  status,
  payment_link,
  reference_num,
}) => {
  const result = await db.query(
    `INSERT INTO island_entry_payments 
      (registration_id, amount, status, payment_link, reference_num)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [registration_id, amount, status, payment_link, reference_num]
  );
  return result.rows[0];
};

// Get latest registration by user_id
const getLatestIslandEntryByUserId = async (userId) => {
  const result = await db.query(
    `SELECT 
       ier.unique_code, 
       ier.qr_code_url,
       COALESCE(members.group_members, '') AS island_entry_group_members
     FROM island_entry_registration ier
     LEFT JOIN (
       SELECT 
         registration_id, 
         STRING_AGG(name, ', ') AS group_members
       FROM island_entry_registration_members
       GROUP BY registration_id
     ) members ON ier.id = members.registration_id
     WHERE ier.user_id = $1
     ORDER BY ier.registration_date DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0];
};
const getAllIslandEntries = async () => {
  const result = await db.query(`
    SELECT
      ier.*,
      u.first_name,
      u.last_name,
      u.role,
      COALESCE(members.companion_names, '') AS companion_names,
      logs.latest_visit_date
    FROM island_entry_registration ier
    JOIN users u ON ier.user_id = u.user_id
    LEFT JOIN (
      SELECT
        registration_id,
        STRING_AGG(name, ', ') AS companion_names
      FROM island_entry_registration_members
      GROUP BY registration_id
    ) members ON ier.id = members.registration_id
    LEFT JOIN (
      SELECT
        registration_id,
        MAX(visit_date) AS latest_visit_date
      FROM island_entry_registration_logs
      GROUP BY registration_id
    ) logs ON ier.id = logs.registration_id
  `);
  return result.rows;
};

const exportIslandEntryLog = async (filter) => {
  const { start_date, end_date, month, year } = filter;

  let query = `
    SELECT
      ier.unique_code,
      ier.registration_date,
      u.first_name AS main_first_name,
      u.last_name AS main_last_name,
      u.role AS registered_by_role,
      m.name AS member_name,
      m.sex AS member_sex,
      m.municipality AS member_municipality,
      m.province AS member_province,
      m.country AS member_country
    FROM island_entry_registration ier
    JOIN users u ON ier.user_id = u.user_id
    LEFT JOIN island_entry_registration_members m ON ier.id = m.registration_id
    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (start_date && end_date) {
    query += ` AND ier.registration_date BETWEEN $${count++} AND $${count++}`;
    values.push(start_date, end_date);
  }
  if (month) {
    query += ` AND EXTRACT(MONTH FROM ier.registration_date) = $${count++}`;
    values.push(month);
  }
  if (year) {
    query += ` AND EXTRACT(YEAR FROM ier.registration_date) = $${count++}`;
    values.push(year);
  }

  query += ` ORDER BY ier.registration_date DESC`;

  const result = await db.query(query, values);

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Island Entry Visitors");

  // Headers
  sheet.addRow([
    "Unique Code",
    "Visitor Name",
    "Sex",
    "Municipality",
    "Province",
    "Country",
    "Date of Entry",
  ]);

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  let totalVisitors = 0;

  result.rows.forEach((row) => {
    // If registered by staff, do NOT include staff name as visitor
    const visitorSet = new Set();

    if (row.registered_by_role !== "Tourism Staff") {
      visitorSet.add(`${row.main_first_name} ${row.main_last_name}`);
    }
    if (row.member_name) {
      visitorSet.add(row.member_name);
    }

    visitorSet.forEach((visitorName) => {
      sheet.addRow([
        row.unique_code,
        visitorName,
        row.member_sex || "",
        row.member_municipality || "",
        row.member_province || "",
        row.member_country || "",
        row.registration_date.toISOString().split("T")[0],
      ]);
      totalVisitors++;
    });
  });

  // Add empty row before total
  sheet.addRow([]);
  const totalRowIdx = 4; // Row 4
  sheet.getCell(`I${totalRowIdx}`).value = "Total Visitors";
  sheet.getCell(`J${totalRowIdx}`).value = totalVisitors;
  sheet.getCell(`I${totalRowIdx}`).font = { bold: true };
  sheet.getCell(`J${totalRowIdx}`).font = { bold: true };
  sheet.getCell(`I${totalRowIdx}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(`J${totalRowIdx}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // Optionally, set column widths for better appearance
  sheet.columns = [
    { width: 18 },
    { width: 32 },
    { width: 8 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 16 },
    { width: 12 },
  ];

  // Return Excel buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = {
  createIslandEntryRegistration,
  createIslandEntryMembers,
  isIslandCodeTaken,
  getIslandEntryByCode,
  logIslandEntryByRegistration,
  saveIslandEntryPayment,
  getLatestIslandEntryByUserId,
  getAllIslandEntries,
  exportIslandEntryLog,
};
