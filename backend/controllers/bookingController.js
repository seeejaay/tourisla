const { getGoogleTokens } = require("../models/calendarModel.js");
const { oauth2Client } = require("../utils/calendar.js");
const { google } = require("googleapis");
const {
  getAssignedGuidesByPackage,
  getTourPackageById,
} = require("../models/tourPackagesModel.js");

const { getOperatorRegisById } = require("../models/operatorRegisModel.js");

const {
  createBooking,
  updateBookingStatus,
  getBookingsByTourist,
  getBookingsByPackage,
  getBookingById,
  getFilteredBookingsByTourist,
  getBookingsByTourOperatorId,
  getTotalEarningsByTourOperator,
  getEarningsByPackageForTourOperator,
  getMonthlyEarningsByTourOperator,
} = require("../models/bookingModel.js");
const { s3Client, PutObjectCommand } = require("../utils/s3.js");

const createBookingController = async (req, res) => {
  try {
    console.log("Creating booking with data:", req.body);
    const user = req.session.user;
    if (!user || user.role !== "Tourist") {
      return res
        .status(403)
        .json({ error: "Only tourists can create bookings." });
    }
    const tourist_id = user.id;

    // Accept companions from the request body
    let {
      package_id,
      scheduled_date,
      number_of_guests,
      total_price,
      notes,
      companions,
    } = req.body;
    if (typeof companions === "string") {
      try {
        companions = JSON.parse(companions);
      } catch (e) {
        companions = [];
      }
    }
    if (!package_id || !scheduled_date || !number_of_guests || !total_price) {
      return res
        .status(400)
        .json({ error: "Missing required booking fields." });
    }

    let proof_of_payment = null;
    if (req.file) {
      const file = req.file;
      const s3Key = `bookings/${tourist_id}/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      proof_of_payment = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } else {
      return res
        .status(400)
        .json({ error: "Upload image for proof of payment is required." });
    }

    // Pass companions to createBooking
    const newBooking = await createBooking({
      tourist_id,
      tour_package_id: package_id,
      scheduled_date,
      number_of_guests,
      total_price,
      notes,
      proof_of_payment,
      companions: companions || [],
    });

    res
      .status(201)
      .json({ message: "Booking created successfully", newBooking });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

const updateBookingStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const newStatus = status.toUpperCase();

    if (!["APPROVED", "REJECTED"].includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await updateBookingStatus(id, newStatus);
    if (!updated) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (newStatus === "APPROVED") {
      const booking = await getBookingById(id);
      const { scheduled_date, tour_package_id } = booking;
      const assignedGuides = await getAssignedGuidesByPackage(tour_package_id);
      const tourPackage = await getTourPackageById(tour_package_id);

      // to handle 1-day tours vs multi-day tours
      const startDate = new Date(scheduled_date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + tourPackage.duration_days - 1);

      const padTime = (t) => (t.length === 5 ? `${t}:00` : t); // Adds :00 if missing
      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];
      console.log("ADDING TO CALENDAR");
      const event = {
        summary: tourPackage.package_name || "Tour Booking",
        location: tourPackage.location,
        description: `Booking ID ${id} - Tour for ${booking.number_of_guests} guest(s)`,
        start: {
          dateTime: `${formattedStart}T${padTime(tourPackage.start_time)}+08:00`,
          timeZone: "Asia/Manila",
        },
        end: {
          dateTime: `${formattedEnd}T${padTime(tourPackage.end_time)}+08:00`,
          timeZone: "Asia/Manila",
        },
      };

      for (const guide of assignedGuides) {
        const tokens = await getGoogleTokens(guide.tourguide_id);
        if (!tokens) continue;

        oauth2Client.setCredentials({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: new Date(tokens.token_expiry).getTime(),
        });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        try {
          await calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });
        } catch (calendarErr) {
          console.error(
            `Calendar sync failed for guide ${guide.tourguide_id}:`,
            calendarErr.message
          );
        }
      }
    }

    res.json({ message: "Booking status updated", booking: updated });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update status" });
  }
};

const getTouristBookingsController = async (req, res) => {
  try {
    const touristId = req.user?.id || 31; // 31 is hard coded for manual testing
    const bookings = await getBookingsByTourist(touristId);
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err.stack);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

const getBookingsByPackageController = async (req, res) => {
  try {
    const { packageId } = req.params;
    const bookings = await getBookingsByPackage(packageId);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

const getBookingByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

const getTouristBookingsFilteredController = async (req, res) => {
  try {
    const touristId = req.user?.id || 31; // fallback for testing
    const filter = req.query.filter?.toUpperCase(); // e.g. ?filter=PAST

    const allowedFilters = ["PAST", "TODAY", "UPCOMING"];
    if (filter && !allowedFilters.includes(filter)) {
      return res.status(400).json({ error: "Invalid time filter" });
    }

    const bookings = await getFilteredBookingsByTourist(touristId, filter);
    res.json(bookings);
  } catch (err) {
    console.error("Error filtering tourist bookings:", err.stack);
    res.status(500).json({ error: "Failed to fetch filtered bookings" });
  }
};

const cancelBookingController = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Fetch tour package to check cancellation policy
    const tourPackage = await getTourPackageById(booking.tour_package_id);
    if (!tourPackage) {
      return res.status(404).json({ error: "Tour package not found" });
    }

    // If no cancellation_days set, deny cancellation
    if (!tourPackage.cancellation_days) {
      return res
        .status(403)
        .json({ error: "This package does not support cancellation." });
    }

    // Calculate how many days before the tour the cancellation is made
    const today = new Date();
    const scheduledDate = new Date(booking.scheduled_date);
    const timeDiff = scheduledDate.getTime() - today.getTime();
    const daysBefore = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // convert ms to days

    // If cancelled too late (less than allowed days), deny cancellation
    if (daysBefore < tourPackage.cancellation_days) {
      return res.status(403).json({
        error: `Cancellations are not allowed less than ${tourPackage.cancellation_days} day(s) before the tour.`,
      });
    }

    const daysLate = tourPackage.cancellation_days - daysBefore;
    let refundPercent = 100 - daysLate * 25;

    // Cap refund between 0 and 100
    if (refundPercent < 0) refundPercent = 0;
    if (refundPercent > 100) refundPercent = 100;

    // Update booking status to CANCELLED
    const cancelledBooking = await updateBookingStatus(bookingId, "CANCELLED");
    if (!cancelledBooking) {
      return res
        .status(500)
        .json({ error: "Failed to update booking status." });
    }

    return res.json({
      message: `Booking cancelled successfully. Expect your ${refundPercent}% refund within 24-48 hours.`,
      booking: cancelledBooking,
    });
  } catch (err) {
    console.error("Cancel Booking Error:", err);
    return res
      .status(500)
      .json({ error: "Failed to cancel booking", details: err.message });
  }
};

const getBookingsByTourOperatorController = async (req, res) => {
  try {
    const user = req.session.user;
    console.log("User from session:", user);
    const tourOperatorId = user.id;
    console.log("Tour Operator ID:", tourOperatorId);
    if (!tourOperatorId) {
      return res.status(403).json({ error: "Tour operator ID is required." });
    }
    const operatorRegis = await getOperatorRegisById(tourOperatorId);

    if (!operatorRegis) {
      return res.status(404).json({ error: "Tour operator not found." });
    }
    const tourOperator_Id = operatorRegis.id;
    console.log("Tour Operator Registration ID:", tourOperator_Id);
    const bookings = await getBookingsByTourOperatorId(tourOperator_Id);
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching tour operator bookings:", err.stack);
    res.status(500).json({ error: "Failed to fetch tour operator bookings" });
  }
};

const getTotalEarningsController = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(403).json({ error: "Not authenticated." });

    const operatorRegis = await getOperatorRegisById(user.id);
    if (!operatorRegis)
      return res.status(404).json({ error: "Tour operator not found." });

    const { dateRange } = req.query;
    const total = await getTotalEarningsByTourOperator(
      operatorRegis.id,
      dateRange
    );
    res.json({ totalEarnings: total });
  } catch (err) {
    console.error("Error fetching total earnings:", err);
    res.status(500).json({ error: "Failed to fetch total earnings" });
  }
};

const getEarningsByPackageController = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(403).json({ error: "Not authenticated." });

    const operatorRegis = await getOperatorRegisById(user.id);
    if (!operatorRegis)
      return res.status(404).json({ error: "Tour operator not found." });

    const { dateRange } = req.query;
    const earnings = await getEarningsByPackageForTourOperator(
      operatorRegis.id,
      dateRange
    );
    res.json(earnings);
  } catch (err) {
    console.error("Error fetching earnings by package:", err);
    res.status(500).json({ error: "Failed to fetch earnings by package" });
  }
};

const getMonthlyEarningsController = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(403).json({ error: "Not authenticated." });

    const operatorRegis = await getOperatorRegisById(user.id);
    if (!operatorRegis)
      return res.status(404).json({ error: "Tour operator not found." });

    const { dateRange } = req.query;
    const monthly = await getMonthlyEarningsByTourOperator(
      operatorRegis.id,
      dateRange
    );
    res.json(monthly);
  } catch (err) {
    console.error("Error fetching monthly earnings:", err);
    res.status(500).json({ error: "Failed to fetch monthly earnings" });
  }
};

module.exports = {
  createBookingController,
  updateBookingStatusController,
  getTouristBookingsController,
  getBookingsByPackageController,
  getBookingByIdController,
  getTouristBookingsFilteredController,
  cancelBookingController,
  getBookingsByTourOperatorController,
  getTotalEarningsController,
  getEarningsByPackageController,
  getMonthlyEarningsController,
};
