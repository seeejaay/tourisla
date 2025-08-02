const db = require("../db/index.js");

const createTourPackage = async ({
  touroperator_id,
  package_name,
  location,
  description,
  price,
  duration_days,
  inclusions,
  exclusions,
  available_slots,
  date_start,
  date_end,
  start_time,
  end_time,
  assigned_guides,
  cancellation_days,
  cancellation_note,
}) => {
  console.log(assigned_guides);
  const result = await db.query(
    `INSERT INTO tour_packages 
      (touroperator_id, package_name, location, description, price, duration_days, inclusions, exclusions, available_slots, date_start, date_end, start_time, end_time,cancellation_days, cancellation_note)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING *`,
    [
      touroperator_id,
      package_name,
      location,
      description,
      price,
      duration_days,
      inclusions,
      exclusions,
      available_slots,
      date_start,
      date_end,
      start_time,
      end_time,
      cancellation_days,
      cancellation_note,
    ]
  );
  const newPackage = result.rows[0];

  // Insert assigned tour guides only if they have google_tokens
  for (const guideId of assigned_guides) {
    const tokenRes = await db.query(
      `SELECT 1 FROM google_tokens WHERE tourguide_id = $1`,
      [guideId]
    );
    if (tokenRes.rowCount > 0) {
      await db.query(
        `INSERT INTO tourguide_assignments (tourguide_id, tour_package_id) VALUES ($1, $2)`,
        [guideId, newPackage.id]
      );
    }
  }

  return newPackage;
};

const updateTourPackage = async (id, touroperator_id, packageData) => {
  const {
    package_name,
    location,
    description,
    price,
    duration_days,
    inclusions,
    exclusions,
    available_slots,
    is_active,
    date_start,
    date_end,
    start_time,
    assigned_guides,
    end_time,
    cancellation_days,
    cancellation_note,
  } = packageData;

  // 1. Update the tour package main info
  const result = await db.query(
    `UPDATE tour_packages 
     SET package_name = $1, location = $2, description = $3, price = $4, duration_days = $5,
         inclusions = $6, exclusions = $7, available_slots = $8, is_active = $9,
         date_start = $10, date_end = $11, start_time = $12, end_time = $13, cancellation_days = $14, cancellation_note = $15, updated_at = NOW()
     WHERE id = $16 AND touroperator_id = $17
     RETURNING *`,
    [
      package_name,
      location,
      description,
      price,
      duration_days,
      inclusions,
      exclusions,
      available_slots,
      is_active || true,
      date_start,
      date_end,
      start_time,
      end_time,
      cancellation_days,
      cancellation_note,
      id,
      touroperator_id,
    ]
  );
  const updatedPackage = result.rows[0];

  // 2. Update assigned guides if provided
  if (assigned_guides) {
    // Remove all previous assignments for this package
    await db.query(
      `DELETE FROM tourguide_assignments WHERE tour_package_id = $1`,
      [id]
    );
    // Insert new assignments only if they have google_tokens
    for (const guideId of assigned_guides) {
      const tokenRes = await db.query(
        `SELECT 1 FROM google_tokens WHERE tourguide_id = $1`,
        [guideId]
      );
      if (tokenRes.rowCount > 0) {
        await db.query(
          `INSERT INTO tourguide_assignments (tourguide_id, tour_package_id) VALUES ($1, $2)`,
          [guideId, id]
        );
      }
    }
  }

  return updatedPackage;
};

const deleteTourPackage = async (id) => {
  const result = await db.query(
    `DELETE FROM tour_packages 
     WHERE id = $1 
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};

const getAllTourPackagesByOperator = async (touroperator_id) => {
  const result = await db.query(
    `SELECT tp.*, 
      EXISTS (
        SELECT 1 FROM bookings b WHERE b.tour_package_id = tp.id
      ) AS "hasBookings"
     FROM tour_packages tp
     WHERE tp.touroperator_id = $1`,
    [touroperator_id]
  );
  return result.rows;
};

const getTourPackageByIdForOperator = async (id, touroperator_id) => {
  const result = await db.query(
    `SELECT * FROM tour_packages 
     WHERE id = $1 AND touroperator_id = $2`,
    [id, touroperator_id]
  );
  return result.rows[0];
};

const getTourPackageById = async (id) => {
  const result = await db.query(`SELECT * FROM tour_packages WHERE id = $1`, [
    id,
  ]);
  return result.rows[0];
};

const getAssignedGuidesByPackage = async (packageId) => {
  const result = await db.query(
    `
    SELECT 
      tga.tourguide_id,
      tga.notes,
      ta.first_name,
      ta.last_name,
      ta.email
    FROM tourguide_assignments tga
    JOIN tourguide_applicants ta ON tga.tourguide_id = ta.id
    WHERE tga.tour_package_id = $1
    `,
    [packageId]
  );

  return result.rows;
};

const getTourPackagesByTourGuide = async (tourguide_id) => {
  const result = await db.query(
    `SELECT tp.*
     FROM tour_packages tp
     JOIN tourguide_assignments ta ON tp.id = ta.tour_package_id
     WHERE ta.tourguide_id = $1`,
    [tourguide_id]
  );
  return result.rows;
};

const getAllTourPackages = async () => {
  const result = await db.query(`
    SELECT 
      tp.*,
      topr.operator_name,
      topr.email AS operator_email,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'tourguide_id', tga.tourguide_id,
            'first_name', ta.first_name,
            'last_name', ta.last_name,
            'email', ta.email
          )
        ) FILTER (WHERE tga.tourguide_id IS NOT NULL), '[]'
      ) AS assigned_guides
    FROM tour_packages tp
    JOIN touroperator_applicants topr ON tp.touroperator_id = topr.id
    LEFT JOIN tourguide_assignments tga ON tp.id = tga.tour_package_id
    LEFT JOIN tourguide_applicants ta ON tga.tourguide_id = ta.id
    GROUP BY tp.id, topr.operator_name, topr.email
    ORDER BY tp.id
  `);

  return result.rows;
};

const getBookingsByTourPackage = async (packageId) => {
  const result = await db.query(
    `SELECT * FROM bookings WHERE tour_package_id = $1`,
    [packageId]
  );
  return result.rows;
};

const updateTourPackageStatus = async (id, is_active) => {
  const result = await db.query(
    `UPDATE tour_packages 
       SET is_active = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
    [is_active, id]
  );
  return result.rows[0];
};

module.exports = {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getBookingsByTourPackage,
  getAllTourPackagesByOperator,
  getTourPackageByIdForOperator,
  getTourPackageById,
  getAssignedGuidesByPackage,
  getTourPackagesByTourGuide,
  getAllTourPackages,
  updateTourPackageStatus,
};
