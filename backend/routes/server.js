require("dotenv").config();
const express = require("express");
const session = require("express-session");
const db = require("../db/index.js");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Controllers
const { loginUser, logoutUser } = require("../controllers/authController.js");
const {
  createUserController,
  currentUserController,
  editUserController,
  deleteUserController,
  viewUserController,
} = require("../controllers/userController.js");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateTourGuide,
  authenticateTourOperator,
} = require("../middleware/middleware.js");

const {
  createAnnouncementController,
  editAnnouncementController,
  deleteAnnouncementController,
  viewAnnouncementController,
  viewAnnouncementByIdController,
  getByCategoryController,
} = require("../controllers/announceController.js");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.0.130:3000",
      "http://192.168.0.135:3000",
      "http://192.168.0.130", // change this to your local IP address
      process.env.CLIENT_URL, // Add this if you want to support env config too
    ],
    credentials: true,
  })
);

const {
  createHotlineController,
  editHotlineController,
  deleteHotlineController,
  viewHotlinesController,
  viewHotlineByIdController,
} = require("../controllers/hotlineController.js");

const {
  createGuideRegisController,
  editGuideRegisController,
  deleteGuideRegisController,
  viewGuideRegisController,
  viewGuideRegisByIdController,
} = require("../controllers/guideRegisController.js");

const {
  createGuideUploadDocuController,
  editGuideUploadDocuController,
  getGuideUploadDocuByIdController,
} = require("../controllers/guideUploadDocuController.js");

const {
  createOperatorRegisController,
  editOperatorRegisController,
  deleteOperatorRegisController,
  viewAllOperatorRegisController,
  viewOperatorRegisByIdController,
} = require("../controllers/operatorRegisController.js");

const {
  createOperatorUploadDocuController,
  editOperatorUploadDocuController,
  getOperatorUploadDocuByIdController,
} = require("../controllers/operatorUploadDocuController.js");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/api/v1/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for creating users (accessible by both admins and new users)
app.post("/api/v1/users", createUserController);

// Route for admin-only actions
app.post("/api/v1/admin-action", authenticateAdmin, (req, res) => {
  res.json({ message: "This is an admin-only action" });
});

app.post("/api/v1/login", loginUser);
app.post("/api/v1/logout", logoutUser);

app.get("/api/v1/user", authenticateUser, currentUserController);
app.get(
  "/api/v1/users/:userId",
  authenticateUser,
  authenticateAdmin,
  viewUserController
);
app.put("/api/v1/users/:userId", authenticateUser, editUserController);
app.put("/api/v1/users/d/:userId", authenticateUser, deleteUserController);

// Route for announcements
app.get("/api/v1/announcements", viewAnnouncementController);
app.get(
  "/api/v1/announcements/:announcementId",
  viewAnnouncementByIdController
);
app.post(
  "/api/v1/announcements",
  createAnnouncementController,
  authenticateAdmin
);
app.put("/api/v1/announcements/:announcementId", editAnnouncementController);
app.delete(
  "/api/v1/announcements/:announcementId",
  deleteAnnouncementController,
  authenticateAdmin
);
app.get(
  "/api/v1/announcements/category/:category([a-zA-Z0-9-_]+)",
  getByCategoryController
);

// Routes for Hotlines
app.post("/api/v1/hotlines", authenticateAdmin, createHotlineController);
app.put(
  "/api/v1/hotlines/:hotlineId",
  authenticateAdmin,
  editHotlineController
);
app.delete(
  "/api/v1/hotlines/:hotlineId",
  authenticateAdmin,
  deleteHotlineController
);
app.get("/api/v1/hotlines", viewHotlinesController);
app.get("/api/v1/hotlines/:hotlineId", viewHotlineByIdController);

// Routes for Tour Guide Registration
app.post(
  "/api/v1/guideRegis",
  authenticateTourGuide,
  createGuideRegisController
);
app.put(
  "/api/v1/guideRegis/:guideId",
  authenticateTourGuide,
  editGuideRegisController
);
app.delete(
  "/api/v1/guideRegis/:guideId",
  authenticateTourGuide,
  deleteGuideRegisController
);
app.get("/api/v1/guideRegis", authenticateTourGuide, viewGuideRegisController);
app.get(
  "/api/v1/guideRegis/:guideId",
  authenticateTourGuide,
  viewGuideRegisByIdController
);

// Routes for Tour Guide Document Upload
app.post(
  "/api/v1/guideUploadDocu/:guideId",
  authenticateTourGuide,
  createGuideUploadDocuController
);
app.put(
  "/api/v1/guideUploadDocu/:docuId",
  authenticateTourGuide,
  editGuideUploadDocuController
);
app.get(
  "/api/v1/guideUploadDocu/:docuId",
  authenticateTourGuide,
  getGuideUploadDocuByIdController
);

// Routes for Tour Operator Registration
app.post(
  "/api/v1/operatorRegis",
  authenticateTourOperator,
  createOperatorRegisController
);
app.put(
  "/api/v1/operatorRegis/:operatorId",
  authenticateTourOperator,
  editOperatorRegisController
);
app.delete(
  "/api/v1/operatorRegis/:operatorId",
  authenticateTourOperator,
  deleteOperatorRegisController
);
app.get(
  "/api/v1/operatorRegis",
  authenticateTourOperator,
  viewAllOperatorRegisController
);
app.get(
  "/api/v1/operatorRegis/:operatorId",
  authenticateTourOperator,
  viewOperatorRegisByIdController
);

// Routes for Tour Operator Document Upload
app.post(
  "/api/v1/operatorUploadDocu/:operatorId",
  authenticateTourOperator,
  createOperatorUploadDocuController
);
app.put(
  "/api/v1/operatorUploadDocu/:documentId",
  authenticateTourOperator,
  editOperatorUploadDocuController
);
app.get(
  "/api/v1/operatorUploadDocu/:documentId",
  authenticateTourOperator,
  getOperatorUploadDocuByIdController
);