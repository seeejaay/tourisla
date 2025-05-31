require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { getPresignedUrl } = require("../utils/s3.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const db = require("../db/index.js");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// Controllers
const { loginUser, logoutUser } = require("../controllers/authController.js");
const {
  createUserController,
  currentUserController,
  editUserController,
  deleteUserController,
  viewUserController,
  forgotPasswordController,
  resetPasswordController,
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

const {
  viewTourGuideApplicantsController,
  viewTourGuideApplicantDetailsController,
  approveTourGuideApplicantController,
  rejectTourGuideApplicantController,
  viewTourOperatorApplicantsController,
  viewTourOperatorApplicantDetailsController,
  approveTourOperatorApplicantController,
  rejectTourOperatorApplicantController,
} = require("../controllers/applicantsController.js");

const {
  applyToTourOperatorController,
  getApplicationsForTourOperatorController,
  approveTourGuideApplicationController,
  rejectTourGuideApplicationController,
} = require("../controllers/guideApplyToOperatorController.js");

const {
  createTouristSpotController,
  editTouristSpotController,
  deleteTouristSpotController,
  viewTouristSpotsController,
  viewTouristSpotByIdController,
} = require('../controllers/touristSpotController');

const {
  createRuleController,
  editRuleController,
  deleteRuleController,
  viewRulesController,
  viewRuleByIdController,
} = require('../controllers/rulesRegulationController.js');

const {
  createArticleController,
  editArticleController,
  deleteArticleController,
  viewArticlesController,
  viewArticleByIdController,
} = require("../controllers/articleController");

const {
  createTourPackageController,
  updateTourPackageController,
  deleteTourPackageController,
  viewTourPackagesController,
  viewTourPackageByIdController,
} = require("../controllers/tourPackagesController.js");


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

app.get("/api/v1/s3-presigned-url", async (req, res) => {
  const { key, contentType } = req.query;
  if (!key || !contentType) {
    return res.status(400).json({ error: "Missing key or contentType" });
  }
  try {
    const url = await getPresignedUrl(key, contentType);
    res.status(200).json({ url });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for creating users (accessible by both admins and new users)
app.post("/api/v1/users", createUserController);

// Route for forgot password
app.post("/api/v1/forgot-password", forgotPasswordController);
app.post("/api/v1/reset-password", resetPasswordController);
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
app.patch("/api/v1/users/:userId", authenticateUser, deleteUserController);

// Route for announcements
app.get("/api/v1/announcements", viewAnnouncementController);
app.get(
  "/api/v1/announcements/:announcementId",
  viewAnnouncementByIdController
);
app.post(
  "/api/v1/announcements",
  upload.single("image"),
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
app.post(
  "/api/v1/hotlines", 
  authenticateAdmin, 
  createHotlineController
);
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

// Routes for Admin verifying applicants
app.get(
  "/api/v1/guideApplicants",
  authenticateAdmin,
  viewTourGuideApplicantsController
);
app.get(
  "/api/v1/guideApplicants/:applicantId",
  authenticateAdmin,
  viewTourGuideApplicantDetailsController
);
app.put(
  "/api/v1/guideApplicants/:applicantId/approve",
  authenticateAdmin,
  approveTourGuideApplicantController
);
app.put(
  "/api/v1/guideApplicants/:applicantId/reject",
  authenticateAdmin,
  rejectTourGuideApplicantController
);
app.get(
  "/api/v1/operatorApplicants",
  authenticateAdmin,
  viewTourOperatorApplicantsController
);
app.get(
  "/api/v1/operatorApplicants/:applicantId",
  authenticateAdmin,
  viewTourOperatorApplicantDetailsController
);
app.put(
  "/api/v1/operatorApplicants/:applicantId/approve",
  authenticateAdmin,
  approveTourOperatorApplicantController
);
app.put(
  "/api/v1/operatorApplicants/:applicantId/reject",
  authenticateAdmin,
  rejectTourOperatorApplicantController
);

// Routes for Tour Guides applying to Tour Operators
app.post(
  "/api/v1/applyToOperator",
  authenticateTourGuide,
  applyToTourOperatorController
);
app.get(
  "/api/v1/applications/:operatorId",
  authenticateTourOperator,
  getApplicationsForTourOperatorController
);
app.put(
  "/api/v1/applications/:applicationId/approve",
  authenticateTourOperator,
  approveTourGuideApplicationController
);
app.put(
  "/api/v1/applications/:applicationId/reject",
  authenticateTourOperator,
  rejectTourGuideApplicationController
);

// Routes for Tourist Spots
app.post(
  "/api/v1/tourist-spots",
  authenticateAdmin,
  createTouristSpotController
);
app.put(
  "/api/v1/tourist-spots/:touristSpotId",
  authenticateAdmin,
  editTouristSpotController
);
app.delete(
  "/api/v1/tourist-spots/:touristSpotId",
  authenticateAdmin,
  deleteTouristSpotController
);
app.get("/api/v1/tourist-spots", viewTouristSpotsController);
app.get("/api/v1/tourist-spots/:touristSpotId", viewTouristSpotByIdController);

// Rules & Regulations Routes
app.post("/api/v1/rules", authenticateAdmin, createRuleController);
app.put("/api/v1/rules/:ruleId", authenticateAdmin, editRuleController);
app.delete("/api/v1/rules/:ruleId", authenticateAdmin, deleteRuleController);
app.get("/api/v1/rules", viewRulesController);
app.get("/api/v1/rules/:ruleId", viewRuleByIdController);

// Routes — Articles
app.post("/api/v1/articles", authenticateAdmin, createArticleController);
app.put("/api/v1/articles/:articleId", authenticateAdmin, editArticleController);
app.delete("/api/v1/articles/:articleId", authenticateAdmin, deleteArticleController);
app.get("/api/v1/articles", viewArticlesController);
app.get("/api/v1/articles/:articleId", viewArticleByIdController);

// Routes — Tour Packages
app.post(
  "/api/v1/tour-packages",
  createTourPackageController
);
app.put(
  "/api/v1/tour-packages/:id",
  authenticateTourOperator,
  updateTourPackageController
);
app.delete(
  "/api/v1/tour-packages/:id",
  authenticateTourOperator,
  deleteTourPackageController
);
app.get(
  "/api/v1/tour-packages",
  authenticateTourOperator,
  viewTourPackagesController
);
app.get(
  "/api/v1/tour-packages/:id",
  authenticateTourOperator,
  viewTourPackageByIdController
);