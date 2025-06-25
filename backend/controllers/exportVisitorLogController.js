const {
  exportVisitorLog,
  getAllVisitorLogsWithSpotName,
} = require("../models/exportVisitorLogModel");

const exportVisitorLogController = async (req, res) => {
  try {
    const { from, to, tourist_spot_id } = req.query;
    console.log("Export Visitor Log Query Params:", {
      from,
      to,
      tourist_spot_id,
    });
    const filter = {
      tourist_spot_id: tourist_spot_id ? parseInt(tourist_spot_id, 10) : null,
      start_date: from?.trim() || null,
      end_date: to?.trim() || null,
    };

    const fileBuffer = await exportVisitorLog(filter);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=visitor_logs.xlsx"
    );
    res.send(fileBuffer);
  } catch (error) {
    console.error("Export Visitor Log Error:", error);
    res.status(500).json({ error: "Failed to export visitor log" });
  }
};

const getVisitorLogsWithSpotName = async (req, res) => {
  try {
    const logs = await getAllVisitorLogsWithSpotName();
    res.status(200).json(logs);
  } catch (error) {
    console.error("Get Visitor Logs Error:", error);
    res.status(500).json({ error: "Failed to fetch visitor logs" });
  }
};

module.exports = { exportVisitorLogController, getVisitorLogsWithSpotName };
