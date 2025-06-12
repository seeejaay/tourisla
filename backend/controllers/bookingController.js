const e = require("express");
const {
    getAvailableGuidesByPackage,
    createBooking,
    getPackageNameById,
    syncBookingToCalendar,
} = require("../models/bookingModel.js");

// Get all tour guides per package
const getGuidesPerPackageController = async (req, res) => {
  const packageId = req.params.id;

  try {
    const guides = await getAvailableGuidesByPackage(packageId);
    if (!guides || guides.length === 0) {
      return res.status(404).json({ message: "No guides found for this package." });
    }
    res.json(guides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch guides for this package' });
  }
};

// Create a new booking (tourist) and sync to Google Calendar (tour guide)
const createBookingController = async (req, res) => {
  try {
    const touristId = req.user.id;
    const {
      tour_package_id,
      tour_guide_id,
      start_date,
      end_date,
      num_guests,
      total_price,
      notes
    } = req.body;

    if (!tour_package_id || !tour_guide_id || !start_date || !end_date || !num_guests || !total_price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await createBooking({
      tourist_id: touristId,
      tour_package_id,
      tour_guide_id,
      start_date,
      end_date,
      num_guests,
      total_price,
      status: 'CONFIRMED',
      notes
    });

    const package_name = await getPackageNameById(tour_package_id);
    if (!package_name) {
      return res.status(404).json({ error: 'Tour package not found' });
    }

    await syncBookingToCalendar({
      tour_guide_id,
      package_name,
      start_date,
      end_date,
      num_guests,
      notes
    });

    res.status(201).json({ message: "Booking confirmed", booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// View all bookings made by the logged-in tourist
const getTouristBookingsController = async (req, res) => {
  try {
    const touristId = req.user.id;
    const bookings = await getBookingsByTourist(touristId);
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

module.exports = {
  getGuidesPerPackageController,
  createBookingController,
  getTouristBookingsController
};