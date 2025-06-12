const db = require("../db/index.js");
const { google } = require("googleapis");
const { getGoogleTokens } = require('../models/calendarModel');
const { oauth2Client } = require('../utils/calendar.js');

const getAvailableGuidesByPackage = async (packageId) => {
  const query = `
    SELECT 
      tg.id AS tourguide_id,
      tg.first_name || ' ' || tg.last_name AS full_name,
      tg.email,
      tga.notes
    FROM 
      tour_guide_assignments tga
    JOIN 
      tourguide_applicants tg ON tg.id = tga.tourguide_id
    WHERE 
      tga.tour_package_id = $1 AND tga.is_available = true
  `;

  const result = await db.query(query, [packageId]);
  return result.rows;
};

const createBooking = async (bookingData) => {
  const {
    tourist_id,
    tour_package_id,
    tour_guide_id,
    start_date,
    end_date,
    num_guests,
    total_price,
    status,
    notes,
  } = bookingData;

  const query = `
    INSERT INTO bookings 
    (tourist_id, tour_package_id, tour_guide_id, start_date, end_date, num_guests, total_price, status, notes) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    tourist_id,
    tour_package_id,
    tour_guide_id,
    start_date,
    end_date,
    num_guests,
    total_price,
    status,
    notes,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

// Get tour package name by ID
const getPackageNameById = async (packageId) => {
  const result = await db.query(
    `SELECT package_name FROM tour_packages WHERE id = $1`,
    [packageId]
  );

  return result.rows[0]?.package_name || null;
};

const syncBookingToCalendar = async ({
  tour_guide_id,
  package_name,
  start_date,
  end_date,
  num_guests,
  notes,
}) => {
  try {
    const tokens = await getGoogleTokens(tour_guide_id);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({
      version: 'v3',
      auth: oauth2Client,
    });

    const event = {
      summary: `Tour with ${num_guests} guests for ${package_name}`,
      description: notes || 'Tour booking from TourIsla.',
      start: {
        dateTime: new Date(start_date).toISOString(),
        timeZone: 'Asia/Manila',
      },
      end: {
        dateTime: new Date(end_date).toISOString(),
        timeZone: 'Asia/Manila',
      },
    };

    await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
  } catch (calendarError) {
    console.warn('Calendar sync failed:', calendarError.message);
  }
};

module.exports = {
  getAvailableGuidesByPackage,
  createBooking,
  getPackageNameById,
  syncBookingToCalendar,
};