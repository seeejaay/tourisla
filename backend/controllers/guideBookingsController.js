const e = require("express");
const { updateBookingStatus } = require("../models/bookingModel.js");
const { getBookingsByGuideWithTimeFilter } = require("../models/guideBookingsModel.js");

// tour guide marks booking as finished
const markBookingAsFinishedController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await updateBookingStatus(bookingId, "FINISHED");
    res.json({ message: "Booking marked as finished", result });
  } catch (err) {
    console.error("Error marking as finished:", err.stack);
    res.status(500).json({ error: "Failed to mark as finished" });
  }
};

// tour guide fetches all bookings with time filter
const getTourGuideBookingsFilteredController = async (req, res) => {
  try {
    const guideId = req.user?.id || 4; // fallback ID for manual testing
    const filter = req.query.filter?.toUpperCase();

    const allowed = ["PAST", "TODAY", "UPCOMING"];
    if (filter && !allowed.includes(filter)) {
      return res.status(400).json({ error: "Invalid time filter" });
    }
    
    const bookings = await getBookingsByGuideWithTimeFilter(guideId, filter);
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching tour guide bookings:", err.stack);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

module.exports = {
  markBookingAsFinishedController,
  getTourGuideBookingsFilteredController,
};
