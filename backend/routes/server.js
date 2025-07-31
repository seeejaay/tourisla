require("dotenv").config();
const express = require("express");
const app = express();

app.set("trust proxy", 1);

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { allowedRoles } = require("../middleware/middleware.js");
const db = require("../db/index.js");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.0.130:3000",
      "http://192.168.0.135:3000",
      "http://192.168.0.130",
      "http://dev.tourisla.local:3000",
      "https://tourisla.vercel.app",
      "https://tourisla.space",
      "https://tourisla.netlify.app",
      "https://tourisla-seven.vercel.app",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new pgSession({
      pool: db.pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
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
  editUserStatusController,
} = require("../controllers/userController.js");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateTourGuide,
  authenticateTourOperator,
  authenticateTourismStaff,
  authenticateTourismOfficer,
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
  getGuideUploadByUserIdController,
  approveGuideUploadDocuController,
  rejectGuideUploadDocuController,
  revokeGuideUploadDocuController,
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
  getOperatorUploadByUserIdController,
  approveOperatorUploadDocuController,
  rejectOperatorUploadDocuController,
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
  getOperatorApplicantByUserIdController,
  getGuideFeedbacksForOperatorController,
} = require("../controllers/applicantsController.js");

const {
  applyToTourOperatorController,
  getApplicationsForTourOperatorController,
  approveTourGuideApplicationController,
  rejectTourGuideApplicationController,
  fetchAllApplicationsController,
  fetchGuideApplicationController,
} = require("../controllers/guideApplyToOperatorController.js");

const {
  createTouristSpotController,
  editTouristSpotController,
  deleteTouristSpotController,
  viewTouristSpotsController,
  viewTouristSpotByIdController,
  deleteTouristSpotImageController,
  assignAttractionToStaffController,
} = require("../controllers/touristSpotController");

const {
  createRuleController,
  editRuleController,
  deleteRuleController,
  viewRulesController,
  viewRuleByIdController,
} = require("../controllers/rulesRegulationController.js");

const {
  createArticleController,
  editArticleController,
  deleteArticleController,
  viewArticlesController,
  viewArticleByIdController,
  uploadArticleImagesController,
  deleteArticleImageController,
} = require("../controllers/articleController");

const {
  createAccommodationController,
  editAccommodationController,
  deleteAccommodationController,
  viewAccommodationsController,
  viewAccommodationByIdController,
  assignTourismStaffController,
  getAllTourismStaffController,
} = require("../controllers/accommodationController.js");

const {
  registerVisitorController,
  manualCheckInController,
  getVisitorGroupMembersController,
  registerWalkInVisitorController,
  getVisitorResultController,
  getQRCodebyUserIdController,
  visitorHistoryController,
} = require("../controllers/visitorRegistrationController");

const {
  registerIslandEntryController,
  manualIslandEntryCheckInController,
  getIslandEntryMembersController,
  checkPayMongoPaymentStatusController,
  registerIslandWalkInController,
  getLatestIslandEntryController,
  markIslandEntryPaidController,
  getAllIslandEntriesController,
} = require("../controllers/islandEntryRegisController");

const {
  createTourPackageController,
  updateTourPackageController,
  deleteTourPackageController,
  viewTourPackagesController,
  viewTourPackageByIdController,
  getTourPackagesByGuideController,
  viewAllTourPackages,
  getBookingsByTourPackageController,
  updateTourPackageStatusController,
} = require("../controllers/tourPackagesController.js");

const {
  createAccommodationLogController,
  editAccommodationLogController,
  deleteAccommodationLogController,
  getAllAccommodationLogsController,
  getAccommodationLogByIdController,
  exportAccommodationLogController,
  getAccommodationLogsByAccommodationIdController,
} = require("../controllers/accommodationLogController.js");

const {
  createPolicyController,
  editPolicyController,
  deletePolicyController,
  getAllPoliciesController,
  getPolicyByIdController,
  getPoliciesByTypeController,
} = require("../controllers/policyController");

const { getWeather } = require("../controllers/weatherController");
const {
  getTripadvisorHotels,
  getTripadvisorHotelsWithPhotos,
} = require("../controllers/tripadvisorController.js");

const {
  exportVisitorLogController,
  getVisitorLogsWithSpotName,
} = require("../controllers/exportVisitorLogController");
const {
  exportVisitorLogGroupController,
} = require("../controllers/exportVisitorLogGroupController");

const {
  authorizeGoogleCalendarController,
  googleCalendarCallbackController,
} = require("../controllers/calendarController.js");

const {
  createBookingController,
  updateBookingStatusController,
  getTouristBookingsController,
  getBookingsByPackageController,
  getBookingByIdController,
  getTouristBookingsFilteredController,
  cancelBookingController,
  getBookingsByTourOperatorController,
} = require("../controllers/bookingController.js");

const {
  markBookingAsFinishedController,
  getTourGuideBookingsFilteredController,
} = require("../controllers/guideBookingsController.js");

const {
  submitFeedbackController,
  viewFeedbackGroupAnswersController,
  viewAllFeedbackForEntityController,
  createQuestionController,
  editQuestionController,
  deleteQuestionController,
  viewQuestionsByTypeController,
  getMySpotFeedbacksController,
  getMyOperatorFeedbacksController,
  getMyGuideFeedbacksController,
} = require("../controllers/feedbackController.js");

const {
  createIncidentReportController,
  viewAllIncidentReportsController,
  viewIncidentReportByUserController,
  updateIncidentStatusController,
} = require("../controllers/incidentRepController.js");

const {
  uploadOperatorQrController,
  getOperatorQrController,
} = require("../controllers/operatorQRController.js");

const {
  getAllPricesController,
  getActivePriceController,
  createPriceController,
  togglePriceController,
  updatePriceDetailsController,
} = require("../controllers/priceManageController.js");

const {
  createIslandEntryPaymentLink,
  handlePayMongoWebhook,
  manuallyConfirmPayment,
} = require("../controllers/paymongoController.js");

// Routes for PayMongo (must be placed before app.listen)
app.post("/api/v1/paymongo/links", createIslandEntryPaymentLink);
app.post("/api/v1/paymongo/webhook", handlePayMongoWebhook);
app.post("/api/v1/paymongo/manual-confirm", manuallyConfirmPayment);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.listen(3005, "127.0.0.1", () => {
//   console.log("Server is running on http://dev.tourisla.local:3005");
// });

app.get("/weather", getWeather);

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
app.patch("/api/v1/users/status", authenticateUser, editUserStatusController);
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
  allowedRoles([
    "Admin",
    "Tourism Staff",
    "Tourism Officer",
    "Cultural Director",
  ])
);
app.put(
  "/api/v1/announcements/:announcementId",
  upload.single("image"),
  editAnnouncementController,
  allowedRoles([
    "Admin",
    "Tourism Staff",
    "Tourism Officer",
    "Cultural Director",
  ])
);
app.delete(
  "/api/v1/announcements/:announcementId",
  deleteAnnouncementController,
  allowedRoles([
    "Admin",
    "Tourism Staff",
    "Tourism Officer",
    "Cultural Director",
  ])
);
app.get(
  "/api/v1/announcements/category/:category([a-zA-Z0-9-_]+)",
  getByCategoryController
);

// Routes for Hotlines
app.post(
  "/api/v1/hotlines",
  allowedRoles(["Admin", "Tourism Officer", "Cultural Director"]),
  createHotlineController
);
app.put(
  "/api/v1/hotlines/:hotlineId",
  allowedRoles(["Admin", "Tourism Officer", "Cultural Director"]),
  editHotlineController
);
app.delete(
  "/api/v1/hotlines/:hotlineId",
  allowedRoles(["Admin", "Tourism Officer", "Cultural Director"]),
  deleteHotlineController
);
app.get("/api/v1/hotlines", viewHotlinesController);
app.get("/api/v1/hotlines/:hotlineId", viewHotlineByIdController);

// Routes for Tour Guide Registration
app.post(
  "/api/v1/guideRegis",
  upload.single("profile_picture"),
  createGuideRegisController
);
app.put(
  "/api/v1/guideRegis/:guideId",
  upload.single("profile_picture"),
  authenticateTourGuide,
  editGuideRegisController
);
app.delete(
  "/api/v1/guideRegis/:guideId",
  authenticateTourGuide,
  deleteGuideRegisController
);
app.get("/api/v1/guideRegis", viewGuideRegisController);
app.get(
  "/api/v1/guideRegis/:guideId",
  allowedRoles([
    "Tourism Staff",
    "Tourism Officer",
    "Admin",
    "Tour Guide",
    "Tour Operator",
  ]),
  viewGuideRegisByIdController
);

// Routes for Tour Guide Document Upload
app.post(
  "/api/v1/guideUploadDocu/:guideId",
  upload.single("document"),
  authenticateTourGuide,
  createGuideUploadDocuController
);
app.put(
  "/api/v1/guideUploadDocu/approve",
  allowedRoles(["Tourism Officer"]),
  approveGuideUploadDocuController
);
app.put(
  "/api/v1/guideUploadDocu/reject",
  allowedRoles(["Tourism Officer"]),
  rejectGuideUploadDocuController
);
app.put(
  "/api/v1/guideUploadDocu/revoke",
  allowedRoles(["Tourism Officer"]),
  revokeGuideUploadDocuController
);
app.put(
  "/api/v1/guideUploadDocu/:docuId",
  upload.single("document"),
  authenticateTourGuide,
  editGuideUploadDocuController
);

app.get(
  "/api/v1/guideUploadDocu/doc/:docuId",
  allowedRoles(["Tourism Staff", "Tourism Officer", "Admin", "Tour Guide"]),
  getGuideUploadDocuByIdController
);
app.get(
  "/api/v1/guideUploadDocu/user/:userId",
  allowedRoles([
    "Tourism Staff",
    "Tourism Officer",
    "Admin",
    "Tour Guide",
    "Tour Operator",
  ]),
  getGuideUploadByUserIdController
);

// Routes for Tour Operator Registration
app.post("/api/v1/operatorRegis", createOperatorRegisController);
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
  allowedRoles([
    "Tourism Staff",
    "Tourism Officer",
    "Admin",
    "Tour Guide",
    "Tour Operator",
  ]),
  viewAllOperatorRegisController
);
app.get(
  "/api/v1/operatorRegis/:operatorId",
  allowedRoles([
    "Tourism Staff",
    "Tourism Officer",
    "Admin",
    "Tour Guide",
    "Tour Operator",
  ]),
  viewOperatorRegisByIdController
);

// Routes for Tour Operator Document Upload
app.post(
  "/api/v1/operatorUploadDocu/:operatorId",
  upload.single("document"),
  authenticateTourOperator,
  createOperatorUploadDocuController
);

app.put(
  "/api/v1/operatorUploadDocu/approve",
  allowedRoles(["Tourism Officer"]),
  approveOperatorUploadDocuController
);

app.put(
  "/api/v1/operatorUploadDocu/reject",
  allowedRoles(["Tourism Officer"]),
  rejectOperatorUploadDocuController
);

app.put(
  "/api/v1/operatorUploadDocu/:documentId",
  upload.single("document"),
  authenticateTourOperator,
  editOperatorUploadDocuController
);
app.get(
  "/api/v1/operatorUploadDocu/doc/:documentId",
  authenticateTourOperator,
  getOperatorUploadDocuByIdController
);

app.get(
  "/api/v1/operatorUploadDocu/user/:userId",
  allowedRoles(["Tourism Staff", "Tourism Officer", "Tour Operator"]),
  getOperatorUploadByUserIdController
);

// Routes for Admin verifying applicants
app.get("/api/v1/guideApplicants", viewTourGuideApplicantsController);
app.get(
  "/api/v1/guideApplicants/:applicantId",
  allowedRoles(["Tourism Staff", "Tourism Officer", "Admin"]),
  viewTourGuideApplicantDetailsController
);
app.put(
  "/api/v1/guideApplicants/:applicantId/approve",
  allowedRoles(["Tourism Staff", "Tourism Officer", "Admin"]),
  approveTourGuideApplicantController
);
app.put(
  "/api/v1/guideApplicants/:applicantId/reject",
  allowedRoles(["Tourism Staff", "Tourism Officer", "Admin"]),
  rejectTourGuideApplicantController
);
app.get(
  "/api/v1/operatorApplicants",
  allowedRoles(["Tourism Staff", "Tourism Officer", "Admin", "Tour Operator"]),
  viewTourOperatorApplicantsController
);
app.get(
  "/api/v1/operatorApplicants/:applicantId",
  allowedRoles(["Tourism Staff", "Tourism Officer", "Admin", "Tour Operator"]),
  viewTourOperatorApplicantDetailsController
);
app.put(
  "/api/v1/operatorApplicants/:applicantId/approve",
  allowedRoles(["Tourism Staff", "Tourism Officer"]),
  approveTourOperatorApplicantController
);
app.put(
  "/api/v1/operatorApplicants/:applicantId/reject",
  allowedRoles(["Tourism Staff", "Tourism Officer"]),
  rejectTourOperatorApplicantController
);
app.get(
  "/api/v1/operator-applicants/by-user/:userId",
  getOperatorApplicantByUserIdController
);
app.get(
  "/api/v1/operator/:operatorId/guide-feedbacks",
  allowedRoles(["Tourism Officer", "Tour Operator"]),
  getGuideFeedbacksForOperatorController
);

// Routes for Tour Guides applying to Tour Operators
app.post(
  "/api/v1/applyToOperator",
  allowedRoles(["Tour Guide"]),
  applyToTourOperatorController
);

app.get(
  "/api/v1/applyToOperator/applications",
  allowedRoles(["Tour Guide", "Tour Operator"]),
  fetchAllApplicationsController
);
app.get(
  "/api/v1/applyToOperator/applications/:applicationId",
  allowedRoles(["Tour Guide", "Tour Operator"]),
  fetchGuideApplicationController
);

app.get(
  "/api/v1/applications/:operatorId",
  authenticateTourOperator,
  getApplicationsForTourOperatorController
);

app.put(
  "/api/v1/applications/:applicationId/approve/:touroperatorId",
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
  allowedRoles(["Admin", "Tourism Staff", "Tourism Officer"]),
  upload.array("images", 5),
  createTouristSpotController
);
app.put(
  "/api/v1/tourist-spots/:touristSpotId",
  allowedRoles(["Admin", "Tourism Staff", "Tourism Officer"]),
  upload.array("images", 5),
  editTouristSpotController
);

app.put(
  "/api/v1/tourist-spots/:touristSpotId/assign-staff",
  allowedRoles(["Tourism Officer"]),
  assignAttractionToStaffController
);

app.delete(
  "/api/v1/tourist-spots/:touristSpotId",
  allowedRoles(["Admin", "Tourism Staff", "Tourism Officer"]),
  deleteTouristSpotController
);
app.get("/api/v1/tourist-spots", viewTouristSpotsController);
app.get("/api/v1/tourist-spots/:touristSpotId", viewTouristSpotByIdController);

app.delete(
  "/api/v1/tourist-spots/images/:imageId",
  allowedRoles(["Admin", "Tourism Staff", "Tourism Officer"]),
  deleteTouristSpotImageController
);

// Rules & Regulations Routes
app.post(
  "/api/v1/rules",
  allowedRoles(["Admin", "Tourism Staff", "Tourism Officer"]),
  createRuleController
);
app.put(
  "/api/v1/rules/:ruleId",
  allowedRoles(["Admin", "Tourism Staff", "Tourism Officer"]),
  editRuleController
);
app.delete(
  "/api/v1/rules/:ruleId",
  allowedRoles(["Admin", "Tourism Staff", "Tourism Officer"]),
  deleteRuleController
);
app.get("/api/v1/rules", viewRulesController);
app.get("/api/v1/rules/:ruleId", viewRuleByIdController);

// Routes — Articles
app.post(
  "/api/v1/articles",
  allowedRoles(["Admin", "Cultural Director"]),
  upload.array("images", 5),
  createArticleController
);

app.put(
  "/api/v1/articles/:articleId",
  allowedRoles(["Admin", "Cultural Director"]),
  upload.array("images", 5),
  editArticleController
);

app.delete(
  "/api/v1/articles/:articleId",
  allowedRoles(["Admin", "Cultural Director"]),
  deleteArticleController
);

app.get("/api/v1/articles", viewArticlesController);

app.get("/api/v1/articles/:articleId", viewArticleByIdController);

app.post(
  "/api/v1/articles/:articleId/images",
  allowedRoles(["Admin", "Cultural Director"]),
  upload.array("images", 5),
  uploadArticleImagesController
);

app.delete(
  "/api/v1/articles/images/:imageId",
  allowedRoles(["Admin", "Cultural Director"]),
  deleteArticleImageController
);

// Routes for Accommodations
app.post(
  "/api/v1/accommodations",
  authenticateAdmin,
  createAccommodationController
);
app.put(
  "/api/v1/accommodations/:accommodationId",
  authenticateAdmin,
  editAccommodationController
);
app.delete(
  "/api/v1/accommodations/:accommodationId",
  authenticateAdmin,
  deleteAccommodationController
);
app.get("/api/v1/accommodations", viewAccommodationsController);
app.get(
  "/api/v1/accommodations/tourism-staff",
  allowedRoles(["Tourism Officer"]),
  getAllTourismStaffController
);
app.get(
  "/api/v1/accommodations/:accommodationId",
  viewAccommodationByIdController
);

app.get(
  "/api/v1/accommodations/logs/:accommodationId",
  allowedRoles(["Tourism Staff"]),
  getAccommodationLogsByAccommodationIdController
);

app.put(
  "/api/v1/accommodations/:accommodationId/assign-staff",
  allowedRoles(["Tourism Officer"]),
  assignTourismStaffController
);

// Visitor Registration Route
app.get(
  "/api/v1/register/members/:unique_code",
  getVisitorGroupMembersController
);
app.get(
  "/api/v1/register/qr/:user_id",
  allowedRoles(["Tourist"]),
  getQRCodebyUserIdController
);
app.get(
  "/api/v1/register/result/:unique_code",
  allowedRoles(["Tourist", "Tourism Staff"]),
  getVisitorResultController
);
app.post(
  "/api/v1/register",
  allowedRoles(["Tourist"]),
  registerVisitorController
);
app.post("/api/v1/register/manual-check-in", manualCheckInController);
app.post(
  "/api/v1/register/walk-in",
  allowedRoles(["Tourism Staff"]),
  registerWalkInVisitorController
);
app.get("/api/v1/visitor/history", authenticateUser, visitorHistoryController);

// Island Entry Registration Routes
app.post("/api/v1/island-entry/register", registerIslandEntryController);
app.post(
  "/api/v1/island-entry/manual-check-in",
  manualIslandEntryCheckInController
);
app.post("/api/v1/island-entry/walk-in", registerIslandWalkInController);
app.get(
  "/api/v1/island-entry/members/:unique_code",
  getIslandEntryMembersController
);
app.post("/api/v1/island-entry/status", checkPayMongoPaymentStatusController);
app.get(
  "/api/v1/island-entry",
  allowedRoles(["Tourism Officer"]),
  getAllIslandEntriesController
);
app.get(
  "/api/v1/island-entry/latest",
  authenticateUser,
  getLatestIslandEntryController
);
app.post("/api/v1/island-entry/mark-paid", markIslandEntryPaidController);

// Routes — Tour Packages
app.post(
  "/api/v1/tour-packages",
  allowedRoles(["Tour Operator"]),
  createTourPackageController
);
app.put(
  "/api/v1/tour-packages/:id",
  // authenticateTourOperator,
  allowedRoles(["Tour Operator"]),
  updateTourPackageController
);

app.patch(
  "/api/v1/tour-packages/:id/status",
  allowedRoles(["Tour Operator"]),
  updateTourPackageStatusController
);

app.delete(
  "/api/v1/tour-packages/:id",
  // authenticateTourOperator,
  allowedRoles(["Tour Operator"]),
  deleteTourPackageController
);
app.get(
  "/api/v1/tour-packages",
  // authenticateTourOperator,
  allowedRoles(["Tour Guide", "Tour Operator", "Tourist"]),
  viewTourPackagesController
);

app.get("/api/v1/tour-packages/all", viewAllTourPackages);

app.get(
  "/api/v1/tour-packages/pkg/:id",
  // authenticateTourOperator,
  allowedRoles(["Tour Guide", "Tour Operator", "Tourist"]),
  viewTourPackageByIdController
);
app.get(
  "/api/v1/tour-packages/by-guide/:tourguide_id",
  allowedRoles(["Tour Guide"]),
  getTourPackagesByGuideController
);
app.get(
  "/api/v1/tour-packages/bookings/:packageId",
  allowedRoles(["Tour Operator"]),
  getBookingsByTourPackageController
);

// Routes for Google Calendar integration
app.get(
  "/api/v1/calendar/authorize",
  allowedRoles(["Tour Guide"]),
  authorizeGoogleCalendarController
);
app.get(
  "/api/v1/calendar/auth/callback",

  googleCalendarCallbackController
);

// Routes for booking (Tour Guide's Side)
app.patch(
  "/api/v1/bookings/guide/:bookingId/finish",
  allowedRoles(["Tour Operator"]),
  markBookingAsFinishedController
);
app.get(
  "/api/v1/bookings/guide",
  allowedRoles(["Tour Guide", "Tour Operator", "Tourist"]),
  getTourGuideBookingsFilteredController
);

// Routes for Booking
app.post(
  "/api/v1/bookings",
  upload.single("proof_of_payment"),
  createBookingController
);
app.put(
  "/api/v1/bookings/:id/status",
  allowedRoles(["Tour Operator"]),
  updateBookingStatusController
);
app.get(
  "/api/v1/bookings/tourist",
  allowedRoles(["Tourist"]),
  getTouristBookingsController
);
app.get(
  "/api/v1/bookings/package/:packageId",
  allowedRoles(["Tour Operator"]),
  getBookingsByPackageController
);
app.get(
  "/api/v1/bookings/:id",
  allowedRoles(["Tourist"]),
  getBookingByIdController
);
app.get(
  "/api/v1/bookings/tourist/filtered",
  allowedRoles(["Tourist"]),
  getTouristBookingsFilteredController
);
app.put(
  "/api/v1/bookings/:id/cancel",
  allowedRoles(["Tourist"]),
  cancelBookingController
);

app.get(
  "/api/v1/bookings/operator/:operatorId",
  allowedRoles(["Tour Operator"]),
  getBookingsByTourOperatorController
);
// Accommodation Logs Routes
app.post(
  "/api/v1/accommodation-logs",
  allowedRoles(["Tourism Staff"]),
  createAccommodationLogController
);
app.put(
  "/api/v1/accommodation-logs/:logId",
  authenticateTourismStaff,
  editAccommodationLogController
);
app.delete(
  "/api/v1/accommodation-logs/:logId",
  authenticateTourismStaff,
  deleteAccommodationLogController
);
//excel export for accommodation logs — MUST be placed before ":logId"
app.get("/api/v1/accommodation-logs/export", exportAccommodationLogController);
app.get("/api/v1/accommodation-logs", getAllAccommodationLogsController);
app.get("/api/v1/accommodation-logs/:logId", getAccommodationLogByIdController);

// Policy Routes
app.get("/api/v1/policies", getAllPoliciesController);
app.get("/api/v1/policies/:policyId", getPolicyByIdController);
app.get(
  "/api/v1/policies/type/:type([a-zA-Z0-9-_]+)",
  getPoliciesByTypeController
);
app.post("/api/v1/policies", authenticateAdmin, createPolicyController);
app.put("/api/v1/policies/:policyId", authenticateAdmin, editPolicyController);
app.delete(
  "/api/v1/policies/:policyId",
  authenticateAdmin,
  deletePolicyController
);

//tripadvisors temporary turned off
// app.get("/tripadvisor/hotels", getTripadvisorHotelsWithPhotos);

app.get(
  "/api/v1/visitor-logs",
  allowedRoles(["Tourism Officer", "Admin"]),
  getVisitorLogsWithSpotName
);
//Individual Visitor Log Export
app.get("/api/v1/visitor-logs/export", exportVisitorLogController);
//Visitor Summary Grouped by Month Export
app.get("/api/v1/visitor-summary/export", exportVisitorLogGroupController);

// Tourist submits feedback for guide/operator/spot
app.post(
  "/api/v1/feedback/submit",
  authenticateUser, // Tourist only
  submitFeedbackController
);

// 2. Tourism Officer views detailed answers of a feedback group (submitted set)
app.get(
  "/api/v1/feedback/group/:group_id",
  authenticateTourismOfficer,
  viewFeedbackGroupAnswersController
);

// 3. View all feedback for a specific entity (by ref_id & type)
// - Officer: can view all (spot, guide, operator)
// - Operator: can view feedback for them and their guides
// - Guide: can view feedback for themselves
// - Staff: can view feedback about them
app.get(
  "/api/v1/feedback/entity",
  allowedRoles(["Tourism Officer", "Tour Operator", "Tourism Staff"]),
  viewAllFeedbackForEntityController
);

// 4. Officer or Operator manages feedback questions (add/edit/delete)
app.post(
  "/api/v1/feedback/questions",
  authenticateTourismOfficer, // Or combine into authenticateOperatorOrOfficer
  createQuestionController
);
app.put(
  "/api/v1/feedback/questions/:id",
  authenticateTourismOfficer,
  editQuestionController
);
app.delete(
  "/api/v1/feedback/questions/:id",
  authenticateTourismOfficer,
  deleteQuestionController
);

// 5. Anyone can view feedback questions (for form rendering)
app.get(
  "/api/v1/feedback/my-spot-feedbacks",
  authenticateUser,
  getMySpotFeedbacksController
);
app.get(
  "/api/v1/feedback/my-operator-feedbacks",
  authenticateUser,
  getMyOperatorFeedbacksController
);
app.get(
  "/api/v1/feedback/my-guide-feedbacks",
  authenticateUser,
  getMyGuideFeedbacksController
);

app.get("/api/v1/feedback/questions/:type", viewQuestionsByTypeController);

// Routes for Incident Reports
app.post(
  "/api/v1/incident-report",
  upload.single("photo"),
  createIncidentReportController
);
app.get(
  "/api/v1/incident-report",
  // authenticateTourismOfficer,
  viewAllIncidentReportsController
);
app.get(
  "/api/v1/incident-report/user/:userId",
  // authenticateTourismOfficer,
  viewIncidentReportByUserController
);
app.patch("/api/v1/incident-report/:id/status", updateIncidentStatusController);

// Route for Tour Operator QR Code Upload
app.post(
  "/api/v1/operator-qr",
  upload.single("qr_image"),
  authenticateTourOperator,
  uploadOperatorQrController
);
app.get(
  "/api/v1/operator-qr/:operatorId",
  allowedRoles(["Tour Operator", "Tourist"]),
  getOperatorQrController
);

// Routes for Price Management
app.get("/api/v1/prices", getAllPricesController);
app.get("/api/v1/prices/active", getActivePriceController);
app.post("/api/v1/prices", authenticateTourismOfficer, createPriceController);
app.patch(
  "/api/v1/prices/:id/toggle",
  authenticateTourismOfficer,
  togglePriceController
);
app.patch("/api/v1/prices/:id/update", updatePriceDetailsController);
