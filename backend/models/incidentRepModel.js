const db = require("../db/index.js");


const createIncidentReport = async ({
  submitted_by,
  incident_type,
  location,
  incident_date,
  incident_time,
  description,
  photo_url
}) => {
  // Fetch role inside the model
  const userResult = await db.query(
    'SELECT role FROM users WHERE user_id = $1',
    [submitted_by]
  );

  if (userResult.rowCount === 0) {
    throw new Error('User not found');
  }

  const role = userResult.rows[0].role;

  const result = await db.query(
    `INSERT INTO incident_report (
      submitted_by,
      role,
      incident_type,
      location,
      incident_date,
      incident_time,
      description,
      photo_url,
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [submitted_by, role, incident_type, location, incident_date, incident_time, description, photo_url, 'RECEIVED']
  );
  return result.rows[0];
};


const getAllIncidentReports = async () => {
  const result = await db.query(`
    SELECT
      ir.*,
      u.first_name || ' ' || u.last_name AS submitted_by_name,
      u.role AS submitted_by_role
    FROM incident_report ir
    LEFT JOIN users u ON ir.submitted_by = u.user_id
    ORDER BY ir.submitted_at DESC
  `);
  return result.rows;
};


const getIncidentReportsByUser = async (userId) => {
  const result = await db.query(`
    SELECT *
    FROM incident_report
    WHERE submitted_by = $1
    ORDER BY submitted_at DESC
  `, [userId]);
  return result.rows;
};


const updateIncidentStatus = async (id, status) => {
  const result = await db.query(
    `UPDATE incident_report
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

module.exports = {
  createIncidentReport,
  getAllIncidentReports,
  getIncidentReportsByUser,
  updateIncidentStatus
};