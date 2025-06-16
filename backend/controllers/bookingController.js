const { getGoogleTokens } = require("../models/calendarModel.js");
const { oauth2Client } = require("../utils/calendar.js");
const { google } = require("googleapis");
const { getAssignedGuidesByPackage, getTourPackageById } = require("../models/tourPackagesModel.js");
const {
  createBooking,
  updateBookingStatus,
  getBookingsByTourist,
  getBookingsByPackage,
  getBookingById,
} = require("../models/bookingModel.js");
const { s3Client, PutObjectCommand } = require("../utils/s3.js");

const createBookingController = async (req, res) => {
  try {
    const tourist_id = req.user?.id || 31; // 31 is hard coded for manual testing
    const {
      tour_package_id,
      scheduled_date,
      number_of_guests,
      total_price,
      notes
    } = req.body;

    if (!tour_package_id || !scheduled_date || !number_of_guests || !total_price) {
      return res.status(400).json({ error: "Missing required booking fields." });
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
      return res.status(400).json({ error: "Upload image for proof of payment is required." });
    }

    const newBooking = await createBooking({
      tourist_id,
      tour_package_id,
      scheduled_date,
      number_of_guests,
      total_price,
      notes,
      proof_of_payment,
    });

    res.status(201).json({ message: "Booking created successfully", newBooking });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

const updateBookingStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await updateBookingStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (status === "APPROVED") {
      const booking = await getBookingById(id);
      const { scheduled_date, tour_package_id } = booking;
      const assignedGuides = await getAssignedGuidesByPackage(tour_package_id);
      const tourPackage = await getTourPackageById(tour_package_id);

      const dateOnly = new Date(scheduled_date).toISOString().split("T")[0];
      // this is to make sure that YYYY-MM-DD format is used, in order to build the calendar event correctly

      const event = {
        summary: tourPackage.package_name || "Tour Booking",
        location: tourPackage.location,
        description: `Booking ID ${id} - Tour for ${booking.number_of_guests} guest(s)`,
        start: {
          dateTime: `${dateOnly}T${tourPackage.start_time}+08:00`,
          timeZone: "Asia/Manila",
        },
        end: {
          dateTime: `${dateOnly}T${tourPackage.end_time}+08:00`,
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
          console.error(`Calendar sync failed for guide ${guide.tourguide_id}:`, calendarErr.message);
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


module.exports = {
  createBookingController,
  updateBookingStatusController,
  getTouristBookingsController,
  getBookingsByPackageController,
  getBookingByIdController,
  getTouristBookingsFilteredController
};
