const db = require("../db/index.js");

const exportAccommodationLogController = async (req, res) => {
  try {
    const { accommodation_id, start_date, end_date } = req.query;

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

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No records found." });
    }

    const rows = result.rows;
    const headers = Object.keys(rows[0]);

    const csv = [
      headers.join(","),
      ...rows.map(row =>
        headers.map(field => {
          let value = row[field];
          if (Array.isArray(value)) value = JSON.stringify(value);
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="accommodation_logs.csv"');
    res.send(csv);
  } catch (error) {
    console.error("CSV Export Error:", error.message);
    res.status(500).json({ message: "CSV export failed." });
  }
};

module.exports = {
  exportAccommodationLogController,
};
