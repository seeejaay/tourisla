const { exportVisitorLog } = require("../models/exportVisitorLogModel");


const exportVisitorLogController = async (req, res) => {
  try {
    const { from, to, tourist_spot_id } = req.query;


    const filter = {
      from_date: from?.trim() || null,
      to_date: to?.trim() || null,
      tourist_spot_id: tourist_spot_id?.trim() || null,
    };


    const fileBuffer = await exportVisitorLog(filter);


    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=visitor_logs.xlsx");
    res.send(fileBuffer);
  } catch (error) {
    console.error("Export Visitor Log Error:", error);
    res.status(500).json({ error: "Failed to export visitor log" });
  }
};


module.exports = { exportVisitorLogController };
