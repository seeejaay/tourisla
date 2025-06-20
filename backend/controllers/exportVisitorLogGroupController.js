const { exportVisitorLogGrouped } = require("../models/exportVisitorLogGroupModel");

const isValidDate = (dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && dateStr === date.toISOString().split("T")[0];
};

const exportVisitorLogGroupController = async (req, res) => {
  try {
    const { from, to, tourist_spot_id } = req.query;

    if ((from && !isValidDate(from)) || (to && !isValidDate(to))) {
      return res.status(400).json({ error: "Invalid date format. Please use a valid YYYY-MM-DD date." });
    }

    const filter = {
      start_date: from?.trim() || null,
      end_date: to?.trim() || null,
      tourist_spot_id: tourist_spot_id?.trim() || null,
    };

    const fileBuffer = await exportVisitorLogGrouped(filter);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=visitor_log_summary.xlsx");
    res.send(fileBuffer);
  } catch (error) {
    console.error("Export Visitor Log Summary Error:", error);
    res.status(500).json({ error: "Failed to export visitor summary log" });
  }
};

module.exports = { exportVisitorLogGroupController };
