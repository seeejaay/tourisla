const db = require("../db/index.js");

const createAnnouncement = async (announcementData) => {
  const { title, description, date_posted, location, image_url, category } =
    announcementData;

  const result = await db.query(
    "INSERT INTO announcements (title, description, date_posted, location, image_url, category) VALUES ($1, $2, COALESCE($3, NOW()), $4, $5, $6) RETURNING *",
    [title, description, date_posted, location, image_url, category]
  );

  return result.rows[0];
};

const editAnnouncement = async (announcementId, announcementData) => {
  const { title, description, date_posted, location, image_url, category } =
    announcementData;

  const result = await db.query(
    "UPDATE announcements SET title = $1, description = $2, date_posted = $3, location = $4, image_url = $5, category = $6 WHERE id = $7 RETURNING *",
    [title, description, date_posted, location, image_url, category, announcementId]
  );

  return result.rows[0];
};

// i dunno if delete or archive??
const deleteAnnouncement = async (announcementId) => {
  const result = await db.query(
    "DELETE FROM announcements WHERE id = $1 RETURNING *",
    [announcementId]
  );

  return result.rows[0];
};

const getAllAnnouncements = async () => {
  const result = await db.query("SELECT * FROM announcements");
  return result.rows;
};

const getAnnouncementById = async (announcementId) => {
  const result = await db.query("SELECT * FROM announcements WHERE id = $1", [
    announcementId,
  ]);
  return result.rows[0];
};

// havent finalized which categories yet, refer to bantayan modules
const getAnnouncementsByCategory = async (category) => {
  const result = await db.query(
    "SELECT * FROM announcements WHERE category = $1",
    [category]
  );
  return result.rows;
};

module.exports = {
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  getAnnouncementsByCategory,
};
