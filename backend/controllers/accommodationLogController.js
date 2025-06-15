const {
  createAccommodationLog,
  editAccommodationLog,
  deleteAccommodationLog,
  getAllAccommodationLogs,
  getAccommodationLogById,
  exportAccommodationLog,
} = require("../models/accommodationLogModel.js");

// Create
const createAccommodationLogController = async (req, res) => {
  try {
   // Get the user ID from the session
    const userId = req.session.user.user_id ?? req.session.user.id;
    const log = await createAccommodationLog(req.body, userId);
    
    res.status(201).json({
      message: "Accommodation log created successfully",
      data: log
    });

  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

// Edit
const editAccommodationLogController = async (req, res) => {
  try {
    const logId = req.params.logId;
    // Get the user ID from the session
    const userId = req.session.user.user_id ?? req.session.user.id;
    const log = await editAccommodationLog(logId, req.body, userId);
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

// Delete
const deleteAccommodationLogController = async (req, res) => {
  try {
    const logId = req.params.logId;
    const deleted = await deleteAccommodationLog(logId);
    res.json(deleted);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

// View All
const getAllAccommodationLogsController = async (req, res) => {
  try {
    const logs = await getAllAccommodationLogs();
    res.json(logs); 
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

// View One
const getAccommodationLogByIdController = async (req, res) => {
  try {
    const logId = req.params.logId;
    const log = await getAccommodationLogById(logId);
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

// const exportAccommodationLogController = async (req, res) => {
//   try {
//     const filter = req.query;
//     const csvData = await exportAccommodationLog(filter);

//     if (!csvData) {
//       return res.status(404).send("No records to export.");
//     }

//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", "attachment; filename=accommodation_logs.csv");
//     res.send(csvData);
//   } catch (err) {
//     console.error("Export error:", err.message);
//     res.status(500).send("Failed to export logs.");
//   }
// };

const exportAccommodationLogController = async (req, res) => {
  try {
    const filter = req.query;
    const buffer = await exportAccommodationLog(filter);

    if (!buffer) {
      return res.status(404).send("No records to export.");
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="accommodation_logs.xlsx"');
    res.send(buffer);
  } catch (err) {
    console.error("Export error:", err.message);
    res.status(500).send("Failed to export logs.");
  }
};


module.exports = {
  createAccommodationLogController,
  editAccommodationLogController,
  deleteAccommodationLogController,
  getAllAccommodationLogsController,
  getAccommodationLogByIdController,
  exportAccommodationLogController,
};
